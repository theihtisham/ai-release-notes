'use strict';

const { IMPACT_THRESHOLDS } = require('./constants');
const logger = require('./logger');

/**
 * Analyze diffs for a set of commits via the GitHub API.
 * @param {Array} commits - Commits to analyze
 * @param {Object} octokit - Octokit instance
 * @param {Object} context - GitHub Actions context
 * @returns {Object} Diff summary with file stats, impact, affected areas
 */
async function analyzeDiff(commits, octokit, context) {
  const result = {
    files_changed: 0,
    files_added: 0,
    files_modified: 0,
    files_deleted: 0,
    additions: 0,
    deletions: 0,
    impact: 'low',
    affected_areas: [],
    potential_breaking: [],
    files: [],
  };

  if (!commits || commits.length === 0 || !octokit || !context) {
    logger.debug('Skipping diff analysis: no commits or no octokit/context');
    return result;
  }

  const owner = context.repo.owner;
  const repo = context.repo.repo;

  for (const commit of commits) {
    try {
      const sha = commit.sha || commit.id;
      if (!sha) continue;

      const { data: commitData } = await octokit.rest.repos.getCommit({
        owner,
        repo,
        ref: sha,
      });

      const files = commitData.files || [];
      for (const file of files) {
        result.files.push({
          filename: file.filename,
          status: file.status,
          additions: file.additions,
          deletions: file.deletions,
          changes: file.changes,
        });

        result.additions += file.additions || 0;
        result.deletions += file.deletions || 0;
        result.files_changed += 1;

        if (file.status === 'added') result.files_added += 1;
        else if (file.status === 'modified') result.files_modified += 1;
        else if (file.status === 'removed') result.files_deleted += 1;

        // Detect affected areas
        detectAffectedAreas(file.filename, result.affected_areas);

        // Detect potential breaking changes
        detectPotentialBreaking(file, result.potential_breaking);
      }
    } catch (err) {
      logger.debug(`Failed to get diff for commit ${commit.sha}: ${err.message}`);
    }
  }

  // Remove duplicate affected areas
  result.affected_areas = [...new Set(result.affected_areas)];

  // Determine impact level
  if (result.files_changed <= IMPACT_THRESHOLDS.LOW) {
    result.impact = 'low';
  } else if (result.files_changed <= IMPACT_THRESHOLDS.MEDIUM) {
    result.impact = 'medium';
  } else {
    result.impact = 'high';
  }

  logger.info(`Diff analysis: ${result.files_changed} files changed, impact=${result.impact}, areas=${result.affected_areas.join(',')}`);

  return result;
}

/**
 * Detect which areas of the codebase are affected by a file change.
 */
function detectAffectedAreas(filename, areas) {
  if (!filename) return;

  const lower = filename.toLowerCase();

  if (lower.includes('route') || lower.includes('controller') || lower.includes('api/') || lower.includes('endpoint')) {
    areas.push('API');
  }
  if (lower.includes('model') || lower.includes('schema') || lower.includes('migration') || lower.includes('db/') || lower.includes('database')) {
    areas.push('Database');
  }
  if (lower.includes('auth') || lower.includes('login') || lower.includes('token') || lower.includes('session') || lower.includes('password')) {
    areas.push('Authentication');
  }
  if (lower.includes('component') || lower.includes('page') || lower.includes('view') || lower.includes('ui/') || lower.includes('style')) {
    areas.push('UI');
  }
  if (lower.includes('config') || lower.includes('.env') || lower.includes('setting')) {
    areas.push('Configuration');
  }
  if (lower.includes('test') || lower.includes('spec') || lower.includes('__test__')) {
    areas.push('Tests');
  }
  if (lower.includes('middleware') || lower.includes('interceptor') || lower.includes('filter')) {
    areas.push('Middleware');
  }
  if (lower.includes('util') || lower.includes('helper') || lower.includes('service')) {
    areas.push('Utilities');
  }
}

/**
 * Detect potential breaking changes from a diff.
 */
function detectPotentialBreaking(file, potentialBreaking) {
  if (!file) return;

  const filename = (file.filename || '').toLowerCase();

  // Removed exports in index files
  if (file.status === 'removed' && (filename.includes('index.') || filename.includes('export'))) {
    potentialBreaking.push({
      file: file.filename,
      reason: 'Export file was removed',
    });
  }

  // Large deletion ratio might indicate removed functionality
  if (file.deletions > file.additions * 3 && file.deletions > 20) {
    potentialBreaking.push({
      file: file.filename,
      reason: `Significant code removal (${file.deletions} deletions vs ${file.additions} additions)`,
    });
  }

  // Changes to public API files
  if (filename.includes('api') && filename.includes('public')) {
    if (file.status === 'modified') {
      potentialBreaking.push({
        file: file.filename,
        reason: 'Public API file was modified',
      });
    }
  }
}

/**
 * Format diff stats for display in release notes.
 */
function formatDiffStats(diffSummary) {
  if (!diffSummary || diffSummary.files_changed === 0) {
    return '';
  }

  const lines = [];
  lines.push(`- **${diffSummary.files_changed}** file${diffSummary.files_changed !== 1 ? 's' : ''} changed`);
  if (diffSummary.files_added > 0) {
    lines.push(`- **${diffSummary.files_added}** file${diffSummary.files_added !== 1 ? 's' : ''} added`);
  }
  if (diffSummary.files_modified > 0) {
    lines.push(`- **${diffSummary.files_modified}** file${diffSummary.files_modified !== 1 ? 's' : ''} modified`);
  }
  if (diffSummary.files_deleted > 0) {
    lines.push(`- **${diffSummary.files_deleted}** file${diffSummary.files_deleted !== 1 ? 's' : ''} deleted`);
  }
  lines.push(`- **+${diffSummary.additions}** additions, **-${diffSummary.deletions}** deletions`);

  if (diffSummary.impact === 'high') {
    lines.push(`- Impact: **High** (20+ files changed)`);
  } else if (diffSummary.impact === 'medium') {
    lines.push(`- Impact: **Medium** (6-20 files changed)`);
  } else {
    lines.push(`- Impact: **Low** (1-5 files changed)`);
  }

  if (diffSummary.affected_areas.length > 0) {
    lines.push(`- Affected areas: ${diffSummary.affected_areas.join(', ')}`);
  }

  return lines.join('\n');
}

module.exports = {
  analyzeDiff,
  detectAffectedAreas,
  detectPotentialBreaking,
  formatDiffStats,
};
