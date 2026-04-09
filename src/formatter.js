'use strict';

const fs = require('fs');
const path = require('path');
const logger = require('./logger');
const { formatDiffStats } = require('./diff-analyzer');
const { formatContributorThanks } = require('./contributor');

/**
 * Format release notes using a template.
 * @param {Object} analysis - Analysis results
 * @param {Object} diffSummary - Diff analysis results
 * @param {string} version - Current version
 * @param {string} previousVersion - Previous version
 * @param {Object} config - Configuration object
 * @returns {string} Formatted release notes
 */
function formatReleaseNotes(analysis, diffSummary, version, previousVersion, config) {
  try {
    const template = loadTemplate(config.template);
    const repoUrl = config.repoUrl || `https://github.com/${config.repoFullName || 'owner/repo'}`;

    const variables = {
      version: version || '0.0.0',
      previous_version: previousVersion || '',
      date: new Date().toISOString().split('T')[0],
      summary: generateSummary(analysis, version),
      categories: formatCategories(analysis.categories || {}),
      breaking_changes: config.includeBreaking ? formatBreakingChanges(analysis.breaking || []) : '',
      contributors: config.includeContributors ? formatContributors(analysis.contributors || []) : '',
      diff_stats: config.includeDiffStats ? formatDiffStats(diffSummary) : '',
      full_changelog_link: formatChangelogLink(repoUrl, previousVersion, version),
      screenshots: config.includeScreenshots ? formatScreenshots(analysis.screenshots || []) : '',
      bullet_points: formatBulletPoints(analysis.categories || {}),
      linked_issues: formatLinkedIssues(analysis.linkedIssues || [], repoUrl),
      impact_assessment: formatImpactAssessment(diffSummary),
      action_items: generateActionItems(analysis, diffSummary),
      known_issues: '',
    };

    let output = template;

    // Replace all template variables
    for (const [key, value] of Object.entries(variables)) {
      const regex = new RegExp(`\\{\\{${key}\\}\\}`, 'g');
      output = output.replace(regex, value || '');
    }

    // Clean up any remaining unresolved template variables
    output = cleanUnresolvedVariables(output);

    // Clean up excessive blank lines
    output = output.replace(/\n{3,}/g, '\n\n').trim();

    return output;
  } catch (err) {
    logger.error('Failed to format release notes', err);
    return `## Release v${version || '0.0.0'}\n\nGenerated on ${new Date().toISOString().split('T')[0]}`;
  }
}

/**
 * Load a template by name or file path.
 */
function loadTemplate(templateName) {
  const builtInTemplates = ['default', 'minimal', 'detailed', 'enterprise', 'fun'];

  if (builtInTemplates.includes(templateName)) {
    const templatePath = path.join(__dirname, '..', 'templates', `${templateName}.md`);
    try {
      return fs.readFileSync(templatePath, 'utf-8');
    } catch (err) {
      logger.warn(`Built-in template "${templateName}" not found at ${templatePath}, using fallback`);
      return '## What\'s Changed\n\n{{categories}}\n\n**Full Changelog**: {{full_changelog_link}}';
    }
  }

  // Custom template file path
  try {
    const resolvedPath = path.resolve(templateName);
    return fs.readFileSync(resolvedPath, 'utf-8');
  } catch (err) {
    logger.warn(`Custom template "${templateName}" not found, using default`);
    try {
      return fs.readFileSync(path.join(__dirname, '..', 'templates', 'default.md'), 'utf-8');
    } catch (fallbackErr) {
      return '## What\'s Changed\n\n{{categories}}\n\n**Full Changelog**: {{full_changelog_link}}';
    }
  }
}

/**
 * Generate a one-line summary of the release.
 */
function generateSummary(analysis, version) {
  if (!analysis || !analysis.stats) {
    return `Release v${version} includes various improvements and fixes.`;
  }

  const parts = [];
  const categoryCount = Object.keys(analysis.categories || {}).length;
  const commitCount = analysis.stats.total_commits || 0;
  const contributorCount = (analysis.contributors || []).length;

  if (commitCount > 0) {
    parts.push(`${commitCount} commit${commitCount !== 1 ? 's' : ''}`);
  }
  if (categoryCount > 0) {
    parts.push(`${categoryCount} categor${categoryCount !== 1 ? 'ies' : 'y'} of changes`);
  }
  if (contributorCount > 0) {
    parts.push(`${contributorCount} contributor${contributorCount !== 1 ? 's' : ''}`);
  }

  if (analysis.breaking && analysis.breaking.length > 0) {
    parts.push(`${analysis.breaking.length} breaking change${analysis.breaking.length !== 1 ? 's' : ''}`);
  }

  if (parts.length === 0) {
    return `Release v${version} includes various improvements and fixes.`;
  }

  return `Release v${version} brings ${parts.join(', ')}.`;
}

/**
 * Format categorized changes as markdown sections.
 */
function formatCategories(categories) {
  if (!categories || Object.keys(categories).length === 0) {
    return 'No categorized changes in this release.';
  }

  const lines = [];
  for (const [category, changes] of Object.entries(categories)) {
    lines.push(`### ${category}`);
    lines.push('');
    for (const change of changes) {
      let line = `- ${change.description}`;
      if (change.pr) {
        line += ` (#${change.pr})`;
      }
      if (change.author) {
        line += ` by @${change.author}`;
      }
      lines.push(line);
    }
    lines.push('');
  }

  return lines.join('\n').trim();
}

