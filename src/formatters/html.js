'use strict';

/**
 * HTML formatter.
 * Produces beautiful HTML with inline CSS, color-coded sections,
 * and responsive design. Email/client ready.
 */
class HTMLFormatter {
  constructor() {
    this.name = 'HTML';
    this.formatName = 'html';
  }

  /**
   * Format release data as HTML with inline CSS.
   * @param {Object} data - ReleaseData object
   * @returns {string} HTML string
   */
  format(data) {
    const sections = [];

    sections.push('<!DOCTYPE html>');
    sections.push('<html lang="en">');
    sections.push('<head>');
    sections.push('<meta charset="UTF-8">');
    sections.push('<meta name="viewport" content="width=device-width, initial-scale=1.0">');
    sections.push(`<title>Release v${data.version}</title>`);
    sections.push('<style>');
    sections.push(this._getCSS());
    sections.push('</style>');
    sections.push('</head>');
    sections.push('<body>');
    sections.push('<div class="container">');

    // Header
    sections.push(`<h1 class="header">Release v${data.version}</h1>`);
    sections.push(`<p class="date">${data.date}</p>`);
    sections.push(`<p class="summary">${this._escapeHtml(data.summary || `Release v${data.version}`)}</p>`);

    // Breaking changes
    if (data.breaking && data.breaking.length > 0) {
      sections.push('<div class="section breaking">');
      sections.push('<h2 class="section-title breaking-title">Breaking Changes</h2>');
      for (const bc of data.breaking) {
        sections.push('<div class="item">');
        sections.push(`<strong>${this._escapeHtml(bc.description)}</strong>`);
        if (bc.scope) {
          sections.push(`<span class="badge scope">Scope: ${this._escapeHtml(bc.scope)}</span>`);
        }
        if (bc.migration_guide) {
          sections.push(`<p class="migration"><strong>Migration:</strong> ${this._escapeHtml(bc.migration_guide)}</p>`);
        }
        if (bc.pr) {
          sections.push(`<a href="${data.repoUrl}/pull/${bc.pr}" class="link">PR #${bc.pr}</a>`);
        }
        sections.push('</div>');
      }
      sections.push('</div>');
    }

    // Categorized changes
    if (data.categories) {
      for (const [category, changes] of Object.entries(data.categories)) {
        const cssClass = this._getCategoryClass(category);
        sections.push(`<div class="section ${cssClass}">`);
        sections.push(`<h2 class="section-title ${cssClass}-title">${this._escapeHtml(category)}</h2>`);
        sections.push('<ul>');
        for (const change of changes) {
          let li = this._escapeHtml(change.description);
          if (change.scope) {
            li += ` <code class="scope-code">${this._escapeHtml(change.scope)}</code>`;
          }
          if (change.pr) {
            li += ` <a href="${data.repoUrl}/pull/${change.pr}" class="link">#${change.pr}</a>`;
          }
          if (change.author) {
            li += ` <span class="author">by @${this._escapeHtml(change.author)}</span>`;
          }
          sections.push(`<li>${li}</li>`);
        }
        sections.push('</ul>');
        sections.push('</div>');
      }
    }

    // Contributors
    if (data.contributors && data.contributors.length > 0) {
      sections.push('<div class="section contributors">');
      sections.push('<h2 class="section-title contributors-title">Contributors</h2>');
      sections.push('<div class="contributor-list">');
      for (const c of data.contributors) {
        const firstTimer = c.is_first_time ? ' <span class="first-timer">FIRST TIME</span>' : '';
        sections.push(
          `<span class="contributor">@${this._escapeHtml(c.login)} (${c.commits_count})${firstTimer}</span>`
        );
      }
      sections.push('</div>');
      sections.push('</div>');
    }

    // Footer
    sections.push('<div class="footer">');
    if (data.previousVersion) {
      sections.push(`<a href="${data.repoUrl}/compare/v${data.previousVersion}...v${data.version}" class="changelog-link">Full Changelog</a>`);
    }
    sections.push(`<span>Generated on ${data.date}</span>`);
    sections.push('</div>');

    sections.push('</div>');
    sections.push('</body>');
    sections.push('</html>');

    return sections.join('\n');
  }

