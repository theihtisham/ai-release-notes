'use strict';

const logger = require('../logger');

/**
 * Post release notes to Slack via webhook.
 * @param {string} webhookUrl - Slack webhook URL
 * @param {Object} releaseData - { version, notes, summary, url, contributors }
 * @returns {Object} { success, message }
 */
async function postToSlack(webhookUrl, releaseData) {
  try {
    if (!webhookUrl) {
      logger.debug('No Slack webhook provided — skipping');
      return { success: false, message: 'No webhook URL' };
    }

    const { version, summary, url, contributors } = releaseData;
    const topChanges = extractTopChanges(releaseData.notes, 5);

    const blocks = [
      {
        type: 'header',
        text: {
          type: 'plain_text',
          text: `New Release: v${version}`,
          emoji: true,
        },
      },
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: summary || `Version ${version} has been released!`,
        },
      },
    ];

    if (topChanges.length > 0) {
      blocks.push({
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `*Key Changes:*\n${topChanges.map(c => `  - ${c}`).join('\n')}`,
        },
      });
    }

    if (url) {
      blocks.push({
        type: 'actions',
        elements: [
          {
            type: 'button',
            text: {
              type: 'plain_text',
              text: 'View Full Release Notes',
            },
            url: url,
          },
        ],
      });
    }

    if (contributors && contributors.length > 0) {
      const names = contributors.slice(0, 5).map(c => `@${c.login}`).join(', ');
      blocks.push({
        type: 'context',
        elements: [
          {
            type: 'mrkdwn',
            text: `Contributors: ${names}${contributors.length > 5 ? ` and ${contributors.length - 5} more` : ''}`,
          },
        ],
      });
    }

    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ blocks }),
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Slack API returned ${response.status}: ${text}`);
    }

    logger.info('Slack notification sent successfully');
    return { success: true, message: 'Posted to Slack' };
  } catch (err) {
    logger.error('Failed to post to Slack', err);
    return { success: false, message: err.message };
  }
}

/**
 * Extract top N changes from release notes markdown.
 */
function extractTopChanges(notes, count) {
  if (!notes) return [];

  const lines = notes.split('\n');
  const bullets = lines
    .filter(line => line.match(/^-\s+/))
    .map(line => line.replace(/^-\s+/, '').trim())
    .filter(line => line.length > 0 && line.length < 150);

  return bullets.slice(0, count);
}

module.exports = { postToSlack };
