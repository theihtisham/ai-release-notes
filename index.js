'use strict';

const core = require('@actions/core');
const logger = require('./src/logger');
const { createConfig } = require('./src/config');
const { generate } = require('./src/generator');

/**
 * Entry point for the GitHub Action.
 */
async function run() {
  try {
    logger.info('AI Release Notes action started');

    // Collect all inputs
    const inputs = {
      'github-token': core.getInput('github-token', { required: true }),
      'api-key': core.getInput('api-key') || '',
      'api-base': core.getInput('api-base') || 'https://api.openai.com/v1',
      model: core.getInput('model') || 'gpt-4o-mini',
      template: core.getInput('template') || 'default',
      'commit-mode': core.getInput('commit-mode') || 'auto',
      'version-from': core.getInput('version-from') || 'tag',
      version: core.getInput('version') || '',
      'previous-tag': core.getInput('previous-tag') || '',
      'include-breaking': core.getInput('include-breaking') || 'true',
      'include-contributors': core.getInput('include-contributors') || 'true',
      'include-diff-stats': core.getInput('include-diff-stats') || 'true',
      'include-screenshots': core.getInput('include-screenshots') || 'true',
      categories: core.getInput('categories') || 'auto',
      'max-commits': core.getInput('max-commits') || '200',
      language: core.getInput('language') || 'en',
      'dry-run': core.getInput('dry-run') || 'false',
      'slack-webhook': core.getInput('slack-webhook') || '',
      'discord-webhook': core.getInput('discord-webhook') || '',
      'twitter-consumer-key': core.getInput('twitter-consumer-key') || '',
      'twitter-consumer-secret': core.getInput('twitter-consumer-secret') || '',
      'twitter-access-token': core.getInput('twitter-access-token') || '',
      'twitter-access-secret': core.getInput('twitter-access-secret') || '',
      'update-changelog': core.getInput('update-changelog') || 'false',
      'changelog-path': core.getInput('changelog-path') || 'CHANGELOG.md',
    };

    // Create validated config
    const config = createConfig(inputs);

    // Run the generator
    const result = await generate(config);

    // Set outputs
    core.setOutput('release-notes', result.notes);
    core.setOutput('release-url', result.url || '');
    core.setOutput('version', result.version || '');
    core.setOutput('summary', result.summary || '');

    // Also set the release notes as the job summary
    if (result.notes) {
      await core.summary.addRaw(result.notes).write();
    }

    logger.info('AI Release Notes action completed successfully');
  } catch (err) {
    logger.error('Action failed', err);
    core.setFailed(`AI Release Notes failed: ${err.message}`);
  }
}

// Run if called directly (not in test)
if (require.main === module) {
  run();
}

module.exports = { run };
