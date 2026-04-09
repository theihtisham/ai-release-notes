'use strict';

/**
 * @typedef {'markdown'|'html'|'slack'|'discord'|'twitter'} OutputFormat
 * Supported output formats for release notes.
 */

/**
 * @typedef {Object} ReleaseData
 * @property {string} version - Release version (e.g. "2.1.0")
 * @property {string} previousVersion - Previous version (e.g. "2.0.0")
 * @property {string} date - Release date (ISO format YYYY-MM-DD)
 * @property {string} summary - One-line summary of the release
 * @property {Object<string, Array<{description: string, type?: string, scope?: string, pr?: number|null, author?: string, breaking?: boolean}>>} categories - Categorized changes
 * @property {Array<{description: string, scope?: string, type?: string, pr?: number|null, migration_guide?: string}>} breaking - Breaking changes
 * @property {Array<{login: string, name?: string, commits_count: number, is_first_time?: boolean}>} contributors - Contributors
 * @property {Object|null} diffSummary - Diff analysis summary
 * @property {string} repoUrl - Repository URL
 * @property {string} repoFullName - Repository full name (owner/repo)
 * @property {Array<{number: number}>} linkedIssues - Linked issue numbers
 */

/**
 * @typedef {Object} Formatter
 * @property {string} name - Human-readable formatter name
 * @property {OutputFormat} format - The format identifier
 * @property {(data: ReleaseData) => string} format - Convert release data to formatted string
 */

/**
 * List of all supported output formats.
 * @type {OutputFormat[]}
 */
const OUTPUT_FORMATS = ['markdown', 'html', 'slack', 'discord', 'twitter'];

/**
 * Check if a format string is valid.
 * @param {string} format - Format to validate
 * @returns {boolean}
 */
function isValidFormat(format) {
  return OUTPUT_FORMATS.includes(format);
}

module.exports = {
  OUTPUT_FORMATS,
  isValidFormat,
};
