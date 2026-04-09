'use strict';

const logger = require('../logger');
const { isPrerelease } = require('../semver');

/**
 * Create or update a GitHub Release.
 * @param {Object} octokit - Octokit instance
 * @param {Object} context - GitHub Actions context
 * @param {string} version - Version string
 * @param {string} notes - Release notes body
 * @param {Object} config - Configuration object
 * @returns {Object} { url, created }
 */
async function createRelease(octokit, context, version, notes, config) {
  try {
    const owner = context.repo.owner;
    const repo = context.repo.repo;
    const tag = `v${version}`;
    const prerelease = isPrerelease(version);

    logger.info(`Creating GitHub Release for ${tag} (prerelease=${prerelease})`);

    // Check if release already exists for this tag
    let existingRelease = null;
    try {
      const { data } = await octokit.rest.repos.getReleaseByTag({
        owner,
        repo,
        tag,
      });
      existingRelease = data;
    } catch (err) {
      // 404 means no existing release — expected for new releases
      if (err.status !== 404) {
        logger.debug(`Error checking existing release: ${err.message}`);
      }
    }

    if (existingRelease) {
      // Update existing release
      logger.info(`Updating existing release for ${tag}`);
      const { data: updated } = await octokit.rest.repos.updateRelease({
        owner,
        repo,
        release_id: existingRelease.id,
        body: notes,
        draft: false,
        prerelease: prerelease,
      });

      logger.info(`Release updated: ${updated.html_url}`);
      return { url: updated.html_url, created: false };
    }

    // Create new release
    const { data: release } = await octokit.rest.repos.createRelease({
      owner,
      repo,
      tag_name: tag,
      name: tag,
      body: notes,
      draft: false,
      prerelease: prerelease,
    });

    logger.info(`Release created: ${release.html_url}`);
    return { url: release.html_url, created: true };
  } catch (err) {
    logger.error('Failed to create/update GitHub Release', err);
    throw err;
  }
}

module.exports = { createRelease };
