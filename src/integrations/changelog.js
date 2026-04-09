'use strict';

const logger = require('../logger');

/**
 * Update CHANGELOG.md with new release entry.
 * @param {Object} octokit - Octokit instance
 * @param {Object} context - GitHub Actions context
 * @param {Object} config - Configuration object
 * @param {string} notes - Release notes body
 * @param {string} version - Version string
 * @returns {Object} { success, message }
 */
async function updateChangelog(octokit, context, config, notes, version) {
  try {
    const owner = context.repo.owner;
    const repo = context.repo.repo;
    const changelogPath = config.changelogPath || 'CHANGELOG.md';
    const date = new Date().toISOString().split('T')[0];

    logger.info(`Updating ${changelogPath} with v${version}`);

    // Read existing changelog
    let existingContent = '';
    let sha = null;
    try {
      const { data } = await octokit.rest.repos.getContent({
        owner,
        repo,
        path: changelogPath,
        ref: context.payload.ref || 'HEAD',
      });
      existingContent = Buffer.from(data.content, 'base64').toString('utf-8');
      sha = data.sha;
    } catch (err) {
      if (err.status === 404) {
        logger.info('No existing CHANGELOG.md — creating new one');
        existingContent = '# Changelog\n\n';
        sha = null;
      } else {
        throw err;
      }
    }

    // Build new entry
    const newEntry = buildChangelogEntry(version, date, notes);

    // Prepend new entry after the header
    const updatedContent = prependEntry(existingContent, newEntry);

    // Commit and push
    const commitMessage = `docs(changelog): update for v${version}`;

    await octokit.rest.repos.createOrUpdateFileContents({
      owner,
      repo,
      path: changelogPath,
      message: commitMessage,
      content: Buffer.from(updatedContent).toString('base64'),
      sha: sha,
      branch: context.payload.ref ? context.payload.ref.replace('refs/heads/', '') : 'main',
    });

    logger.info(`Changelog updated: ${changelogPath}`);
    return { success: true, message: `Updated ${changelogPath}` };
  } catch (err) {
    logger.error('Failed to update changelog', err);
    return { success: false, message: err.message };
  }
}

/**
 * Build a structured changelog entry from release notes.
 */
function buildChangelogEntry(version, date, notes) {
  const lines = [];
  lines.push(`## [${version}] - ${date}`);
  lines.push('');

  if (notes) {
    // Parse notes into structured sections
    const noteLines = notes.split('\n');
    for (const line of noteLines) {
      // Skip h1 headers and full changelog links
      if (line.match(/^# /)) continue;
      if (line.match(/\*\*Full Changelog\*\*/)) continue;
      lines.push(line);
    }
  }

  lines.push('');
  return lines.join('\n');
}

/**
 * Prepend a new entry to the existing changelog content.
 * Inserts after the first header (# Changelog) if present.
 */
function prependEntry(existingContent, newEntry) {
  const lines = existingContent.split('\n');
  let insertIndex = 0;

  // Find the first header
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].match(/^#\s+/)) {
      // Skip the header and any trailing blank lines
      insertIndex = i + 1;
      while (insertIndex < lines.length && lines[insertIndex].trim() === '') {
        insertIndex++;
      }
      break;
    }
  }

  // Insert new entry
  lines.splice(insertIndex, 0, newEntry);

  // Clean up excessive blank lines
  let result = lines.join('\n');
  result = result.replace(/\n{3,}/g, '\n\n');

  return result;
}

module.exports = { updateChangelog, buildChangelogEntry, prependEntry };
