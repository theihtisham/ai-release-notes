'use strict';

/**
 * Casual tone adapter.
 * Developer-friendly, conversational, emoji-rich, approachable.
 */
class CasualTone {
  constructor() {
    this.name = 'casual';
  }

  /**
   * Apply casual tone to release data.
   * @param {Object} data - ReleaseData object
   * @returns {Object} Modified release data with casual tone
   */
  apply(data) {
    const result = { ...data };

    // Transform summary
    result.summary = this._casualSummary(data);

    // Transform categories
    if (data.categories) {
      result.categories = {};
      for (const [category, changes] of Object.entries(data.categories)) {
        const newCategory = this._casualCategoryName(category);
        result.categories[newCategory] = changes.map(c => ({
          ...c,
          description: this._casualDescription(c.description, c.type),
        }));
      }
    }

    // Transform breaking changes
    if (data.breaking) {
      result.breaking = data.breaking.map(bc => ({
        ...bc,
        description: this._casualBreaking(bc.description),
      }));
    }

    return result;
  }

  /**
   * Generate a casual summary.
   */
  _casualSummary(data) {
    const version = data.version || '0.0.0';
    const parts = [`Here's what's new in v${version}!`];

    const catCount = Object.keys(data.categories || {}).length;
    if (catCount > 3) {
      parts.push(` This release is packed with ${catCount} types of changes.`);
    } else if (catCount > 0) {
      parts.push(` We've got a bunch of goodies for you.`);
    }

    if (data.breaking && data.breaking.length > 0) {
      parts.push(` Heads up: there ${data.breaking.length === 1 ? 'is' : 'are'} ${data.breaking.length} breaking change${data.breaking.length > 1 ? 's' : ''}!`);
    }

    if (data.contributors && data.contributors.length > 0) {
      parts.push(` Huge thanks to ${data.contributors.length} contributor${data.contributors.length > 1 ? 's' : ''}!`);
    }

    return parts.join('');
  }

  /**
   * Map category names to casual names with emojis.
   */
  _casualCategoryName(category) {
    const map = {
      '🚀 Features': ':rocket: Cool New Stuff',
      '🐛 Bug Fixes': ':bug: Squashed Bugs',
      '💥 Breaking Changes': ':boom: Heads Up - Breaking Changes!',
      '⚡ Performance': ':zap: Speed Boosts',
      '♻️ Refactoring': ':recycle: Under the Hood',
      '📝 Documentation': ':memo: Docs & Guides',
      '🎨 Style': ':art: Pretty Code',
      '🧪 Tests': ':test_tube: Test Improvements',
      '🔧 Chore': ':wrench: Housekeeping',
      '🔒 Security': ':lock: Security Fixes',
      'New Features': ':rocket: Cool New Stuff',
      'Bug Fixes and Resolutions': ':bug: Squashed Bugs',
      'Performance Improvements': ':zap: Speed Boosts',
    };
    return map[category] || `:sparkles: ${category}`;
  }

  /**
   * Make a description more casual.
   */
  _casualDescription(desc, type) {
    if (!desc) return desc;
    // Add exclamation for features
    if (type === 'feat' && !desc.endsWith('!') && !desc.endsWith('.')) {
      return desc + '!';
    }
    return desc;
  }

  /**
   * Casual breaking change description.
   */
  _casualBreaking(desc) {
    if (!desc) return desc;
    return `Watch out! ${desc}`;
  }
}

module.exports = { CasualTone };
