'use strict';

const { formatDiffStats } = require('../diff-analyzer');

/**
 * GitHub-flavored Markdown formatter.
 * Produces rich markdown with emojis, collapsible sections, code blocks,
 * and contributor acknowledgments.
 */
class MarkdownFormatter {
  constructor() {
    this.name = 'Markdown';
    this.formatName = 'markdown';
  }

  /**
   * Format release data as GitHub-flavored markdown.
   * @param {Object} data - ReleaseData object
   * @returns {string} Formatted markdown string
   */
  format(data) {
    const lines = [];

    // Title and summary
    lines.push(`## What's Changed in v${data.version}`);
    lines.push('');
    lines.push(`> ${data.summary || `Release v${data.version}`}`);
    lines.push('');

    // Breaking changes (prominent, red alert)
    if (data.breaking && data.breaking.length > 0) {
      lines.push('### :rotating_light: Breaking Changes');
      lines.push('');
      lines.push('<details>');
      lines.push('<summary><strong>Click to view breaking changes and migration guide</strong></summary>');
      lines.push('');
      for (const bc of data.breaking) {
        lines.push(`- **${bc.description}**`);
        if (bc.scope) {
          lines.push(`  - Scope: \`${bc.scope}\``);
        }
        if (bc.migration_guide) {
          lines.push(`  - **Migration**: ${bc.migration_guide}`);
        }
        if (bc.pr) {
          lines.push(`  - PR: [#${bc.pr}](${data.repoUrl}/pull/${bc.pr})`);
        }
      }
      lines.push('');
      lines.push('</details>');
      lines.push('');
    }

    // Categorized changes
    if (data.categories && Object.keys(data.categories).length > 0) {
      for (const [category, changes] of Object.entries(data.categories)) {
        lines.push(`### ${category}`);
        lines.push('');
        for (const change of changes) {
          let line = `- ${change.description}`;
          if (change.scope) {
            line += ` [\`${change.scope}\`]`;
          }
          if (change.pr) {
            line += ` ([#${change.pr}](${data.repoUrl}/pull/${change.pr}))`;
          }
          if (change.author) {
            line += ` by @${change.author}`;
          }
          lines.push(line);
        }
        lines.push('');
      }
    }

    // Diff statistics (collapsible)
    if (data.diffSummary && data.diffSummary.files_changed > 0) {
      lines.push('<details>');
      lines.push('<summary>:bar_chart: Diff Statistics</summary>');
      lines.push('');
      lines.push(formatDiffStats(data.diffSummary));
      lines.push('');
      lines.push('</details>');
      lines.push('');
    }

    // Linked issues (collapsible)
    if (data.linkedIssues && data.linkedIssues.length > 0) {
      lines.push('<details>');
      lines.push(`<summary>:link: Linked Issues (${data.linkedIssues.length})</summary>`);
      lines.push('');
      for (const issue of data.linkedIssues) {
        lines.push(`- [#${issue.number}](${data.repoUrl}/issues/${issue.number})`);
      }
      lines.push('');
      lines.push('</details>');
      lines.push('');
    }

    // Contributors
    if (data.contributors && data.contributors.length > 0) {
      lines.push('### :busts_in_silhouette: Contributors');
      lines.push('');
      const logins = data.contributors.map(c => {
        const badge = c.is_first_time ? ' :tada:' : '';
        return `- @${c.login} (${c.commits_count} commit${c.commits_count !== 1 ? 's' : ''})${badge}`;
      });
      lines.push(logins.join('\n'));
      lines.push('');
    }

    // Full changelog link
    if (data.previousVersion) {
      lines.push(`**Full Changelog**: ${data.repoUrl}/compare/v${data.previousVersion}...v${data.version}`);
    } else {
      lines.push(`**Full Changelog**: ${data.repoUrl}/releases/tag/v${data.version}`);
    }

    return lines.join('\n');
  }
}

module.exports = { MarkdownFormatter };
