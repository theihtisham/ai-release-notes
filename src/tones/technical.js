'use strict';

/**
 * Technical tone adapter.
 * Detailed technical changelog with API changes, migration notes,
 * and code examples for breaking changes.
 */
class TechnicalTone {
  constructor() {
    this.name = 'technical';
  }

  /**
   * Apply technical tone to release data.
   * @param {Object} data - ReleaseData object
   * @returns {Object} Modified release data with technical tone
   */
  apply(data) {
    const result = { ...data };

    // Transform summary
    result.summary = this._technicalSummary(data);

    // Transform categories
    if (data.categories) {
      result.categories = {};
      for (const [category, changes] of Object.entries(data.categories)) {
        const newCategory = this._technicalCategoryName(category);
        result.categories[newCategory] = changes.map(c => ({
          ...c,
          description: this._technicalDescription(c.description, c.type, c.scope),
        }));
      }
    }

    // Transform breaking changes with code examples
    if (data.breaking) {
      result.breaking = data.breaking.map(bc => ({
        ...bc,
        description: this._technicalBreaking(bc.description, bc.scope),
        migration_guide: bc.migration_guide
          ? this._technicalMigration(bc.migration_guide, bc.scope, bc.type)
          : this._generateDefaultMigration(bc),
      }));
    }

    return result;
  }

  /**
   * Generate a technical summary.
   */
  _technicalSummary(data) {
    const version = data.version || '0.0.0';
    const parts = [];

    parts.push(`v${version}`);

    // Add semver implication
    if (data.breaking && data.breaking.length > 0) {
      parts.push('(MAJOR - contains breaking changes)');
    } else if (data.categories) {
      const catNames = Object.keys(data.categories).map(c => c.toLowerCase());
      if (catNames.some(c => c.includes('feature'))) {
        parts.push('(MINOR - new features)');
      } else {
        parts.push('(PATCH - bug fixes and improvements)');
      }
    }

    // Stats
    const commitCount = data.diffSummary?.files_changed || 0;
    if (commitCount > 0) {
      parts.push(`— ${commitCount} files affected`);
    }

    if (data.contributors && data.contributors.length > 0) {
      parts.push(`— ${data.contributors.length} contributor${data.contributors.length > 1 ? 's' : ''}`);
    }

    return parts.join(' ');
  }

  /**
   * Map category names to technical names.
   */
  _technicalCategoryName(category) {
    const map = {
      '🚀 Features': 'feat: New Features',
      '🐛 Bug Fixes': 'fix: Bug Fixes',
      '💥 Breaking Changes': 'BREAKING: Incompatible Changes',
      '⚡ Performance': 'perf: Performance Optimizations',
      '♻️ Refactoring': 'refactor: Code Refactoring',
      '📝 Documentation': 'docs: Documentation',
      '🎨 Style': 'style: Code Style',
      '🧪 Tests': 'test: Test Suite',
      '🔧 Chore': 'chore: Build/CI/Maintenance',
      '🔒 Security': 'security: Security Patches',
      'New Features': 'feat: New Features',
      'Bug Fixes and Resolutions': 'fix: Bug Fixes',
    };
    return map[category] || category;
  }

  /**
   * Make a description more technical.
   */
  _technicalDescription(desc, type, scope) {
    if (!desc) return desc;
    const prefix = scope ? `[${scope}] ` : '';
    return `${prefix}${desc}`;
  }

  /**
   * Technical breaking change description.
   */
  _technicalBreaking(desc, scope) {
    if (!desc) return desc;
    const prefix = scope ? `[${scope}] ` : '';
    return `${prefix}${desc}`;
  }

  /**
   * Enhance migration guide with technical details.
   */
  _technicalMigration(guide, scope, type) {
    if (!guide) return guide;
    return guide;
  }

  /**
   * Generate a default migration guide with before/after code examples.
   * @param {Object} bc - Breaking change
   * @returns {string}
   */
  _generateDefaultMigration(bc) {
    const lines = [];

    lines.push('### Migration Steps');
    lines.push('');
    lines.push(`1. Review the changes to \`${bc.scope || 'affected modules'}\``);
    lines.push('2. Update your code to match the new API');
    lines.push('3. Run your test suite to verify compatibility');
    lines.push('');

    if (bc.scope) {
      lines.push('**Before:**');
      lines.push('```javascript');
      lines.push(`// Old ${bc.scope} API`);
      lines.push(`// ${bc.description}`);
      lines.push('```');
      lines.push('');
      lines.push('**After:**');
      lines.push('```javascript');
      lines.push(`// Updated ${bc.scope} API`);
      lines.push(`// Check the documentation for new usage`);
      lines.push('```');
    }

    return lines.join('\n');
  }
}

module.exports = { TechnicalTone };
