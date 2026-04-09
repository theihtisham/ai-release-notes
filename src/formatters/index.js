'use strict';

const { OUTPUT_FORMATS, isValidFormat } = require('./types');
const { MarkdownFormatter } = require('./markdown');
const { HTMLFormatter } = require('./html');
const { SlackFormatter } = require('./slack');
const { DiscordFormatter } = require('./discord');
const { TwitterFormatter } = require('./twitter');

/**
 * Formatter factory. Returns the appropriate formatter for a given output format.
 * @param {string} format - Output format identifier ('markdown', 'html', 'slack', 'discord', 'twitter')
 * @returns {Object} Formatter instance with name, format, and format() method
 * @throws {Error} If format is not recognized
 */
function getFormatter(format) {
  switch (format) {
    case 'markdown':
      return new MarkdownFormatter();
    case 'html':
      return new HTMLFormatter();
    case 'slack':
      return new SlackFormatter();
    case 'discord':
      return new DiscordFormatter();
    case 'twitter':
      return new TwitterFormatter();
    default:
      throw new Error(`Unknown output format: "${format}". Valid formats: ${OUTPUT_FORMATS.join(', ')}`);
  }
}

module.exports = {
  getFormatter,
  OUTPUT_FORMATS,
  isValidFormat,
  MarkdownFormatter,
  HTMLFormatter,
  SlackFormatter,
  DiscordFormatter,
  TwitterFormatter,
};
