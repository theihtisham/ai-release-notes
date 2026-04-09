'use strict';

const { CONVENTIONAL_COMMIT_REGEX } = require('./constants');
const logger = require('./logger');

/**
 * Categorize commits into configured categories using conventional commit patterns.
 * @param {Array} commits - Array of commit objects
 * @param {Array} categories - Array of category definitions with label and patterns
 * @returns {Object} Map of category labels to arrays of changes
 */
function categorizeCommits(commits, categories) {
  const categorized = {};

  // Initialize all categories as empty arrays
  for (const cat of categories) {
    categorized[cat.label] = [];
  }
  categorized['🔄 Other Changes'] = [];

  if (!commits || commits.length === 0) {
    logger.debug('No commits to categorize');
    return categorized;
  }

  for (const commit of commits) {
    try {
      const message = commit.message || (commit.commit && commit.commit.message) || '';
      const result = categorizeSingle(message, categories, commit);
      const targetCategory = result.category || '🔄 Other Changes';
      if (!categorized[targetCategory]) {
        categorized[targetCategory] = [];
      }
      categorized[targetCategory].push(result.change);
    } catch (err) {
      logger.warn(`Failed to categorize commit: ${err.message}`);
      categorized['🔄 Other Changes'].push({
        description: commit.message || 'Unknown change',
        commit: commit.sha || '',
      });
    }
  }

  // Remove empty categories
  for (const key of Object.keys(categorized)) {
    if (categorized[key].length === 0) {
      delete categorized[key];
    }
  }

  return categorized;
}

/**
 * Categorize a single commit message.
 */
function categorizeSingle(message, categories, commit) {
  const match = message.match(CONVENTIONAL_COMMIT_REGEX);

  if (match) {
    const type = match[1].toLowerCase();
    const scope = match[3] || '';
    const breaking = !!match[4];
    const description = match[5] || message;

    // Find matching category
    let matchedCategory = null;
    for (const cat of categories) {
      if (cat.patterns.some(p => p.toLowerCase() === type)) {
        matchedCategory = cat.label;
        break;
      }
    }

    if (!matchedCategory) {
      matchedCategory = '🔄 Other Changes';
    }

    return {
      category: matchedCategory,
      change: {
        type: type,
        scope: scope,
        description: description,
        breaking: breaking,
        pr: extractPRNumber(message),
        sha: commit.sha || '',
        author: commit.author?.login || (commit.author && commit.author.login) || '',
        commit: commit,
      },
    };
  }

  // Fallback: keyword matching against category patterns
  const lowerMessage = message.toLowerCase();
  for (const cat of categories) {
    for (const pattern of cat.patterns) {
      if (lowerMessage.includes(pattern.toLowerCase())) {
        return {
          category: cat.label,
          change: {
            type: pattern,
            scope: '',
            description: message,
            breaking: false,
            pr: extractPRNumber(message),
            sha: commit.sha || '',
            author: commit.author?.login || (commit.author && commit.author.login) || '',
            commit: commit,
          },
        };
      }
    }
  }

  // Default: Other Changes
  return {
    category: '🔄 Other Changes',
    change: {
      type: 'other',
      scope: '',
      description: message,
      breaking: false,
      pr: extractPRNumber(message),
      sha: commit.sha || '',
      author: commit.author?.login || (commit.author && commit.author.login) || '',
      commit: commit,
    },
  };
}

/**
 * Extract PR number from commit message (e.g., (#123))
 */
function extractPRNumber(message) {
  const match = message.match(/\(#(\d+)\)/);
  return match ? parseInt(match[1], 10) : null;
}

/**
 * Deduplicate changes that appear in both commits and PRs.
 * Keeps the richer data source (PR > commit).
 */
function deduplicateChanges(categorized) {
  const seen = new Map();

  for (const [category, changes] of Object.entries(categorized)) {
    const deduped = [];
    for (const change of changes) {
      const key = change.description.toLowerCase().trim();
      if (seen.has(key)) {
        // Merge: prefer the one with more data
        const existing = seen.get(key);
        const merged = {
          ...existing,
          ...change,
          pr: change.pr || existing.pr,
          scope: change.scope || existing.scope,
          author: change.author || existing.author,
        };
        const idx = deduped.findIndex(c => c.description.toLowerCase().trim() === key);
        if (idx !== -1) {
          deduped[idx] = merged;
        }
        seen.set(key, merged);
      } else {
        deduped.push(change);
        seen.set(key, change);
      }
    }
    categorized[category] = deduped;
  }

  return categorized;
}

module.exports = {
  categorizeCommits,
  categorizeSingle,
  extractPRNumber,
  deduplicateChanges,
};
