'use strict';

const { CONVENTIONAL_COMMIT_REGEX, BREAKING_CHANGE_REGEX } = require('../constants');
const logger = require('../logger');

/**
 * @typedef {Object} BreakingChange
 * @property {string} description - What broke
 * @property {string} scope - Affected scope/module
 * @property {string} type - Commit type (feat, fix, etc.)
 * @property {string} severity - 'major' | 'minor' | 'patch'
 * @property {string} commit - Commit SHA
 * @property {number|null} pr - PR number
 * @property {string} migration_guide - How to migrate
 * @property {string} before_code - Code before the change
 * @property {string} after_code - Code after the change
 * @property {string[]} affected_apis - List of affected API signatures
 */

/**
 * Detect breaking changes from commit messages and code changes.
 * Analyzes conventional commit prefixes (BREAKING CHANGE, !),
 * semver major bumps, and API signature changes.
 *
 * @param {Array} commits - Array of commit objects
 * @returns {BreakingChange[]} Array of detected breaking changes
 */
function detectBreakingChanges(commits) {
  if (!commits || commits.length === 0) {
    return [];
  }

  const breakingChanges = [];

  for (const commit of commits) {
    const message = commit.message || (commit.commit && commit.commit.message) || '';

    // Method 1: Conventional commit with ! suffix (e.g., feat!: ...)
    const bangMatch = message.match(CONVENTIONAL_COMMIT_REGEX);
    if (bangMatch && bangMatch[4]) {
      breakingChanges.push(createBreakingChange(commit, bangMatch, message));
      continue;
    }

    // Method 2: BREAKING CHANGE footer
    const breakingFooterMatch = message.match(BREAKING_CHANGE_REGEX);
    if (breakingFooterMatch) {
      breakingChanges.push(createBreakingChange(commit, bangMatch, message, breakingFooterMatch[1]));
      continue;
    }

    // Method 3: "breaking" keyword in commit type or message
    const lowerMessage = message.toLowerCase();
    if (lowerMessage.startsWith('breaking:') || lowerMessage.includes('breaking change')) {
      breakingChanges.push(createBreakingChange(commit, null, message));
      continue;
    }

    // Method 4: Detect API signature changes from keywords
    const apiChange = detectAPISignatureChange(message);
    if (apiChange) {
      breakingChanges.push({
        ...createBreakingChange(commit, null, message),
        affected_apis: [apiChange],
      });
    }
  }

  logger.info(`Detected ${breakingChanges.length} breaking changes from ${commits.length} commits`);
  return breakingChanges;
}

/**
 * Create a breaking change object from a commit.
 * @param {Object} commit
 * @param {Array|null} match - Conventional commit regex match
 * @param {string} message - Full commit message
 * @param {string} [explicitDescription] - Explicit breaking change description
 * @returns {BreakingChange}
 */
function createBreakingChange(commit, match, message, explicitDescription) {
  const body = message.split('\n').slice(1).join('\n').trim();
  const type = match ? match[1].toLowerCase() : extractType(message);
  const scope = match ? (match[3] || '') : '';
  const description = explicitDescription || (match ? match[5] : message.split('\n')[0]);

  return {
    description: description,
    scope: scope,
    type: type,
    severity: 'major',
    commit: commit.sha || '',
    pr: extractPRNumber(message),
    migration_guide: extractMigrationGuide(body),
    before_code: extractBeforeCode(body),
    after_code: extractAfterCode(body),
    affected_apis: extractAffectedAPIs(body),
  };
}

/**
 * Generate a step-by-step migration guide for breaking changes.
 *
 * @param {BreakingChange[]} changes - Array of breaking changes
 * @returns {string} Markdown migration guide
 */
function generateMigrationGuide(changes) {
  if (!changes || changes.length === 0) {
    return 'No breaking changes detected. No migration required.';
  }

  const lines = [];

  lines.push('# Migration Guide');
  lines.push('');
  lines.push(`This guide covers ${changes.length} breaking change${changes.length > 1 ? 's' : ''} that require action before upgrading.`);
  lines.push('');

  for (let i = 0; i < changes.length; i++) {
    const change = changes[i];
    const num = i + 1;

    lines.push(`## ${num}. ${change.description}`);
    lines.push('');

    // Scope info
    if (change.scope) {
      lines.push(`**Scope:** \`${change.scope}\``);
      lines.push('');
    }

    // Severity
    lines.push(`**Severity:** ${change.severity || 'major'}`);
    lines.push('');

    // Before/After code examples
    if (change.before_code || change.after_code) {
      lines.push('### Before');
      lines.push('```javascript');
      lines.push(change.before_code || `// Old usage of ${change.scope || 'the API'}`);
      lines.push('```');
      lines.push('');

      lines.push('### After');
      lines.push('```javascript');
      lines.push(change.after_code || `// New usage of ${change.scope || 'the API'}`);
      lines.push('```');
      lines.push('');
    }

    // Migration steps
    if (change.migration_guide) {
      lines.push('### Migration Steps');
      lines.push('');
      const steps = change.migration_guide.split('\n').filter(s => s.trim());
      for (const step of steps) {
        lines.push(step.startsWith('-') || step.startsWith('*') ? step : `- ${step}`);
      }
      lines.push('');
    } else {
      lines.push('### Migration Steps');
      lines.push('');
      lines.push(`1. Review the changes to \`${change.scope || 'the affected module'}\``);
      lines.push('2. Update your code to match the new API');
      lines.push('3. Run your test suite to verify compatibility');
      lines.push('4. Deploy to a staging environment before production');
      lines.push('');
    }

    // Affected APIs
    if (change.affected_apis && change.affected_apis.length > 0) {
      lines.push('### Affected APIs');
      lines.push('');
      for (const api of change.affected_apis) {
        lines.push(`- \`${api}\``);
      }
      lines.push('');
    }

    // PR reference
    if (change.pr) {
      lines.push(`_See PR #${change.pr} for full details._`);
      lines.push('');
    }
  }

  // Deprecation timeline
  lines.push('## Deprecation Timeline');
  lines.push('');
  lines.push('- **Immediately**: Update your code before deploying this version');
  lines.push('- **Next minor release**: Old APIs may be removed entirely');
  lines.push('- **Next major release**: No backward compatibility guaranteed');
  lines.push('');

  return lines.join('\n');
}