/**
 * Format breaking changes section.
 */
function formatBreakingChanges(breakingChanges) {
  if (!breakingChanges || breakingChanges.length === 0) {
    return '';
  }

  const lines = ['### 💥 Breaking Changes', ''];
  for (const bc of breakingChanges) {
    lines.push(`- **${bc.description}**`);
    if (bc.scope) {
      lines.push(`  - Scope: \`${bc.scope}\``);
    }
    if (bc.migration_guide) {
      lines.push(`  - **Migration**: ${bc.migration_guide}`);
    }
    if (bc.pr) {
      lines.push(`  - PR: #${bc.pr}`);
    }
  }
  lines.push('');

  return lines.join('\n').trim();
}

/**
 * Format contributors section.
 */
function formatContributors(contributors) {
  if (!contributors || contributors.length === 0) {
    return '';
  }

  const lines = ['### 👥 Contributors', ''];
  lines.push(formatContributorThanks(contributors));
  lines.push('');

  return lines.join('\n').trim();
}

/**
 * Format bullet points for minimal template.
 */
function formatBulletPoints(categories) {
  if (!categories || Object.keys(categories).length === 0) {
    return '- No changes in this release.';
  }

  const lines = [];
  for (const changes of Object.values(categories)) {
    for (const change of changes) {
      let line = `- ${change.description}`;
      if (change.pr) {
        line += ` (#${change.pr})`;
      }
      lines.push(line);
    }
  }

  return lines.join('\n');
}

/**
 * Format the full changelog comparison link.
 */
function formatChangelogLink(repoUrl, previousVersion, currentVersion) {
  if (!previousVersion) {
    return `${repoUrl}/releases/tag/v${currentVersion}`;
  }
  return `${repoUrl}/compare/v${previousVersion}...v${currentVersion}`;
}

/**
 * Format screenshots section.
 */
function formatScreenshots(screenshots) {
  if (!screenshots || screenshots.length === 0) {
    return '';
  }

  const lines = ['### Screenshots', ''];
  for (const shot of screenshots) {
    lines.push(`![${shot.alt || 'Screenshot'}](${shot.url})`);
  }
  return lines.join('\n').trim();
}

/**
 * Format linked issues section.
 */
function formatLinkedIssues(issues, repoUrl) {
  if (!issues || issues.length === 0) {
    return '';
  }

  const lines = ['### Linked Issues', ''];
  for (const issue of issues) {
    lines.push(`- [#${issue.number}](${repoUrl}/issues/${issue.number})`);
  }
  return lines.join('\n').trim();
}

/**
 * Format impact assessment for enterprise template.
 */
function formatImpactAssessment(diffSummary) {
  if (!diffSummary || diffSummary.files_changed === 0) {
    return 'No significant impact assessment available for this release.';
  }

  const lines = [];
  lines.push(`- **Impact Level**: ${diffSummary.impact}`);
  lines.push(`- **Files Changed**: ${diffSummary.files_changed}`);
  lines.push(`- **Code Changes**: +${diffSummary.additions} / -${diffSummary.deletions}`);

  if (diffSummary.affected_areas.length > 0) {
    lines.push(`- **Affected Areas**: ${diffSummary.affected_areas.join(', ')}`);
  }

  if (diffSummary.potential_breaking.length > 0) {
    lines.push('');
    lines.push('**Potential Breaking Changes Detected:**');
    for (const pb of diffSummary.potential_breaking) {
      lines.push(`- ${pb.file}: ${pb.reason}`);
    }
  }

  return lines.join('\n');
}

/**
 * Generate action items for enterprise template.
 */
function generateActionItems(analysis, diffSummary) {
  const items = [];

  if (analysis && analysis.breaking && analysis.breaking.length > 0) {
    items.push('- **Required**: Review breaking changes and update configurations accordingly');
  }

  if (diffSummary && diffSummary.affected_areas) {
    if (diffSummary.affected_areas.includes('Database')) {
      items.push('- **Required**: Run database migrations before deploying');
    }
    if (diffSummary.affected_areas.includes('Configuration')) {
      items.push('- **Required**: Review and update configuration files');
    }
    if (diffSummary.affected_areas.includes('Authentication')) {
      items.push('- **Recommended**: Verify authentication flows after deployment');
    }
  }

  if (items.length === 0) {
    items.push('- No specific action items for this release');
  }

  return items.join('\n');
}

/**
 * Clean up any remaining unresolved template variables.
 * Replaces {{variable_name}} with empty string.
 */
function cleanUnresolvedVariables(output) {
  return output.replace(/\{\{[a-z_]+\}\}/gi, '');
}

module.exports = {
  formatReleaseNotes,
  loadTemplate,
  generateSummary,
  formatCategories,
  formatBreakingChanges,
  formatContributors,
  formatBulletPoints,
  formatChangelogLink,
  formatScreenshots,
  formatLinkedIssues,
  formatImpactAssessment,
  generateActionItems,
  cleanUnresolvedVariables,
};
