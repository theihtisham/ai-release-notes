'use strict';

/**
 * Professional tone adapter.
 * Enterprise/corporate language with formal headers and structured sections.
 */
class ProfessionalTone {
  constructor() {
    this.name = 'professional';
  }

  /**
   * Apply professional tone to release data.
   * @param {Object} data - ReleaseData object
   * @returns {Object} Modified release data with professional tone
   */
  apply(data) {
    const result = { ...data };

    // Transform summary
    result.summary = this._professionalSummary(data);

    // Transform categories
    if (data.categories) {
      result.categories = {};
      for (const [category, changes] of Object.entries(data.categories)) {
        const newCategory = this._professionalCategoryName(category);
        result.categories[newCategory] = changes.map(c => ({
          ...c,
          description: this._professionalDescription(c.description, c.type),
        }));
      }
    }

    // Transform breaking changes
    if (data.breaking) {
      result.breaking = data.breaking.map(bc => ({
        ...bc,
        description: this._professionalBreaking(bc.description),
        migration_guide: bc.migration_guide
          ? this._professionalMigration(bc.migration_guide)
          : undefined,
      }));
    }

    return result;
  }

  /**
   * Generate a professional summary.
   */
  _professionalSummary(data) {
    const parts = [];
    const version = data.version || '0.0.0';

    if (data.breaking && data.breaking.length > 0) {
      parts.push(`We are pleased to announce the release of version ${version}, which includes ${data.breaking.length} breaking change${data.breaking.length > 1 ? 's' : ''}`);
    } else if (Object.keys(data.categories || {}).length > 0) {
      const catCount = Object.keys(data.categories).length;
      parts.push(`We are pleased to announce the release of version ${version}, comprising ${catCount} categor${catCount !== 1 ? 'ies' : 'y'} of improvements`);
    } else {
      parts.push(`We are pleased to announce the release of version ${version}`);
    }

    if (data.contributors && data.contributors.length > 0) {
      parts.push(`with contributions from ${data.contributors.length} developer${data.contributors.length > 1 ? 's' : ''}`);
    }

    parts.push('.');
    return parts.join(' ');
  }

  /**
   * Map emoji category names to professional names.
   */
  _professionalCategoryName(category) {
    const map = {
      '🚀 Features': 'New Features',
      '🐛 Bug Fixes': 'Bug Fixes and Resolutions',
      '💥 Breaking Changes': 'Breaking Changes',
      '⚡ Performance': 'Performance Improvements',
      '♻️ Refactoring': 'Code Quality Improvements',
      '📝 Documentation': 'Documentation Updates',
      '🎨 Style': 'Code Style and Formatting',
      '🧪 Tests': 'Test Coverage',
      '🔧 Chore': 'Maintenance and Infrastructure',
      '🔒 Security': 'Security Enhancements',
    };
    return map[category] || category.replace(/[^\w\s&]/g, '').trim();
  }

  /**
   * Make a description more professional.
   */
  _professionalDescription(desc, type) {
    if (!desc) return desc;
    // Capitalize first letter, ensure period at end if appropriate
    let result = desc.charAt(0).toUpperCase() + desc.slice(1);
    if (type === 'feat' && !result.startsWith('Implemented') && !result.startsWith('Added') && !result.startsWith('Introduced')) {
      return result;
    }
    if (type === 'fix' && !result.startsWith('Resolved') && !result.startsWith('Fixed') && !result.startsWith('Addressed')) {
      return result;
    }
    return result;
  }

  /**
   * Professional breaking change description.
   */
  _professionalBreaking(desc) {
    if (!desc) return desc;
    return `This release introduces a change to ${desc.charAt(0).toLowerCase() + desc.slice(1)}`;
  }

  /**
   * Professional migration guide.
   */
  _professionalMigration(guide) {
    if (!guide) return guide;
    return guide;
  }
}

module.exports = { ProfessionalTone };
