'use strict';

const { CONVENTIONAL_COMMIT_REGEX, BREAKING_CHANGE_REGEX } = require('./constants');
const { categorizeCommits, deduplicateChanges } = require('./categorizer');
const { getContributors } = require('./contributor');
const logger = require('./logger');

/**
 * Analyze commits and produce a structured analysis.
 * @param {Array} commits - Array of commit objects from GitHub API
 * @param {Object} config - Configuration object
 * @returns {Object} Structured analysis with categories, breaking changes, contributors, scopes, stats
 */
function analyzeCommits(commits, config) {
  logger.info(`Analyzing ${commits ? commits.length : 0} commits`);

  if (!commits || commits.length === 0) {
    return {
      categories: {},
      breaking: [],
      contributors: [],
      scopes: {},
      stats: {
        total_commits: 0,
        total_prs: 0,
        total_files_changed: 0,
        additions: 0,
        deletions: 0,
      },
      linkedIssues: [],
    };
  }

  const parsedCommits = commits.map(parseCommit).filter(Boolean);
  const categories = categorizeCommits(parsedCommits, config.categories);
  const dedupedCategories = deduplicateChanges(categories);
  const breaking = extractBreakingChanges(parsedCommits);
  const contributors = getContributors(commits, null);
  const scopes = extractScopes(parsedCommits);
  const stats = computeStats(parsedCommits);
  const linkedIssues = extractLinkedIssues(parsedCommits);

  logger.info(`Analysis complete: ${stats.total_commits} commits, ${Object.keys(dedupedCategories).length} categories, ${breaking.length} breaking changes`);

  return {
    categories: dedupedCategories,
    breaking: breaking,
    contributors: contributors,
    scopes: scopes,
    stats: stats,
    linkedIssues: linkedIssues,
  };
}

/**
 * Parse a single commit into structured data.
 */
function parseCommit(commit) {
  try {
    const message = commit.message || (commit.commit && commit.commit.message) || '';
    const match = message.match(CONVENTIONAL_COMMIT_REGEX);

    if (!match) {
      return {
        ...commit,
        _type: 'other',
        _scope: '',
        _description: message,
        _breaking: false,
        _pr: null,
        _body: '',
      };
    }

    const type = match[1].toLowerCase();
    const scope = match[3] || '';
    const breakingBang = !!match[4];
    const description = match[5] || '';

    // Extract body (everything after first line)
    const lines = message.split('\n');
    const body = lines.slice(1).join('\n').trim();

    // Check for BREAKING CHANGE in body
    const breakingMatch = body.match(BREAKING_CHANGE_REGEX);
    const hasBreakingFooter = !!breakingMatch;
    const breakingDescription = breakingMatch ? breakingMatch[1] : '';

    return {
      ...commit,
      _type: type,
      _scope: scope,
      _description: description,
      _breaking: breakingBang || hasBreakingFooter,
      _breakingDescription: breakingDescription,
      _pr: extractPRNumber(message),
      _body: body,
    };
  } catch (err) {
    logger.debug(`Failed to parse commit: ${err.message}`);
    return null;
  }
}

/**
 * Extract PR number from commit message.
 */
function extractPRNumber(message) {
  const match = message.match(/\(#(\d+)\)/);
  return match ? parseInt(match[1], 10) : null;
}

/**
 * Extract breaking changes from parsed commits.
 */
function extractBreakingChanges(parsedCommits) {
  const breaking = [];

  for (const commit of parsedCommits) {
    if (!commit) continue;
    if (commit._breaking) {
      breaking.push({
        description: commit._breakingDescription || commit._description,
        commit: commit.sha || '',
        scope: commit._scope || '',
        type: commit._type || '',
        pr: commit._pr,
        migration_guide: extractMigrationGuide(commit._body),
      });
    }
  }

  return breaking;
}

/**
 * Try to extract migration guide from commit body.
 */
function extractMigrationGuide(body) {
  if (!body) return '';
  // Look for migration guidance patterns
  const patterns = [
    /Migration Guide:\s*([\s\S]*?)(?=\n\n|\n##|$)/i,
    /How to migrate:\s*([\s\S]*?)(?=\n\n|\n##|$)/i,
    /To migrate[\s\S]*?:\s*([\s\S]*?)(?=\n\n|\n##|$)/i,
  ];

  for (const pattern of patterns) {
    const match = body.match(pattern);
    if (match) return match[1].trim();
  }

  return '';
}

/**
 * Extract and count scopes from parsed commits.
 */
function extractScopes(parsedCommits) {
  const scopes = {};
  for (const commit of parsedCommits) {
    if (!commit) continue;
    const scope = commit._scope;
    if (scope) {
      scopes[scope] = (scopes[scope] || 0) + 1;
    }
  }
  return scopes;
}

/**
 * Compute aggregate stats from parsed commits.
 */
function computeStats(parsedCommits) {
  let totalPrs = 0;
  let totalFilesChanged = 0;
  let additions = 0;
  let deletions = 0;

  for (const commit of parsedCommits) {
    if (!commit) continue;
    if (commit._pr) totalPrs++;
    if (commit.files) totalFilesChanged += commit.files.length || commit.files;
    if (commit.stats) {
      additions += commit.stats.additions || 0;
      deletions += commit.stats.deletions || 0;
    }
  }

  return {
    total_commits: parsedCommits.filter(Boolean).length,
    total_prs: totalPrs,
    total_files_changed: totalFilesChanged,
    additions: additions,
    deletions: deletions,
  };
}

/**
 * Extract linked issue numbers from commit messages.
 */
function extractLinkedIssues(parsedCommits) {
  const issues = [];
  const seen = new Set();

  for (const commit of parsedCommits) {
    if (!commit) continue;
    const message = commit.message || (commit.commit && commit.commit.message) || '';
    // Match #123 patterns
    const issueMatches = message.matchAll(/#(\d+)/g);
    for (const match of issueMatches) {
      const num = parseInt(match[1], 10);
      // Skip if it's a PR number (detected by (#123) pattern)
      if (commit._pr === num) continue;
      if (!seen.has(num)) {
        seen.add(num);
        issues.push({ number: num });
      }
    }
  }

  return issues;
}

module.exports = {
  analyzeCommits,
  parseCommit,
  extractBreakingChanges,
  extractScopes,
  computeStats,
  extractLinkedIssues,
};
