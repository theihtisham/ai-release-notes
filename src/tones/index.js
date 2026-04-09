'use strict';

const { TONES, isValidTone } = require('./types');
const { ProfessionalTone } = require('./professional');
const { CasualTone } = require('./casual');
const { HumorousTone } = require('./humorous');
const { TechnicalTone } = require('./technical');

/**
 * Tone factory. Returns the appropriate tone adapter for a given tone name.
 * @param {string} tone - Tone identifier ('professional', 'casual', 'humorous', 'technical')
 * @returns {Object} Tone adapter instance with name and apply() method
 * @throws {Error} If tone is not recognized
 */
function getTone(tone) {
  switch (tone) {
    case 'professional':
      return new ProfessionalTone();
    case 'casual':
      return new CasualTone();
    case 'humorous':
      return new HumorousTone();
    case 'technical':
      return new TechnicalTone();
    default:
      throw new Error(`Unknown tone: "${tone}". Valid tones: ${TONES.join(', ')}`);
  }
}

module.exports = {
  getTone,
  TONES,
  isValidTone,
  ProfessionalTone,
  CasualTone,
  HumorousTone,
  TechnicalTone,
};
