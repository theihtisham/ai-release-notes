'use strict';

const logger = require('./logger');

/**
 * Simple rate limiter for API calls.
 * Tracks calls per time window and enforces delays when approaching limits.
 */
class RateLimiter {
  constructor(options = {}) {
    this.maxRequests = options.maxRequests || 60;
    this.windowMs = options.windowMs || 60 * 1000; // 1 minute
    this.minDelay = options.minDelay || 100; // 100ms between calls
    this.calls = [];
  }

  /**
   * Wait before making the next API call if needed.
   * Call this before each API request.
   */
  async wait() {
    const now = Date.now();

    // Clean up old calls outside the window
    this.calls = this.calls.filter(time => now - time < this.windowMs);

    // If at limit, wait until oldest call expires
    if (this.calls.length >= this.maxRequests) {
      const oldestCall = this.calls[0];
      const waitTime = this.windowMs - (now - oldestCall) + 100;
      if (waitTime > 0) {
        logger.debug(`Rate limit approaching — waiting ${waitTime}ms`);
        await this.sleep(waitTime);
      }
      // Clean again after waiting
      this.calls = this.calls.filter(time => Date.now() - time < this.windowMs);
    }

    // Enforce minimum delay between calls
    if (this.calls.length > 0) {
      const lastCall = this.calls[this.calls.length - 1];
      const elapsed = Date.now() - lastCall;
      if (elapsed < this.minDelay) {
        await this.sleep(this.minDelay - elapsed);
      }
    }

    // Record this call
    this.calls.push(Date.now());
  }

  /**
   * Get the number of calls made in the current window.
   */
  getCallCount() {
    const now = Date.now();
    this.calls = this.calls.filter(time => now - time < this.windowMs);
    return this.calls.length;
  }

  /**
   * Reset the rate limiter.
   */
  reset() {
    this.calls = [];
  }

  /**
   * Sleep for a given number of milliseconds.
   */
  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

/**
 * Create a rate limiter configured for GitHub API.
 * GitHub allows ~60 requests per minute for unauthenticated,
 * and ~5000 per hour for authenticated (but we conservatively limit per minute).
 */
function createGitHubRateLimiter() {
  return new RateLimiter({
    maxRequests: 60,
    windowMs: 60 * 1000,
    minDelay: 100,
  });
}

module.exports = {
  RateLimiter,
  createGitHubRateLimiter,
};