/**
 * Generate package-specific upgrade commands.
 *
 * @param {string} fromVersion - Current version
 * @param {string} toVersion - Target version
 * @param {string} [packageName] - Package name (optional, defaults to generic)
 * @returns {string} Upgrade commands for npm, yarn, and pnpm
 */
function generateUpgradeCommand(fromVersion, toVersion, packageName) {
  const pkg = packageName || 'your-package';
  const lines = [];

  lines.push(`# Upgrade from v${fromVersion} to v${toVersion}`);
  lines.push('');

  lines.push('## npm');
  lines.push(`npm install ${pkg}@${toVersion}`);
  lines.push('');

  lines.push('## yarn');
  lines.push(`yarn add ${pkg}@${toVersion}`);
  lines.push('');

  lines.push('## pnpm');
  lines.push(`pnpm add ${pkg}@${toVersion}`);
  lines.push('');

  // Add helpful notes
  const fromParts = fromVersion.split('.').map(Number);
  const toParts = toVersion.split('.').map(Number);

  if (toParts[0] > fromParts[0]) {
    lines.push('> **Note:** This is a major version upgrade. Please review the migration guide before upgrading.');
  } else if (toParts[1] > fromParts[1]) {
    lines.push('> **Note:** This is a minor version upgrade with new features. Backward compatible.');
  } else {
    lines.push('> **Note:** This is a patch upgrade with bug fixes. Safe to upgrade.');
  }

  return lines.join('\n');
}

// --- Helper functions ---

/**
 * Extract commit type from message.
 */
function extractType(message) {
  if (!message) return 'other';
  const match = message.match(CONVENTIONAL_COMMIT_REGEX);
  return match ? match[1].toLowerCase() : 'other';
}

/**
 * Extract PR number from commit message.
 */
function extractPRNumber(message) {
  if (!message) return null;
  const match = message.match(/\(#(\d+)\)/);
  return match ? parseInt(match[1], 10) : null;
}

/**
 * Extract migration guide from commit body.
 */
function extractMigrationGuide(body) {
  if (!body) return '';
  const patterns = [
    /Migration Guide:\s*([\s\S]*?)(?=\n\n|\n##|$)/i,
    /How to migrate:\s*([\s\S]*?)(?=\n\n|\n##|$)/i,
    /To migrate[\s\S]*?:\s*([\s\S]*?)(?=\n\n|\n##|$)/i,
    /MIGRATION:\s*([\s\S]*?)(?=\n\n|\n##|$)/i,
  ];

  for (const pattern of patterns) {
    const match = body.match(pattern);
    if (match) return match[1].trim();
  }

  return '';
}

/**
 * Extract "before" code from commit body.
 */
function extractBeforeCode(body) {
  if (!body) return '';
  const match = body.match(/```(?:javascript|js|ts|typescript)?\s*\n([\s\S]*?)```/i);
  return match ? match[1].trim() : '';
}

/**
 * Extract "after" code from commit body.
 * Looks for the second code block.
 */
function extractAfterCode(body) {
  if (!body) return '';
  const matches = body.matchAll(/```(?:javascript|js|ts|typescript)?\s*\n([\s\S]*?)```/gi);
  const blocks = [...matches];
  return blocks.length >= 2 ? blocks[1][1].trim() : '';
}

/**
 * Extract affected API signatures from commit body.
 */
function extractAffectedAPIs(body) {
  if (!body) return [];
  const apis = [];
  const patterns = [
    /`([a-zA-Z_$][\w$]*(?:\.[a-zA-Z_$][\w$]*)*\s*\([^)]*\))`/g,
    /affected API:\s*`([^`]+)`/gi,
    /changed:\s*`([^`]+)`/gi,
  ];

  for (const pattern of patterns) {
    let match;
    while ((match = pattern.exec(body)) !== null) {
      apis.push(match[1]);
    }
  }

  return apis;
}

/**
 * Detect API signature changes from commit message keywords.
 */
function detectAPISignatureChange(message) {
  if (!message) return null;

  const patterns = [
    /remove\s+([a-zA-Z_$][\w$]*(?:\.[a-zA-Z_$][\w$]*)*)\s*(?:method|function|parameter|argument|option|property|export|endpoint|route|API)/i,
    /rename\s+([a-zA-Z_$][\w$]*(?:\.[a-zA-Z_$][\w$]*)*)\s*(?:to|->|→)/i,
    /deprecat(?:e|ed|ing)\s+([a-zA-Z_$][\w$]*(?:\.[a-zA-Z_$][\w$]*)*)/i,
    /changed\s+(?:signature|type|return type)\s+(?:of\s+)?([a-zA-Z_$][\w$]*(?:\.[a-zA-Z_$][\w$]*)*)/i,
  ];

  for (const pattern of patterns) {
    const match = message.match(pattern);
    if (match) return match[1];
  }

  return null;
}

module.exports = {
  detectBreakingChanges,
  generateMigrationGuide,
  generateUpgradeCommand,
  createBreakingChange,
  extractType,
  extractPRNumber,
  extractMigrationGuide,
  extractBeforeCode,
  extractAfterCode,
  extractAffectedAPIs,
  detectAPISignatureChange,
};
