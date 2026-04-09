'use strict';

const fs = require('fs');
const path = require('path');
const {
  DEFAULTS,
  DEFAULT_CATEGORIES,
  BUILT_IN_TEMPLATES,
  VALID_COMMIT_MODES,
  VALID_VERSION_SOURCES,
  VALID_LANGUAGES,
} = require('./constants');
const logger = require('./logger');

class ConfigError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ConfigError';
  }
}

function createConfig(inputs) {
  const errors = [];

  // Required: github-token
  if (!inputs['github-token'] || inputs['github-token'].trim() === '') {
    errors.push('github-token is required and cannot be empty');
  }

  // Validate template
  const template = inputs.template || DEFAULTS.TEMPLATE;
  if (!BUILT_IN_TEMPLATES.includes(template)) {
    const templatePath = path.resolve(template);
    if (!fs.existsSync(templatePath)) {
      errors.push(
        `Invalid template "${template}". Must be one of: ${BUILT_IN_TEMPLATES.join(', ')}, or a valid file path to a custom template.`
      );
    }
  }

  // Validate commit-mode
  const commitMode = inputs['commit-mode'] || DEFAULTS.COMMIT_MODE;
  if (!VALID_COMMIT_MODES.includes(commitMode)) {
    errors.push(
      `Invalid commit-mode "${commitMode}". Must be one of: ${VALID_COMMIT_MODES.join(', ')}`
    );
  }

  // Validate version-from
  const versionFrom = inputs['version-from'] || DEFAULTS.VERSION_FROM;
  if (!VALID_VERSION_SOURCES.includes(versionFrom)) {
    errors.push(
      `Invalid version-from "${versionFrom}". Must be one of: ${VALID_VERSION_SOURCES.join(', ')}`
    );
  }

  // Validate version is provided when version-from is manual
  if (versionFrom === 'manual' && (!inputs.version || inputs.version.trim() === '')) {
    errors.push('version is required when version-from is "manual"');
  }

  // Validate language
  const language = inputs.language || DEFAULTS.LANGUAGE;
  if (!VALID_LANGUAGES.includes(language)) {
    errors.push(
      `Invalid language "${language}". Must be one of: ${VALID_LANGUAGES.join(', ')}`
    );
  }

  // Validate max-commits
  const maxCommits = parseInt(inputs['max-commits'] || String(DEFAULTS.MAX_COMMITS), 10);
  if (isNaN(maxCommits) || maxCommits < 1 || maxCommits > 1000) {
    errors.push('max-commits must be a number between 1 and 1000');
  }

  // Validate custom categories
  let categories = DEFAULT_CATEGORIES;
  const categoriesInput = inputs.categories;
  if (categoriesInput && categoriesInput !== 'auto') {
    try {
      const parsed = JSON.parse(categoriesInput);
      if (!Array.isArray(parsed)) {
        errors.push('categories must be a JSON array');
      } else {
        for (const cat of parsed) {
          if (!cat.label || typeof cat.label !== 'string') {
            errors.push('Each category must have a "label" string property');
            break;
          }
          if (!Array.isArray(cat.patterns) || cat.patterns.length === 0) {
            errors.push('Each category must have a "patterns" array with at least one pattern');
            break;
          }
        }
        if (errors.length === 0 || !errors.some(e => e.includes('categories'))) {
          categories = parsed;
        }
      }
    } catch (e) {
      errors.push(`Invalid categories JSON: ${e.message}`);
    }
  }

  // Validate Twitter credentials — if any provided, all four are required
  const twitterKeys = [
    inputs['twitter-consumer-key'],
    inputs['twitter-consumer-secret'],
    inputs['twitter-access-token'],
    inputs['twitter-access-secret'],
  ];
  const providedTwitterKeys = twitterKeys.filter(k => k && k.trim() !== '');
  if (providedTwitterKeys.length > 0 && providedTwitterKeys.length < 4) {
    errors.push(
      'If any Twitter credential is provided, all four are required: twitter-consumer-key, twitter-consumer-secret, twitter-access-token, twitter-access-secret'
    );
  }

  if (errors.length > 0) {
    throw new ConfigError('Configuration errors:\n' + errors.map(e => `  - ${e}`).join('\n'));
  }

  const config = {
    githubToken: inputs['github-token'],
    apiKey: inputs['api-key'] || '',
    apiBase: inputs['api-base'] || 'https://api.openai.com/v1',
    model: inputs.model || 'gpt-4o-mini',
    template: template,
    commitMode: commitMode,
    versionFrom: versionFrom,
    version: inputs.version || '',
    previousTag: inputs['previous-tag'] || '',
    includeBreaking: (inputs['include-breaking'] || 'true') === 'true',
    includeContributors: (inputs['include-contributors'] || 'true') === 'true',
    includeDiffStats: (inputs['include-diff-stats'] || 'true') === 'true',
    includeScreenshots: (inputs['include-screenshots'] || 'true') === 'true',
    categories: categories,
    maxCommits: maxCommits,
    language: language,
    dryRun: (inputs['dry-run'] || 'false') === 'true',
    // Integrations
    slackWebhook: inputs['slack-webhook'] || '',
    discordWebhook: inputs['discord-webhook'] || '',
    twitterConsumerKey: inputs['twitter-consumer-key'] || '',
    twitterConsumerSecret: inputs['twitter-consumer-secret'] || '',
    twitterAccessToken: inputs['twitter-access-token'] || '',
    twitterAccessSecret: inputs['twitter-access-secret'] || '',
    // Changelog
    updateChangelog: (inputs['update-changelog'] || 'false') === 'true',
    changelogPath: inputs['changelog-path'] || 'CHANGELOG.md',
    // Derived
    hasTwitter: providedTwitterKeys.length === 4,
    hasSlack: !!(inputs['slack-webhook'] && inputs['slack-webhook'].trim()),
    hasDiscord: !!(inputs['discord-webhook'] && inputs['discord-webhook'].trim()),
    hasAI: !!(inputs['api-key'] && inputs['api-key'].trim()),
  };

  logger.info(`Configuration loaded: template=${config.template}, mode=${config.commitMode}, version-from=${config.versionFrom}, language=${config.language}, ai=${config.hasAI}`);

  return Object.freeze(config);
}

module.exports = { createConfig, ConfigError };
