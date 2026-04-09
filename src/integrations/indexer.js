'use strict';

const logger = require('../logger');
const { createRelease } = require('./github-release');
const { postToSlack } = require('./slack');
const { postToDiscord } = require('./discord');
const { postTweet } = require('./twitter');
const { updateChangelog } = require('./changelog');

/**
 * Route release data to all configured integrations.
 * Executes in parallel where possible.
 * Never fails the action — logs errors and continues.
 *
 * @param {Object} config - Configuration object
 * @param {Object} releaseData - { version, notes, summary, url, contributors }
 * @param {Object} octokit - Octokit instance (optional)
 * @param {Object} context - GitHub Actions context (optional)
 * @returns {Object} Results from each integration
 */
async function postToIntegrations(config, releaseData, octokit, context) {
  const results = {};

  logger.info('Posting to configured integrations...');

  // GitHub Release (always attempt if octokit/context available)
  if (octokit && context && !config.dryRun) {
    try {
      const releaseResult = await createRelease(
        octokit,
        context,
        releaseData.version,
        releaseData.notes,
        config
      );
      results.githubRelease = {
        success: true,
        url: releaseResult.url,
        created: releaseResult.created,
      };
      releaseData.url = releaseResult.url;
    } catch (err) {
      results.githubRelease = { success: false, message: err.message };
      logger.error('GitHub Release integration failed', err);
    }
  }

  // Run remaining integrations in parallel
  const parallelTasks = [];

  // Slack
  if (config.hasSlack && !config.dryRun) {
    parallelTasks.push(
      postToSlack(config.slackWebhook, releaseData)
        .then(result => { results.slack = result; })
        .catch(err => {
          results.slack = { success: false, message: err.message };
          logger.error('Slack integration failed', err);
        })
    );
  }

  // Discord
  if (config.hasDiscord && !config.dryRun) {
    parallelTasks.push(
      postToDiscord(config.discordWebhook, releaseData)
        .then(result => { results.discord = result; })
        .catch(err => {
          results.discord = { success: false, message: err.message };
          logger.error('Discord integration failed', err);
        })
    );
  }

  // Twitter
  if (config.hasTwitter && !config.dryRun) {
    parallelTasks.push(
      postTweet(
        {
          consumerKey: config.twitterConsumerKey,
          consumerSecret: config.twitterConsumerSecret,
          accessToken: config.twitterAccessToken,
          accessSecret: config.twitterAccessSecret,
        },
        releaseData
      )
        .then(result => { results.twitter = result; })
        .catch(err => {
          results.twitter = { success: false, message: err.message };
          logger.error('Twitter integration failed', err);
        })
    );
  }

  // Changelog
  if (config.updateChangelog && octokit && context && !config.dryRun) {
    parallelTasks.push(
      updateChangelog(octokit, context, config, releaseData.notes, releaseData.version)
        .then(result => { results.changelog = result; })
        .catch(err => {
          results.changelog = { success: false, message: err.message };
          logger.error('Changelog integration failed', err);
        })
    );
  }

  // Wait for all parallel tasks to complete
  await Promise.all(parallelTasks);

  // Log summary
  const summary = Object.entries(results)
    .map(([name, result]) => `${name}: ${result.success ? 'OK' : 'FAILED'}`)
    .join(', ');
  logger.info(`Integration results: ${summary || 'none configured'}`);

  return results;
}

module.exports = { postToIntegrations };
