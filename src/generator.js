'use strict';

const github = require('@actions/github');
const logger = require('./logger');
const { analyzeCommits } = require('./analyzer');
const { analyzeDiff, formatDiffStats } = require('./diff-analyzer');
const { generateReleaseNotes: aiGenerate } = require('./ai-writer');
const { formatReleaseNotes, generateSummary } = require('./formatter');
const { postToIntegrations } = require('./integrations/indexer');
const { parseVersion, isPrerelease } = require('./semver');
const { createGitHubRateLimiter } = require('./rate-limiter');

/**
 * Main orchestrator — generate release notes and post to integrations.
 * @param {Object} config - Validated configuration object
 * @returns {Object} { notes, url, version, summary }
 */
async function generate(config) {
  logger.info('Starting release notes generation');

  const octokit = github.getOctokit(config.githubToken);
  const context = github.context;
  const rateLimiter = createGitHubRateLimiter();

  // Set repo info on config for formatter
  config.repoFullName = `${context.repo.owner}/${context.repo.repo}`;
  config.repoUrl = `https://github.com/${config.repoFullName}`;

  // Step 1: Determine version
  const version = determineVersion(config, context);
  logger.info(`Version: ${version}`);

  // Step 2: Determine previous version
  const previousVersion = await determinePreviousVersion(config, octokit, context, rateLimiter);
  logger.info(`Previous version: ${previousVersion || 'none (first release)'}`);

  // Step 3: Collect changes
  const { commits, prs } = await collectChanges(
    config, octokit, context, previousVersion, version, rateLimiter
  );
  logger.info(`Collected ${commits.length} commits and ${prs.length} PRs`);

  // Step 4: Analyze changes
  const analysis = analyzeCommits(commits, config);
  logger.info(`Analysis: ${analysis.stats.total_commits} commits in ${Object.keys(analysis.categories).length} categories`);

  // Step 5: Analyze diff (optional)
  let diffSummary = null;
  if (config.includeDiffStats) {
    try {
      await rateLimiter.wait();
      diffSummary = await analyzeDiff(commits.slice(0, Math.min(commits.length, 50)), octokit, context);
    } catch (err) {
      logger.warn('Diff analysis failed, continuing without it', err);
      diffSummary = { files_changed: 0, additions: 0, deletions: 0, impact: 'low', affected_areas: [], potential_breaking: [], files: [], files_added: 0, files_modified: 0, files_deleted: 0 };
    }
  }

  // Step 6: Generate release notes (AI or template)
  let notes;
  if (config.hasAI) {
    try {
      const aiNotes = await aiGenerate(analysis, diffSummary, version, config);
      if (aiNotes) {
        notes = aiNotes;
        logger.info('Using AI-generated release notes');
      } else {
        notes = formatReleaseNotes(analysis, diffSummary, version, previousVersion, config);
        logger.info('AI failed or returned nothing — using template-based notes');
      }
    } catch (err) {
      logger.warn('AI generation threw error — falling back to template', err);
      notes = formatReleaseNotes(analysis, diffSummary, version, previousVersion, config);
    }
  } else {
    notes = formatReleaseNotes(analysis, diffSummary, version, previousVersion, config);
    logger.info('Using template-based release notes (no API key)');
  }

  // Generate summary
  const summary = generateSummary(analysis, version);

  // Step 7: Post to integrations
  const releaseData = {
    version,
    notes,
    summary,
    url: '',
    contributors: analysis.contributors || [],
  };

  if (!config.dryRun) {
    try {
      const integrationResults = await postToIntegrations(config, releaseData, octokit, context);
      if (integrationResults.githubRelease && integrationResults.githubRelease.url) {
        releaseData.url = integrationResults.githubRelease.url;
      }
    } catch (err) {
      logger.error('Integration posting failed (non-fatal)', err);
    }
  } else {
    logger.info('Dry run mode — skipping all integrations');
  }

  logger.info(`Release notes generated for v${version}`);

  return {
    notes: releaseData.notes,
    url: releaseData.url,
    version: version,
    summary: summary,
  };
}

/**
 * Determine the current version based on config.
 */
function determineVersion(config, context) {
  switch (config.versionFrom) {
    case 'tag': {
      const ref = process.env.GITHUB_REF || '';
      const tagMatch = ref.match(/refs\/tags\/v?(.+)/);
      if (tagMatch) {
        return tagMatch[1];
      }
      // Try to get from context payload
      if (context.payload.release && context.payload.release.tag_name) {
        return context.payload.release.tag_name.replace(/^v/, '');
      }
      logger.warn('Could not determine version from tag');
      return '0.0.0';
    }
    case 'package-json': {
      try {
        const fs = require('fs');
        const path = require('path');
        const pkgPath = path.join(process.env.GITHUB_WORKSPACE || process.cwd(), 'package.json');
        const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));
        return pkg.version || '0.0.0';
      } catch (err) {
        logger.warn('Could not read version from package.json', err);
        return '0.0.0';
      }
    }
    case 'manual':
      return config.version || '0.0.0';
    default:
      return '0.0.0';
  }
}