  /**
   * Get inline CSS styles.
   * @returns {string}
   */
  _getCSS() {
    return `
      * { box-sizing: border-box; margin: 0; padding: 0; }
      body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, sans-serif; background: #f6f8fa; color: #24292f; line-height: 1.6; padding: 20px; }
      .container { max-width: 800px; margin: 0 auto; background: #fff; border-radius: 12px; box-shadow: 0 1px 3px rgba(0,0,0,0.12); padding: 32px; }
      .header { font-size: 28px; font-weight: 700; color: #24292f; border-bottom: 2px solid #e1e4e8; padding-bottom: 12px; margin-bottom: 8px; }
      .date { color: #656d76; font-size: 14px; margin-bottom: 12px; }
      .summary { font-size: 16px; color: #24292f; margin-bottom: 24px; padding: 12px; background: #f6f8fa; border-radius: 6px; border-left: 4px solid #0969da; }
      .section { margin-bottom: 24px; border-radius: 8px; padding: 16px; }
      .section-title { font-size: 18px; font-weight: 600; margin-bottom: 12px; padding-bottom: 8px; }
      .features { background: #f0fff4; border: 1px solid #2da44e; }
      .features-title { color: #1a7f37; border-bottom: 1px solid #2da44e33; }
      .fixes { background: #ddf4ff; border: 1px solid #0969da; }
      .fixes-title { color: #0550ae; border-bottom: 1px solid #0969da33; }
      .breaking { background: #ffebe9; border: 1px solid #cf222e; }
      .breaking-title { color: #a40e26; border-bottom: 1px solid #cf222e33; }
      .other { background: #f6f8fa; border: 1px solid #d0d7de; }
      .other-title { color: #656d76; border-bottom: 1px solid #d0d7de; }
      .performance { background: #fff8c5; border: 1px solid #bf8700; }
      .performance-title { color: #9a6700; border-bottom: 1px solid #bf870033; }
      .section ul { list-style: none; padding-left: 0; }
      .section li { padding: 4px 0; padding-left: 20px; position: relative; }
      .section li::before { content: ''; position: absolute; left: 0; top: 12px; width: 8px; height: 8px; border-radius: 50%; }
      .features li::before { background: #2da44e; }
      .fixes li::before { background: #0969da; }
      .breaking li::before { background: #cf222e; }
      .item { padding: 8px 12px; margin-bottom: 8px; background: #fff; border-radius: 6px; border: 1px solid #cf222e33; }
      .migration { margin-top: 6px; font-size: 14px; color: #656d76; }
      .badge { display: inline-block; padding: 2px 8px; border-radius: 12px; font-size: 12px; margin-left: 8px; }
      .scope { background: #e1e4e8; color: #656d76; }
      .scope-code { background: #e1e4e8; padding: 1px 6px; border-radius: 4px; font-size: 13px; }
      .link { color: #0969da; text-decoration: none; }
      .link:hover { text-decoration: underline; }
      .author { color: #656d76; font-size: 14px; }
      .contributors { background: #fafbfc; border: 1px solid #d0d7de; }
      .contributors-title { color: #24292f; border-bottom: 1px solid #d0d7de; }
      .contributor-list { display: flex; flex-wrap: wrap; gap: 8px; }
      .contributor { display: inline-block; padding: 4px 12px; background: #f6f8fa; border-radius: 16px; font-size: 14px; border: 1px solid #d0d7de; }
      .first-timer { background: #ffd33d; color: #24292f; padding: 1px 6px; border-radius: 8px; font-size: 11px; font-weight: 600; margin-left: 4px; }
      .footer { text-align: center; padding-top: 16px; border-top: 1px solid #e1e4e8; color: #656d76; font-size: 13px; display: flex; justify-content: space-between; align-items: center; }
      .changelog-link { color: #0969da; text-decoration: none; font-weight: 500; }
      @media (max-width: 600px) { .container { padding: 16px; } .header { font-size: 22px; } }
    `.replace(/\n\s+/g, ' ').trim();
  }

  /**
   * Get a CSS class name for a category.
   * @param {string} category
   * @returns {string}
   */
  _getCategoryClass(category) {
    const lower = category.toLowerCase();
    if (lower.includes('feature') || lower.includes('rocket')) return 'features';
    if (lower.includes('fix') || lower.includes('bug')) return 'fixes';
    if (lower.includes('breaking')) return 'breaking';
    if (lower.includes('perf') || lower.includes('performance') || lower.includes('speed')) return 'performance';
    return 'other';
  }

  /**
   * Escape HTML special characters.
   * @param {string} str
   * @returns {string}
   */
  _escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }
}

module.exports = { HTMLFormatter };
