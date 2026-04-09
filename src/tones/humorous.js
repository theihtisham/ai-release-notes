'use strict';

/**
 * Humorous tone adapter.
 * Fun, witty descriptions with pop culture references.
 * Memorable and shareable.
 */
class HumorousTone {
  constructor() {
    this.name = 'humorous';
    this._celebrations = [
      'Hold onto your keyboards!',
      'Drumroll please...',
      'Spoiler alert: it\'s awesome.',
      'Cue the confetti!',
      'The release you\'ve been waiting for (probably).',
    ];
    this._fixPhrases = [
      'We fixed it. You\'re welcome.',
      'The bug met its maker.',
      'Squashed like the creepy-crawly it was.',
      'Take that, bug!',
      'Another one bites the dust.',
    ];
  }

  /**
   * Apply humorous tone to release data.
   * @param {Object} data - ReleaseData object
   * @returns {Object} Modified release data with humorous tone
   */
  apply(data) {
    const result = { ...data };

    // Transform summary
    result.summary = this._humorousSummary(data);

    // Transform categories
    if (data.categories) {
      result.categories = {};
      for (const [category, changes] of Object.entries(data.categories)) {
        const newCategory = this._humorousCategoryName(category);
        result.categories[newCategory] = changes.map((c, i) => ({
          ...c,
          description: this._humorousDescription(c.description, c.type, i),
        }));
      }
    }

    // Transform breaking changes
    if (data.breaking) {
      result.breaking = data.breaking.map(bc => ({
        ...bc,
        description: this._humorousBreaking(bc.description),
        migration_guide: bc.migration_guide
          ? `Don't panic! ${bc.migration_guide}`
          : 'Update your code. We believe in you.',
      }));
    }

    return result;
  }

  /**
   * Generate a humorous summary.
   */
  _humorousSummary(data) {
    const version = data.version || '0.0.0';
    const opener = this._celebrations[Math.floor(Math.random() * this._celebrations.length)];

    const parts = [`${opener} v${version} has landed.`];

    if (data.breaking && data.breaking.length > 0) {
      parts.push(` Yes, there ${data.breaking.length === 1 ? 'is a' : 'are'} breaking change${data.breaking.length > 1 ? 's' : ''}. No pain, no gain, right?`);
    }

    const catCount = Object.keys(data.categories || {}).length;
    if (catCount > 0) {
      parts.push(` ${catCount} categor${catCount !== 1 ? 'ies' : 'y'} of stuff that's different now.`);
    }

    if (data.contributors && data.contributors.length > 0) {
      if (data.contributors.length === 1) {
        parts.push(` One brave soul made this happen.`);
      } else {
        parts.push(` ${data.contributors.length} amazing humans made this happen.`);
      }
    }

    return parts.join('');
  }

  /**
   * Map category names to humorous names.
   */
  _humorousCategoryName(category) {
    const map = {
      '🚀 Features': ':rocket: Things That Are New and Shiny',
      '🐛 Bug Fixes': ':bug: Bugs We Sent to Bug Heaven',
      '💥 Breaking Changes': ':boom: Things We Broke (Sorry, Not Sorry)',
      '⚡ Performance': ':zap: We Made It Go Brrr',
      '♻️ Refactoring': ':recycle: Code We Rewrote for Fun',
      '📝 Documentation': ':memo: Words About Code',
      '🎨 Style': ':art: Making Code Pretty Again',
      '🧪 Tests': ':test_tube: We Actually Test Things',
      '🔧 Chore': ':wrench: Things Nobody Sees But Everyone Needs',
      '🔒 Security': ':lock: Fort Knox Mode',
      'New Features': ':rocket: Things That Are New and Shiny',
      'Bug Fixes and Resolutions': ':bug: Bugs We Sent to Bug Heaven',
      'Performance Improvements': ':zap: We Made It Go Brrr',
      'Code Quality Improvements': ':recycle: Code We Rewrote for Fun',
      'Documentation Updates': ':memo: Words About Code',
      'Test Coverage': ':test_tube: We Actually Test Things',
      'Security Enhancements': ':lock: Fort Knox Mode',
    };
    return map[category] || `:sparkles: ${category}`;
  }

  /**
   * Make a description more humorous.
   */
  _humorousDescription(desc, type, index) {
    if (!desc) return desc;

    if (type === 'fix') {
      const phrase = this._fixPhrases[index % this._fixPhrases.length];
      return `${desc} - ${phrase}`;
    }

    if (type === 'feat') {
      const additions = [
        ' (you\'re gonna love this)',
        ' (finally!)',
        ' (yes, really)',
        ' (the people demanded it)',
        ' (you\'re welcome)',
      ];
      return desc + additions[index % additions.length];
    }

    if (type === 'perf') {
      return `${desc} - it\'s fast now. Like, really fast.`;
    }

    return desc;
  }

  /**
   * Humorous breaking change description.
   */
  _humorousBreaking(desc) {
    if (!desc) return desc;
    const prefixes = [
      'Plot twist:',
      'In plot twist news:',
      'Breaking news (literally):',
      'Change of plans:',
    ];
    const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
    return `${prefix} ${desc}`;
  }
}

module.exports = { HumorousTone };