/**
 * Determine the previous version/tag.
 */
async function determinePreviousVersion(config, octokit, context, rateLimiter) {
  // Manual override
  if (config.previousTag) {
    return config.previousTag.replace(/^v/, '');
  }

  // Auto-detect from GitHub releases
  try {
    await rateLimiter.wait();
    const { data: releases } = await octokit.rest.repos.listReleases({
      owner: context.repo.owner,
      repo: context.repo.repo,
      per_page: 10,
    });

    for (const release of releases) {
      const tag = release.tag_name.replace(/^v/, '');
      if (!isPrerelease(tag) || release.prerelease) {
        // Skip prereleases for finding previous stable
        if (!release.prerelease) {
          return tag;
        }
      }
    }

    // If no stable release found, use the latest release of any type
    if (releases.length > 0) {
      return releases[0].tag_name.replace(/^v/, '');
    }
  } catch (err) {
    logger.debug(`Could not auto-detect previous version: ${err.message}`);
  }

  return '';
}

/**
 * Collect changes (commits and/or PRs) between versions.
 */
async function collectChanges(config, octokit, context, previousVersion, currentVersion, rateLimiter) {
  const owner = context.repo.owner;
  const repo = context.repo.repo;
  let commits = [];
  let prs = [];

  const commitMode = config.commitMode;

  // Determine if we should use PR mode
  let usePRs = false;
  if (commitMode === 'pull-requests') {
    usePRs = true;
  } else if (commitMode === 'auto') {
    // Check if there are PRs between the versions
    try {
      await rateLimiter.wait();
      const base = previousVersion ? `v${previousVersion}` : undefined;
      const head = `v${currentVersion}`;
      if (base) {
        const { data: compareData } = await octokit.rest.repos.compareCommits({
          owner,
          repo,
          base,
          head,
        });
        // If commits have PR numbers, prefer PR mode
        const commitsWithPRs = (compareData.commits || []).filter(
          c => c.commit.message.match(/\(#\d+\)/)
        );
        usePRs = commitsWithPRs.length > (compareData.commits || []).length * 0.3;
      }
    } catch (err) {
      logger.debug(`Could not determine auto mode: ${err.message}`);
      usePRs = false;
    }
  }

  if (usePRs) {
    // Collect merged PRs between versions
    try {
      await rateLimiter.wait();
      const prQuery = previousVersion
        ? `is:pr is:merged repo:${owner}/${repo} base:main merged:>="${new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}"`
        : `is:pr is:merged repo:${owner}/${repo}`;

      // Use search API for PRs
      const { data: searchResult } = await octokit.rest.search.issuesAndPullRequests({
        q: prQuery,
        sort: 'updated',
        order: 'desc',
        per_page: Math.min(config.maxCommits, 100),
      });

      prs = searchResult.items || [];
      commits = prs.map(pr => ({
        sha: pr.merge_commit_sha || '',
        message: pr.title || '',
        author: pr.user || {},
        url: pr.html_url,
        _pr: pr.number,
      }));
    } catch (err) {
      logger.warn(`PR collection failed, falling back to commits: ${err.message}`);
      usePRs = false;
    }
  }

  if (!usePRs) {
    // Collect commits between versions
    try {
      if (previousVersion) {
        await rateLimiter.wait();
        const { data: compareData } = await octokit.rest.repos.compareCommits({
          owner,
          repo,
          base: `v${previousVersion}`,
          head: `v${currentVersion}`,
        });
        commits = (compareData.commits || []).slice(0, config.maxCommits);
      } else {
        // No previous version — get recent commits
        await rateLimiter.wait();
        const { data: commitList } = await octokit.rest.repos.listCommits({
          owner,
          repo,
          per_page: Math.min(config.maxCommits, 100),
        });
        commits = commitList;
      }
    } catch (err) {
      logger.warn(`Commit collection failed: ${err.message}`);
      commits = [];
    }
  }

  // Handle no changes
  if (commits.length === 0 && prs.length === 0) {
    logger.info('No changes found between versions');
  }

  return { commits, prs };
}

module.exports = { generate, determineVersion, determinePreviousVersion, collectChanges };
