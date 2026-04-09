'use strict';

const { LANGUAGES } = require('./constants');

/**
 * Get the system prompt for AI release note generation.
 * @param {Object} config - Configuration object
 * @returns {string} System prompt
 */
function getSystemPrompt(config) {
  const lang = LANGUAGES[config.language] || LANGUAGES.en;
  const styleGuidance = getStyleGuidance(config.template);

  return `You are an expert technical writer specializing in software release notes. Your task is to generate clear, informative, and well-structured release notes from commit and PR data.

## Language
Write the release notes in ${config.language === 'en' ? 'English' : lang.title} (${config.language}).

## Style
${styleGuidance}

## Rules
1. Use past tense ("Added", "Fixed", "Improved" — not "Add", "Fix", "Improve")
2. Group related changes logically under category headings
3. Include PR numbers as clickable markdown links: [#123](https://github.com/example/repo/pull/123) — use the repo from context
4. For breaking changes, always include a "Migration Guide" subsection with specific steps
5. Be specific and concrete ("Added user avatar upload API endpoint at POST /api/users/avatar" not "Added new features")
6. Maximum 2000 words
7. Use proper markdown formatting with headers (##), bullet points (-), bold (**), and code blocks where appropriate
8. Start with a one-paragraph summary of the release
9. Do not include empty sections
10. Include contributor acknowledgments at the end
11. Preserve any technical details, version numbers, or configuration references from the source data
12. Handle unicode characters correctly in commit messages

## Output Format
Return ONLY the markdown content for the release notes body. Do not include a top-level heading (h1) — start with a summary paragraph or h2 sections.`;
}

/**
 * Get style guidance based on template.
 */
function getStyleGuidance(template) {
  switch (template) {
    case 'enterprise':
      return `Write in a formal, professional tone suitable for enterprise audiences. Include:
- Executive Summary section (2-3 sentences)
- Structured Change sections with clear categorization
- Impact Assessment for each significant change
- Action Items section (what users should do after upgrading)
- Known Issues section (if applicable)
- Avoid emojis. Use clear, precise language.`;

    case 'fun':
      return `Write in a casual, celebratory tone! Use emojis liberally. Include:
- Enthusiastic language ("This release is packed with awesomeness!")
- Fun metaphors and analogies
- Celebrate contributor achievements
- Use emojis for section headers and bullet points
- Keep it light but still informative
- End with something encouraging`;

    case 'minimal':
      return `Be extremely concise. Use simple bullet points only.
- One line per change
- No sections, no summary paragraph
- Just the facts, ma'am
- PR number and brief description`;

    case 'detailed':
      return `Be thorough and comprehensive. Include:
- Detailed summary paragraph
- Every change with full context
- Author credits for each change
- Diff statistics and affected areas
- Linked issues with full URLs
- Migration guides for breaking changes
- Screenshots section (if images detected)`;

    case 'default':
    default:
      return `Use a balanced, developer-friendly tone. Be clear and concise but friendly. Include:
- Brief summary paragraph
- Categorized changes with bullet points
- Contributor thanks section
- Full changelog link`;
  }
}

/**
 * Get the user prompt with structured data from the analysis.
 * @param {Object} analysis - Analysis results from analyzer
 * @param {Object} diffSummary - Diff analysis results
 * @param {string} version - Current version
 * @param {Object} config - Configuration object
 * @returns {string} User prompt
 */
function getUserPrompt(analysis, diffSummary, version, config) {
  const sections = [];

  sections.push(`# Release Data for v${version}`);
  sections.push('');
  sections.push(`## Repository: ${config.repoFullName || 'unknown'}`);
  sections.push(`## Date: ${new Date().toISOString().split('T')[0]}`);
  sections.push('');

  // Stats
  if (analysis.stats) {
    sections.push('## Statistics');
    sections.push(`- Total commits: ${analysis.stats.total_commits}`);
    sections.push(`- Total PRs: ${analysis.stats.total_prs}`);
    sections.push(`- Files changed: ${analysis.stats.total_files_changed}`);
    sections.push(`- Additions: ${analysis.stats.additions}`);
    sections.push(`- Deletions: ${analysis.stats.deletions}`);
    sections.push('');
  }

  // Categories
  if (analysis.categories) {
    sections.push('## Categorized Changes');
    for (const [category, changes] of Object.entries(analysis.categories)) {
      sections.push(`### ${category}`);
      for (const change of changes) {
        let line = `- ${change.description}`;
        if (change.pr) {
          line += ` (#${change.pr})`;
        }
        if (change.scope) {
          line += ` [${change.scope}]`;
        }
        if (change.author) {
          line += ` by @${change.author}`;
        }
        sections.push(line);
      }
      sections.push('');
    }
  }

  // Breaking changes
  if (analysis.breaking && analysis.breaking.length > 0) {
    sections.push('## Breaking Changes');
    for (const bc of analysis.breaking) {
      sections.push(`- ${bc.description}`);
      if (bc.migration_guide) {
        sections.push(`  Migration: ${bc.migration_guide}`);
      }
      if (bc.scope) {
        sections.push(`  Scope: ${bc.scope}`);
      }
    }
    sections.push('');
  }

  // Contributors
  if (analysis.contributors && analysis.contributors.length > 0) {
    sections.push('## Contributors');
    for (const c of analysis.contributors) {
      sections.push(`- @${c.login} (${c.commits_count} commit${c.commits_count !== 1 ? 's' : ''})${c.is_first_time ? ' [FIRST TIME]' : ''}`);
    }
    sections.push('');
  }

  // Diff summary
  if (diffSummary && diffSummary.files_changed > 0) {
    sections.push('## Diff Summary');
    sections.push(`- Files changed: ${diffSummary.files_changed} (${diffSummary.files_added} added, ${diffSummary.files_modified} modified, ${diffSummary.files_deleted} deleted)`);
    sections.push(`- Lines: +${diffSummary.additions} / -${diffSummary.deletions}`);
    sections.push(`- Impact: ${diffSummary.impact}`);
    if (diffSummary.affected_areas.length > 0) {
      sections.push(`- Affected areas: ${diffSummary.affected_areas.join(', ')}`);
    }
    if (diffSummary.potential_breaking.length > 0) {
      sections.push('- Potential breaking changes detected:');
      for (const pb of diffSummary.potential_breaking) {
        sections.push(`  - ${pb.file}: ${pb.reason}`);
      }
    }
    sections.push('');
  }

  // Scopes
  if (analysis.scopes && Object.keys(analysis.scopes).length > 0) {
    sections.push('## Scopes');
    for (const [scope, count] of Object.entries(analysis.scopes)) {
      sections.push(`- ${scope}: ${count} change${count !== 1 ? 's' : ''}`);
    }
    sections.push('');
  }

  // Linked issues
  if (analysis.linkedIssues && analysis.linkedIssues.length > 0) {
    sections.push('## Linked Issues');
    for (const issue of analysis.linkedIssues) {
      sections.push(`- #${issue.number}`);
    }
    sections.push('');
  }

  sections.push('---');
  sections.push('Generate the release notes now based on the above data.');

  return sections.join('\n');
}

module.exports = {
  getSystemPrompt,
  getUserPrompt,
  getStyleGuidance,
};
