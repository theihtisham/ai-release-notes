'use strict';

/**
 * Discord embed formatter.
 * Produces Discord webhook-ready JSON with rich embeds,
 * color coding by change type, and field-based layout.
 */
class DiscordFormatter {
  constructor() {
    this.name = 'Discord';
    this.formatName = 'discord';
  }

  /**
   * Format release data as Discord webhook JSON string.
   * @param {Object} data - ReleaseData object
   * @returns {string} JSON string of Discord webhook payload
   */
  format(data) {
    const embeds = [];

    // Main release embed
    const mainEmbed = {
      title: `Release v${data.version}`,
      url: data.previousVersion
        ? `${data.repoUrl}/compare/v${data.previousVersion}...v${data.version}`
        : `${data.repoUrl}/releases/tag/v${data.version}`,
      color: this._getEmbedColor(data),
      description: this._truncate(this._escapeDiscord(data.summary || `Release v${data.version}`), 2048),
      fields: [],
      footer: {
        text: `Powered by AI Release Notes`,
      },
      timestamp: new Date().toISOString(),
    };

    // Add version and date fields
    mainEmbed.fields.push({
      name: 'Version',
      value: `v${data.version}`,
      inline: true,
    });
    mainEmbed.fields.push({
      name: 'Date',
      value: data.date,
      inline: true,
    });

    embeds.push(mainEmbed);

    // Breaking changes embed (red)
    if (data.breaking && data.breaking.length > 0) {
      const breakingEmbed = {
        title: ':rotating_light: Breaking Changes',
        color: 0xED4245, // Discord red
        fields: [],
        timestamp: new Date().toISOString(),
      };

      for (const bc of data.breaking.slice(0, 5)) {
        let value = this._escapeDiscord(bc.description);
        if (bc.scope) value += `\nScope: \`${bc.scope}\``;
        if (bc.migration_guide) value += `\n**Migration:** ${this._escapeDiscord(bc.migration_guide)}`;
        breakingEmbed.fields.push({
          name: this._truncate(bc.scope || 'Breaking Change', 256),
          value: this._truncate(value, 1024),
          inline: false,
        });
      }

      embeds.push(breakingEmbed);
    }

    // Category embeds with color coding
    if (data.categories) {
      const categoryEntries = Object.entries(data.categories);
      // Discord allows max 10 embeds total
      const maxCategoryEmbeds = Math.min(categoryEntries.length, 10 - embeds.length);

      for (let i = 0; i < maxCategoryEmbeds; i++) {
        const [category, changes] = categoryEntries[i];
        const color = this._getCategoryColor(category);

        const fieldList = changes.slice(0, 10).map(change => {
          let line = `  - ${this._escapeDiscord(change.description)}`;
          if (change.pr) line += ` [#${change.pr}](${data.repoUrl}/pull/${change.pr})`;
          if (change.author) line += ` by @${change.author}`;
          return line;
        }).join('\n');

        embeds.push({
          title: category,
          color: color,
          description: this._truncate(fieldList, 2048),
          timestamp: new Date().toISOString(),
        });
      }
    }

    // Contributors embed
    if (data.contributors && data.contributors.length > 0) {
      const names = data.contributors.slice(0, 10).map(c => {
        const badge = c.is_first_time ? ' :star:' : '';
        return `\`@${c.login}\` (${c.commits_count})${badge}`;
      }).join(', ');
      const more = data.contributors.length > 10 ? `\n...and ${data.contributors.length - 10} more` : '';

      embeds.push({
        title: ':busts_in_silhouette: Contributors',
        color: 0x5865F2, // Discord blurple
        description: this._truncate(names + more, 2048),
        timestamp: new Date().toISOString(),
      });
    }

    return JSON.stringify({
      username: 'Release Notes',
      embeds: embeds.slice(0, 10), // Discord hard limit
    }, null, 2);
  }

  /**
   * Get the main embed color based on release content.
   * @param {Object} data
   * @returns {number}
   */
  _getEmbedColor(data) {
    if (data.breaking && data.breaking.length > 0) return 0xED4245; // Red
    const cats = Object.keys(data.categories || {});
    if (cats.some(c => c.toLowerCase().includes('feature'))) return 0x57F287; // Green
    if (cats.some(c => c.toLowerCase().includes('fix'))) return 0x3498DB; // Blue
    return 0x5865F2; // Blurple
  }

  /**
   * Get color for a category type.
   * @param {string} category
   * @returns {number}
   */
  _getCategoryColor(category) {
    const lower = category.toLowerCase();
    if (lower.includes('feature') || lower.includes('rocket')) return 0x57F287;
    if (lower.includes('fix') || lower.includes('bug')) return 0x3498DB;
    if (lower.includes('breaking')) return 0xED4245;
    if (lower.includes('perf')) return 0xFEE75C;
    if (lower.includes('doc')) return 0xEB459E;
    if (lower.includes('security') || lower.includes('lock')) return 0xED4245;
    if (lower.includes('test')) return 0x99AAB5;
    return 0x5865F2;
  }

  /**
   * Escape Discord markdown special characters.
   * @param {string} str
   * @returns {string}
   */
  _escapeDiscord(str) {
    if (!str) return '';
    return String(str);
  }

  /**
   * Truncate a string to a maximum length.
   * @param {string} str
   * @param {number} max
   * @returns {string}
   */
  _truncate(str, max) {
    if (!str) return '';
    return str.length > max ? str.substring(0, max - 3) + '...' : str;
  }
}

module.exports = { DiscordFormatter };
