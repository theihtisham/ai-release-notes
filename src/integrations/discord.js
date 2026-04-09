'use strict';

const logger = require('../logger');

/**
 * Post release notes to Discord via webhook.
 * @param {string} webhookUrl - Discord webhook URL
 * @param {Object} releaseData - { version, notes, summary, url, contributors }
 * @returns {Object} { success, message }
 */
async function postToDiscord(webhookUrl, releaseData) {
  try {
    if (!webhookUrl) {
      logger.debug('No Discord webhook provided — skipping');
      return { success: false, message: 'No webhook URL' };
    }

    const { version, summary, url, contributors } = releaseData;
    const topChanges = extractTopChangesDiscord(releaseData.notes, 5);

    const fields = [
      {
        name: 'Version',
        value: `v${version}`,
        inline: true,
      },
      {
        name: 'Date',
        value: new Date().toISOString().split('T')[0],
        inline: true,
      },
    ];

    if (contributors && contributors.length > 0) {
      fields.push({
        name: 'Contributors',
        value: contributors.slice(0, 5).map(c => `@${c.login}`).join(', ') +
          (contributors.length > 5 ? ` and ${contributors.length - 5} more` : ''),
        inline: false,
      });
    }

    let description = summary || `Version ${version} has been released!`;
    if (topChanges.length > 0) {
      description += '\n\n**Key Changes:**\n' + topChanges.map(c => `  - ${c}`).join('\n');
    }

    const embed = {
      title: `New Release: v${version}`,
      url: url || '',
      color: 0x00ff00, // Green
      description: description.substring(0, 2048), // Discord limit
      fields: fields,
      footer: {
        text: 'Powered by AI Release Notes',
      },
      timestamp: new Date().toISOString(),
    };

    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        embeds: [embed],
      }),
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Discord API returned ${response.status}: ${text}`);
    }

    logger.info('Discord notification sent successfully');
    return { success: true, message: 'Posted to Discord' };
  } catch (err) {
    logger.error('Failed to post to Discord', err);
    return { success: false, message: err.message };
  }
}

/**
 * Extract top N changes from release notes for Discord.
 */
function extractTopChangesDiscord(notes, count) {
  if (!notes) return [];

  const lines = notes.split('\n');
  const bullets = lines
    .filter(line => line.match(/^-\s+/))
    .map(line => line.replace(/^-\s+/, '').trim())
    .filter(line => line.length > 0 && line.length < 150);

  return bullets.slice(0, count);
}

module.exports = { postToDiscord };
