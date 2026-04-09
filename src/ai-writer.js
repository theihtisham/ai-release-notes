'use strict';

const logger = require('./logger');
const { getSystemPrompt, getUserPrompt } = require('./prompts');

/**
 * Generate release notes using AI (OpenAI-compatible API).
 * Falls back to template-based generation if AI fails or no API key.
 *
 * @param {Object} analysis - Commit analysis results
 * @param {Object} diffSummary - Diff analysis results
 * @param {string} version - Current version
 * @param {Object} config - Configuration object
 * @returns {string} Generated release notes markdown
 */
async function generateReleaseNotes(analysis, diffSummary, version, config) {
  if (!config.hasAI || !config.apiKey) {
    logger.info('No API key provided — using template-based generation');
    return null;
  }

  try {
    logger.info(`Generating AI release notes with model ${config.model}`);

    // Use dynamic import for OpenAI (ESM module)
    let openaiModule;
    try {
      openaiModule = await import('openai');
    } catch (importErr) {
      logger.warn(`Failed to import OpenAI module: ${importErr.message}`);
      return null;
    }

    const OpenAI = openaiModule.default || openaiModule.OpenAI;

    const client = new OpenAI({
      apiKey: config.apiKey,
      baseURL: config.apiBase,
    });

    const systemPrompt = getSystemPrompt(config);
    const userPrompt = getUserPrompt(analysis, diffSummary, version, config);

    logger.debug('Sending request to AI API...');

    const response = await client.chat.completions.create({
      model: config.model,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.3,
      max_tokens: 4000,
    });

    if (!response || !response.choices || response.choices.length === 0) {
      logger.warn('AI returned empty response — falling back to template');
      return null;
    }

    const content = response.choices[0].message.content;

    if (!content || content.trim().length === 0) {
      logger.warn('AI returned empty content — falling back to template');
      return null;
    }

    // Validate: must be valid markdown with some content
    if (!validateAIResponse(content)) {
      logger.warn('AI response validation failed — falling back to template');
      return null;
    }

    logger.info('AI release notes generated successfully');
    return content;
  } catch (err) {
    logger.error('AI generation failed — falling back to template', err);
    return null;
  }
}

/**
 * Validate AI response content.
 * Checks that the response is non-empty markdown with at least one section.
 */
function validateAIResponse(content) {
  if (!content || typeof content !== 'string') {
    return false;
  }

  // Must have at least 50 characters of content
  if (content.trim().length < 50) {
    return false;
  }

  // Must contain at least one markdown element (header, bullet, or link)
  const hasMarkdown = /(^#{1,6}\s|^- |\*\s|[^!]\[.*\]\(.*\))/.test(content);
  if (!hasMarkdown) {
    return false;
  }

  return true;
}

module.exports = {
  generateReleaseNotes,
  validateAIResponse,
};
