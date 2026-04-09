'use strict';

const logger = require('../logger');

/**
 * Post a release tweet via Twitter API v2.
 * @param {Object} credentials - { consumerKey, consumerSecret, accessToken, accessSecret }
 * @param {Object} releaseData - { version, summary, url, notes }
 * @returns {Object} { success, message, tweetUrl }
 */
async function postTweet(credentials, releaseData) {
  try {
    if (!credentials || !credentials.consumerKey) {
      logger.debug('No Twitter credentials provided — skipping');
      return { success: false, message: 'No credentials' };
    }

    const { version, summary, url } = releaseData;

    // Generate tweet text
    const tweetText = generateTweetText(version, summary, releaseData.notes, url);

    logger.info(`Posting tweet (${tweetText.length} chars): ${tweetText.substring(0, 50)}...`);

    // Use twitter-api-v2 with OAuth 1.0a
    const { TwitterApi } = require('twitter-api-v2');

    const client = new TwitterApi({
      appKey: credentials.consumerKey,
      appSecret: credentials.consumerSecret,
      accessToken: credentials.accessToken,
      accessSecret: credentials.accessSecret,
    });

    const tweetClient = client.readWrite;

    const result = await tweetClient.v2.tweet(tweetText);

    const tweetId = result.data.id;
    const tweetUrl = `https://twitter.com/i/status/${tweetId}`;

    logger.info(`Tweet posted: ${tweetUrl}`);
    return { success: true, message: 'Tweet posted', tweetUrl };
  } catch (err) {
    logger.error('Failed to post tweet', err);
    return { success: false, message: err.message };
  }
}

/**
 * Generate tweet text within 280 character limit.
 */
function generateTweetText(version, summary, notes, url) {
  const topFeature = extractTopFeature(notes);
  const topFix = extractTopFix(notes);

  let text = `v${version} is here!`;

  if (summary && summary.length < 100) {
    text = `v${version} is here! ${summary}`;
  }

  // Add top feature and fix
  const extras = [];
  if (topFeature) extras.push(`Feature: ${topFeature}`);
  if (topFix) extras.push(`Fix: ${topFix}`);

  if (extras.length > 0) {
    const extraText = extras.join(' | ');
    const withoutUrl = `${text}\n\n${extraText}\n\n#changelog #release`;
    if (url && withoutUrl.length + url.length + 2 <= 280) {
      return `${withoutUrl}\n${url}`;
    }
    if (withoutUrl.length <= 280) {
      return withoutUrl;
    }
  }

  // Simplified: just version, short summary, and link
  const base = `v${version} released! `;
  const hashtags = '#changelog #release';

  if (url) {
    const available = 280 - base.length - url.length - hashtags.length - 6;
    const shortSummary = summary ? summary.substring(0, Math.max(0, available)) : '';
    return `${base}${shortSummary}\n${url}\n\n${hashtags}`;
  }

  return `${base}${hashtags}`;
}

/**
 * Extract top feature description from notes.
 */
function extractTopFeature(notes) {
  if (!notes) return null;

  const lines = notes.split('\n');
  for (const line of lines) {
    const cleaned = line.replace(/^[-*]\s+/, '').trim();
    if (cleaned.length > 10 && cleaned.length < 80) {
      return cleaned;
    }
  }
  return null;
}

/**
 * Extract top fix description from notes.
 */
function extractTopFix(notes) {
  if (!notes) return null;

  const lines = notes.split('\n');
  const fixes = lines.filter(
    l => l.toLowerCase().includes('fix') || l.toLowerCase().includes('bug')
  );

  for (const line of fixes) {
    const cleaned = line.replace(/^[-*]\s+/, '').trim();
    if (cleaned.length > 10 && cleaned.length < 80) {
      return cleaned;
    }
  }
  return null;
}

module.exports = { postTweet, generateTweetText };
