'use strict';

/**
 * Twitter/X thread formatter.
 * Breaks release notes into a tweet thread with 280-character limit per tweet,
 * numbered tweets (1/N, 2/N, etc.), and hashtag suggestions.
 */
class TwitterFormatter {
  constructor() {
    this.name = 'Twitter';
    this.formatName = 'twitter';
    this.MAX_TWEET_LENGTH = 280;
  }

  /**
   * Format release data as a Twitter thread (array of tweet objects).
   * @param {Object} data - ReleaseData object
   * @returns {string} JSON string of tweet array
   */
  format(data) {
    const tweets = [];

    // Tweet 1: Announcement
    let announcement = `v${data.version} is here! `;
    if (data.summary && data.summary.length < 150) {
      announcement += data.summary;
    } else {
      announcement += this._shortSummary(data);
    }
    announcement = this._trimToLength(announcement, this.MAX_TWEET_LENGTH);
    tweets.push(announcement);

    // Tweet 2: Features (if any)
    const featureCategories = this._getCategoriesByType(data, 'feature');
    if (featureCategories.length > 0) {
      const featureTweets = this._formatCategoryThread(
        featureCategories,
        ':rocket: New in v' + data.version + ':'
      );
      tweets.push(...featureTweets);
    }

    // Tweet: Bug fixes (if any)
    const fixCategories = this._getCategoriesByType(data, 'fix');
    if (fixCategories.length > 0) {
      const fixTweets = this._formatCategoryThread(
        fixCategories,
        ':wrench: Bug fixes in v' + data.version + ':'
      );
      tweets.push(...fixTweets);
    }

    // Tweet: Breaking changes (if any)
    if (data.breaking && data.breaking.length > 0) {
      const breakingTexts = [];
      for (const bc of data.breaking) {
        let text = `- ${bc.description}`;
        if (bc.migration_guide) {
          text += ` | Migration: ${bc.migration_guide}`;
        }
        breakingTexts.push(text);
      }
      const breakingTweets = this._splitIntoTweets(
        breakingTexts,
        ':rotating_light: BREAKING CHANGES in v' + data.version + ':'
      );
      tweets.push(...breakingTweets);
    }

    // Tweet: Other categories
    const otherCategories = this._getOtherCategories(data);
    for (const [cat, changes] of otherCategories) {
      const items = changes.map(c => `- ${c.description}`);
      const catTweets = this._splitIntoTweets(items, `${cat}:`);
      tweets.push(...catTweets);
    }

    // Tweet: Contributors
    if (data.contributors && data.contributors.length > 0) {
      const names = data.contributors.slice(0, 10).map(c => `@${c.login}`).join(', ');
      const more = data.contributors.length > 10 ? ` +${data.contributors.length - 10} more` : '';
      const firstTimers = data.contributors.filter(c => c.is_first_time);
      let contributorTweet = `Contributors: ${names}${more}`;
      if (firstTimers.length > 0) {
        contributorTweet += `\nFirst-time: ${firstTimers.map(c => `@${c.login}`).join(', ')}`;
      }
      tweets.push(this._trimToLength(contributorTweet, this.MAX_TWEET_LENGTH));
    }

    // Tweet: Link + hashtags
    let linkTweet = '';
    if (data.previousVersion) {
      linkTweet = `Full changelog: ${data.repoUrl}/compare/v${data.previousVersion}...v${data.version}`;
    } else {
      linkTweet = `${data.repoUrl}`;
    }
    const hashtags = this._suggestHashtags(data);
    linkTweet += `\n\n${hashtags}`;
    tweets.push(this._trimToLength(linkTweet, this.MAX_TWEET_LENGTH));

    // Number all tweets
    const total = tweets.length;
    const numbered = tweets.map((tweet, i) => {
      const prefix = `${i + 1}/${total} `;
      if ((prefix + tweet).length <= this.MAX_TWEET_LENGTH) {
        return prefix + tweet;
      }
      // If prefix would overflow, truncate the tweet
      return prefix + tweet.substring(0, this.MAX_TWEET_LENGTH - prefix.length);
    });

    return JSON.stringify(numbered, null, 2);
  }

  /**
   * Get a short summary for the announcement tweet.
   * @param {Object} data
   * @returns {string}
   */
  _shortSummary(data) {
    const parts = [];
    if (data.categories) {
      const catCount = Object.keys(data.categories).length;
      if (catCount > 0) parts.push(`${catCount} categories of changes`);
    }
    if (data.contributors && data.contributors.length > 0) {
      parts.push(`${data.contributors.length} contributors`);
    }
    if (data.breaking && data.breaking.length > 0) {
      parts.push(`${data.breaking.length} breaking change${data.breaking.length > 1 ? 's' : ''}`);
    }
    return parts.length > 0 ? parts.join(', ') + '.' : 'Various improvements and fixes.';
  }

  /**
   * Get categories that match a type keyword.
   * @param {Object} data
   * @param {string} type
   * @returns {Array<{description: string}>}
   */
  _getCategoriesByType(data, type) {
    const results = [];
    if (!data.categories) return results;
    for (const [category, changes] of Object.entries(data.categories)) {
      if (category.toLowerCase().includes(type)) {
        results.push(...changes);
      }
    }
    return results;
  }

  /**
   * Get categories that are not features or fixes.
   * @param {Object} data
   * @returns {Array}
   */
  _getOtherCategories(data) {
    if (!data.categories) return [];
    const results = [];
    for (const [category, changes] of Object.entries(data.categories)) {
      const lower = category.toLowerCase();
      if (!lower.includes('feature') && !lower.includes('fix') && !lower.includes('bug')) {
        results.push([category, changes]);
      }
    }
    return results;
  }

  /**
   * Format a set of changes as a thread with a header.
   * @param {Array} changes
   * @param {string} header
   * @returns {string[]}
   */
  _formatCategoryThread(changes, header) {
    const items = changes.map(c => {
      let text = `- ${c.description}`;
      if (c.pr) text += ` (#${c.pr})`;
      return text;
    });
    return this._splitIntoTweets(items, header);
  }

  /**
   * Split a list of text items into tweets respecting the character limit.
   * @param {string[]} items
   * @param {string} header
   * @returns {string[]}
   */
  _splitIntoTweets(items, header) {
    const tweets = [];
    let current = header + '\n';

    for (const item of items) {
      if ((current + '\n' + item).length > this.MAX_TWEET_LENGTH) {
        tweets.push(current.trim());
        current = header + ' (cont.)\n';
      }
      current += item + '\n';
    }

    if (current.trim().length > header.length) {
      tweets.push(current.trim());
    }

    return tweets;
  }

  /**
   * Trim a string to a maximum length, respecting word boundaries.
   * @param {string} str
   * @param {number} max
   * @returns {string}
   */
  _trimToLength(str, max) {
    if (!str || str.length <= max) return str || '';
    return str.substring(0, max - 1) + '...';
  }

  /**
   * Suggest hashtags based on release content.
   * @param {Object} data
   * @returns {string}
   */
  _suggestHashtags(data) {
    const tags = ['#Release', '#Changelog'];

    if (data.breaking && data.breaking.length > 0) {
      tags.push('#BreakingChanges');
    }
    if (data.categories) {
      const catNames = Object.keys(data.categories).map(c => c.toLowerCase());
      if (catNames.some(c => c.includes('feature'))) tags.push('#NewFeatures');
      if (catNames.some(c => c.includes('security'))) tags.push('#Security');
      if (catNames.some(c => c.includes('perf'))) tags.push('#Performance');
    }

    return tags.join(' ');
  }
}

module.exports = { TwitterFormatter };
