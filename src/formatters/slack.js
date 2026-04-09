'use strict';

/**
 * Slack Block Kit formatter.
 * Produces JSON with Slack Block Kit sections, dividers, fields,
 * context blocks, and mention support.
 */
class SlackFormatter {
  constructor() {
    this.name = 'Slack';
    this.formatName = 'slack';
  }

  /**
   * Format release data as Slack Block Kit JSON string.
   * @param {Object} data - ReleaseData object
   * @returns {string} JSON string of Slack Block Kit payload
   */
  format(data) {
    const blocks = [];

    // Header block
    blocks.push({
      type: 'header',
      text: {
        type: 'plain_text',
        text: `Release v${data.version}`,
        emoji: true,
      },
    });

    // Summary section
    blocks.push({
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: `:rocket: *${this._escapeSlack(data.summary || `Release v${data.version}`)}*`,
      },
    });

    // Date context
    blocks.push({
      type: 'context',
      elements: [
        {
          type: 'mrkdwn',
          text: `:calendar: ${data.date}`,
        },
      ],
    });

    // Breaking changes (alert)
    if (data.breaking && data.breaking.length > 0) {
      blocks.push({ type: 'divider' });
      blocks.push({
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `:rotating_light: *Breaking Changes*`,
        },
      });

      const breakingText = data.breaking.map(bc => {
        let line = `> *${this._escapeSlack(bc.description)}*`;
        if (bc.scope) line += ` \`${this._escapeSlack(bc.scope)}\``;
        if (bc.migration_guide) line += `\n> _Migration: ${this._escapeSlack(bc.migration_guide)}_`;
        return line;
      }).join('\n');

      blocks.push({
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: breakingText,
        },
      });
    }

    // Categorized changes
    if (data.categories) {
      for (const [category, changes] of Object.entries(data.categories)) {
        blocks.push({ type: 'divider' });

        // Category header
        blocks.push({
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `*${this._escapeSlack(category)}*`,
          },
        });

        // Changes as fields (max 10 per block, max 5 visible)
        const fields = [];
        for (const change of changes.slice(0, 10)) {
          let text = this._escapeSlack(change.description);
          if (change.pr) text += ` <${data.repoUrl}/pull/${change.pr}|#${change.pr}>`;
          if (change.author) text += ` _@${change.author}_`;
          fields.push({
            type: 'mrkdwn',
            text: text.length > 200 ? text.substring(0, 197) + '...' : text,
          });
        }

        // Slack supports max 10 fields per block
        for (let i = 0; i < fields.length; i += 10) {
          blocks.push({
            type: 'section',
            fields: fields.slice(i, i + 10),
          });
        }
      }
    }

    // Contributors context
    if (data.contributors && data.contributors.length > 0) {
      blocks.push({ type: 'divider' });
      const names = data.contributors.slice(0, 8).map(c => {
        const suffix = c.is_first_time ? ' :tada:' : '';
        return `@${c.login}${suffix}`;
      }).join(', ');
      const more = data.contributors.length > 8 ? ` and ${data.contributors.length - 8} more` : '';

      blocks.push({
        type: 'context',
        elements: [
          {
            type: 'mrkdwn',
            text: `:busts_in_silhouette: Contributors: ${names}${more}`,
          },
        ],
      });
    }

    // Full changelog button
    blocks.push({ type: 'divider' });
    const actions = [];
    if (data.previousVersion) {
      actions.push({
        type: 'button',
        text: {
          type: 'plain_text',
          text: 'View Full Changelog',
        },
        url: `${data.repoUrl}/compare/v${data.previousVersion}...v${data.version}`,
      });
    }
    actions.push({
      type: 'button',
      text: {
        type: 'plain_text',
        text: 'View Repository',
      },
      url: data.repoUrl,
    });

    blocks.push({
      type: 'actions',
      elements: actions,
    });

    return JSON.stringify({ blocks }, null, 2);
  }

  /**
   * Escape Slack mrkdwn special characters.
   * @param {string} str
   * @returns {string}
   */
  _escapeSlack(str) {
    if (!str) return '';
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }
}

module.exports = { SlackFormatter };
