'use strict';

/**
 * @typedef {'professional'|'casual'|'humorous'|'technical'} Tone
 * Supported tone types for release notes.
 */

/**
 * List of all supported tones.
 * @type {Tone[]}
 */
const TONES = ['professional', 'casual', 'humorous', 'technical'];

/**
 * Check if a tone string is valid.
 * @param {string} tone
 * @returns {boolean}
 */
function isValidTone(tone) {
  return TONES.includes(tone);
}

module.exports = {
  TONES,
  isValidTone,
};
