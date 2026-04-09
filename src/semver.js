'use strict';

const logger = require('./logger');

/**
 * Parse a version string or tag into components.
 * Handles: v1.2.3, 1.2.3, v1.2.3-beta.1, v1.2.3-alpha, etc.
 */
function parseVersion(tag) {
  if (!tag || typeof tag !== 'string') {
    return null;
  }

  const cleaned = tag.replace(/^v/, '').trim();
  const match = cleaned.match(/^(\d+)\.(\d+)\.(\d+)(?:[-.]([\w.]+))?$/i);

  if (!match) {
    logger.debug(`Could not parse version from: ${tag}`);
    return null;
  }

  return {
    major: parseInt(match[1], 10),
    minor: parseInt(match[2], 10),
    patch: parseInt(match[3], 10),
    prerelease: match[4] || null,
    raw: tag,
    clean: cleaned,
  };
}

/**
 * Compare two version strings or parsed version objects.
 * Returns: -1 if a < b, 0 if a === b, 1 if a > b
 */
function compareVersions(a, b) {
  const vA = typeof a === 'string' ? parseVersion(a) : a;
  const vB = typeof b === 'string' ? parseVersion(b) : b;

  if (!vA && !vB) return 0;
  if (!vA) return -1;
  if (!vB) return 1;

  if (vA.major !== vB.major) return vA.major > vB.major ? 1 : -1;
  if (vA.minor !== vB.minor) return vA.minor > vB.minor ? 1 : -1;
  if (vA.patch !== vB.patch) return vA.patch > vB.patch ? 1 : -1;

  // No prerelease > prerelease
  if (!vA.prerelease && vB.prerelease) return 1;
  if (vA.prerelease && !vB.prerelease) return -1;
  if (vA.prerelease && vB.prerelease) {
    if (vA.prerelease < vB.prerelease) return -1;
    if (vA.prerelease > vB.prerelease) return 1;
  }

  return 0;
}

/**
 * Determine the next version based on commit analysis.
 * Breaking changes -> major bump
 * Features -> minor bump
 * Fixes only -> patch bump
 */
function getNextVersion(commits, currentVersion) {
  const parsed = typeof currentVersion === 'string' ? parseVersion(currentVersion) : currentVersion;
  if (!parsed) {
    logger.warn(`Cannot determine next version: invalid current version "${currentVersion}"`);
    return currentVersion;
  }

  let hasBreaking = false;
  let hasFeature = false;
  let hasFix = false;

  for (const commit of commits) {
    const message = (commit.message || commit.commit?.message || '').toLowerCase();
    const type = commit._type || '';

    if (
      message.includes('breaking change') ||
      message.includes('breaking:') ||
      type === 'breaking'
    ) {
      hasBreaking = true;
    }
    if (type === 'feat' || message.match(/^feat[(!:]/)) {
      hasFeature = true;
    }
    if (type === 'fix' || message.match(/^fix[(!:]/)) {
      hasFix = true;
    }
  }

  let nextMajor = parsed.major;
  let nextMinor = parsed.minor;
  let nextPatch = parsed.patch;

  if (hasBreaking) {
    nextMajor += 1;
    nextMinor = 0;
    nextPatch = 0;
  } else if (hasFeature) {
    nextMinor += 1;
    nextPatch = 0;
  } else if (hasFix) {
    nextPatch += 1;
  }

  const nextVersion = `${nextMajor}.${nextMinor}.${nextPatch}`;
  logger.info(`Next version determined: ${nextVersion} (breaking=${hasBreaking}, feature=${hasFeature}, fix=${hasFix})`);
  return nextVersion;
}

/**
 * Check if a version tag indicates a prerelease.
 */
function isPrerelease(tag) {
  if (!tag || typeof tag !== 'string') return false;
  const cleaned = tag.replace(/^v/, '').trim();
  return /[-.](alpha|beta|rc|pre|dev|canary|next|experimental|nightly)[-.]?\d*/i.test(cleaned);
}

module.exports = {
  parseVersion,
  compareVersions,
  getNextVersion,
  isPrerelease,
};
