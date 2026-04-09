'use strict';

const {
  getFormatter,
  OUTPUT_FORMATS,
  isValidFormat,
  MarkdownFormatter,
  HTMLFormatter,
  SlackFormatter,
  DiscordFormatter,
  TwitterFormatter,
} = require('../src/formatters');

/**
 * Create sample release data for testing.
 */
function createSampleData(overrides = {}) {
  return {
    version: '2.1.0',
    previousVersion: '2.0.0',
    date: '2025-01-15',
    summary: 'Release v2.1.0 brings 3 features, 2 bug fixes, and 1 breaking change.',
    categories: {
      '🚀 Features': [
        { description: 'Added user avatar upload API', type: 'feat', scope: 'api', pr: 42, author: 'alice', breaking: false },
        { description: 'Added dark mode toggle', type: 'feat', scope: 'ui', pr: 43, author: 'bob', breaking: false },
        { description: 'Added pagination to list endpoints', type: 'feat', scope: 'api', pr: 44, author: 'charlie', breaking: false },
      ],
      '🐛 Bug Fixes': [
        { description: 'Fixed login timeout on slow connections', type: 'fix', scope: 'auth', pr: 45, author: 'dave', breaking: false },
        { description: 'Fixed memory leak in event listeners', type: 'fix', scope: 'core', pr: 46, author: 'eve', breaking: false },
      ],
    },
    breaking: [
      { description: 'Removed deprecated /api/v1/users endpoint', scope: 'api', type: 'feat', pr: 40, migration_guide: 'Use /api/v2/users instead' },
    ],
    contributors: [
      { login: 'alice', name: 'Alice', commits_count: 3, is_first_time: false },
      { login: 'bob', name: 'Bob', commits_count: 2, is_first_time: true },
      { login: 'charlie', name: 'Charlie', commits_count: 1, is_first_time: false },
    ],
    diffSummary: {
      files_changed: 12,
      files_added: 3,
      files_modified: 7,
      files_deleted: 2,
      additions: 450,
      deletions: 120,
      impact: 'medium',
      affected_areas: ['API', 'UI'],
      potential_breaking: [],
    },
    repoUrl: 'https://github.com/acme/app',
    repoFullName: 'acme/app',
    linkedIssues: [{ number: 100 }, { number: 101 }],
    ...overrides,
  };
}

describe('formatters', () => {
  describe('formatter factory', () => {
    test('getFormatter returns MarkdownFormatter for markdown', () => {
      const f = getFormatter('markdown');
      expect(f).toBeInstanceOf(MarkdownFormatter);
      expect(f.name).toBe('Markdown');
    });

    test('getFormatter returns HTMLFormatter for html', () => {
      const f = getFormatter('html');
      expect(f).toBeInstanceOf(HTMLFormatter);
      expect(f.name).toBe('HTML');
    });

    test('getFormatter returns SlackFormatter for slack', () => {
      const f = getFormatter('slack');
      expect(f).toBeInstanceOf(SlackFormatter);
      expect(f.name).toBe('Slack');
    });

    test('getFormatter returns DiscordFormatter for discord', () => {
      const f = getFormatter('discord');
      expect(f).toBeInstanceOf(DiscordFormatter);
      expect(f.name).toBe('Discord');
    });

    test('getFormatter returns TwitterFormatter for twitter', () => {
      const f = getFormatter('twitter');
      expect(f).toBeInstanceOf(TwitterFormatter);
      expect(f.name).toBe('Twitter');
    });

    test('getFormatter throws for unknown format', () => {
      expect(() => getFormatter('pdf')).toThrow('Unknown output format');
    });

    test('OUTPUT_FORMATS contains all formats', () => {
      expect(OUTPUT_FORMATS).toEqual(['markdown', 'html', 'slack', 'discord', 'twitter']);
    });

    test('isValidFormat validates correctly', () => {
      expect(isValidFormat('markdown')).toBe(true);
      expect(isValidFormat('html')).toBe(true);
      expect(isValidFormat('pdf')).toBe(false);
      expect(isValidFormat('')).toBe(false);
    });
  });

  describe('MarkdownFormatter', () => {
    test('formats basic release data', () => {
      const data = createSampleData();
      const formatter = new MarkdownFormatter();
      const result = formatter.format(data);

      expect(result).toContain("What's Changed in v2.1.0");
      expect(result).toContain('Breaking Changes');
      expect(result).toContain('Added user avatar upload API');
      expect(result).toContain('Fixed login timeout');
      expect(result).toContain('@alice');
      expect(result).toContain('Full Changelog');
    });

    test('includes collapsible sections', () => {
      const data = createSampleData();
      const formatter = new MarkdownFormatter();
      const result = formatter.format(data);

      expect(result).toContain('<details>');
      expect(result).toContain('</details>');
    });

    test('handles empty categories', () => {
      const data = createSampleData({ categories: {}, breaking: [], contributors: [] });
      const formatter = new MarkdownFormatter();
      const result = formatter.format(data);

      expect(result).toContain('v2.1.0');
      expect(typeof result).toBe('string');
    });

    test('includes PR links', () => {
      const data = createSampleData();
      const formatter = new MarkdownFormatter();
      const result = formatter.format(data);

      expect(result).toContain('acme/app/pull/42');
    });

    test('includes first-time contributor badge', () => {
      const data = createSampleData();
      const formatter = new MarkdownFormatter();
      const result = formatter.format(data);

      expect(result).toContain(':tada:');
    });
  });

  describe('HTMLFormatter', () => {
    test('produces valid HTML', () => {
      const data = createSampleData();
      const formatter = new HTMLFormatter();
      const result = formatter.format(data);

      expect(result).toContain('<!DOCTYPE html>');
      expect(result).toContain('<html');
      expect(result).toContain('</html>');
      expect(result).toContain('<style>');
    });

    test('color-codes sections', () => {
      const data = createSampleData();
      const formatter = new HTMLFormatter();
      const result = formatter.format(data);

      expect(result).toContain('features');
      expect(result).toContain('fixes');
      expect(result).toContain('breaking');
    });

    test('escapes HTML in descriptions', () => {
      const data = createSampleData({
        categories: { '🚀 Features': [{ description: 'Added <script>alert("xss")</script>', type: 'feat' }] },
      });
      const formatter = new HTMLFormatter();
      const result = formatter.format(data);

      expect(result).not.toContain('<script>');
      expect(result).toContain('&lt;script&gt;');
    });

    test('includes contributors with first-timer badge', () => {
      const data = createSampleData();
      const formatter = new HTMLFormatter();
      const result = formatter.format(data);

      expect(result).toContain('@bob');
      expect(result).toContain('FIRST TIME');
    });

    test('handles empty data gracefully', () => {
      const data = createSampleData({ categories: {}, breaking: [], contributors: [] });
      const formatter = new HTMLFormatter();
      const result = formatter.format(data);

      expect(result).toContain('v2.1.0');
      expect(result).toContain('</html>');
    });
  });

  describe('SlackFormatter', () => {
    test('produces valid Slack Block Kit JSON', () => {
      const data = createSampleData();
      const formatter = new SlackFormatter();
      const result = formatter.format(data);

      const parsed = JSON.parse(result);
      expect(parsed.blocks).toBeDefined();
      expect(Array.isArray(parsed.blocks)).toBe(true);
      expect(parsed.blocks.length).toBeGreaterThan(0);
    });

    test('includes header block', () => {
      const data = createSampleData();
      const formatter = new SlackFormatter();
      const result = formatter.format(data);

      const parsed = JSON.parse(result);
      const header = parsed.blocks.find(b => b.type === 'header');
      expect(header).toBeDefined();
      expect(header.text.text).toContain('v2.1.0');
    });

    test('includes breaking changes section', () => {
      const data = createSampleData();
      const formatter = new SlackFormatter();
      const result = formatter.format(data);

      const parsed = JSON.parse(result);
      const breakingBlock = parsed.blocks.find(b =>
        b.text && b.text.text && b.text.text.includes('Breaking Changes')
      );
      expect(breakingBlock).toBeDefined();
    });

    test('includes action buttons', () => {
      const data = createSampleData();
      const formatter = new SlackFormatter();
      const result = formatter.format(data);

      const parsed = JSON.parse(result);
      const actions = parsed.blocks.find(b => b.type === 'actions');
      expect(actions).toBeDefined();
      expect(actions.elements.length).toBeGreaterThan(0);
    });

    test('escapes special characters', () => {
      const data = createSampleData({
        summary: 'Release <v2.1.0> & "new features"',
      });
      const formatter = new SlackFormatter();
      const result = formatter.format(data);

      const parsed = JSON.parse(result);
      const summaryBlock = parsed.blocks.find(b => b.type === 'section');
      expect(summaryBlock.text.text).toContain('&lt;');
      expect(summaryBlock.text.text).toContain('&amp;');
    });
  });

  describe('DiscordFormatter', () => {
    test('produces valid Discord webhook JSON', () => {
      const data = createSampleData();
      const formatter = new DiscordFormatter();
      const result = formatter.format(data);

      const parsed = JSON.parse(result);
      expect(parsed.embeds).toBeDefined();
      expect(Array.isArray(parsed.embeds)).toBe(true);
      expect(parsed.embeds.length).toBeGreaterThan(0);
      expect(parsed.username).toBe('Release Notes');
    });

    test('main embed has correct color for breaking changes', () => {
      const data = createSampleData();
      const formatter = new DiscordFormatter();
      const result = formatter.format(data);

      const parsed = JSON.parse(result);
      // Red for breaking changes
      expect(parsed.embeds[0].color).toBe(0xED4245);
    });

    test('main embed is green for features only', () => {
      const data = createSampleData({ breaking: [] });
      const formatter = new DiscordFormatter();
      const result = formatter.format(data);

      const parsed = JSON.parse(result);
      expect(parsed.embeds[0].color).toBe(0x57F287);
    });

    test('includes contributor embed', () => {
      const data = createSampleData();
      const formatter = new DiscordFormatter();
      const result = formatter.format(data);

      const parsed = JSON.parse(result);
      const contributorEmbed = parsed.embeds.find(e =>
        e.title && e.title.includes('Contributors')
      );
      expect(contributorEmbed).toBeDefined();
    });

    test('respects Discord embed limit (max 10)', () => {
      const categories = {};
      for (let i = 0; i < 15; i++) {
        categories[`Category ${i}`] = [{ description: `Change ${i}`, type: 'feat' }];
      }
      const data = createSampleData({ categories });
      const formatter = new DiscordFormatter();
      const result = formatter.format(data);

      const parsed = JSON.parse(result);
      expect(parsed.embeds.length).toBeLessThanOrEqual(10);
    });
  });

  describe('TwitterFormatter', () => {
    test('produces valid tweet thread JSON', () => {
      const data = createSampleData();
      const formatter = new TwitterFormatter();
      const result = formatter.format(data);

      const tweets = JSON.parse(result);
      expect(Array.isArray(tweets)).toBe(true);
      expect(tweets.length).toBeGreaterThan(0);
    });

    test('each tweet is within 280 characters', () => {
      const data = createSampleData();
      const formatter = new TwitterFormatter();
      const result = formatter.format(data);

      const tweets = JSON.parse(result);
      for (const tweet of tweets) {
        expect(tweet.length).toBeLessThanOrEqual(280);
      }
    });

    test('tweets are numbered', () => {
      const data = createSampleData();
      const formatter = new TwitterFormatter();
      const result = formatter.format(data);

      const tweets = JSON.parse(result);
      for (let i = 0; i < tweets.length; i++) {
        expect(tweets[i]).toMatch(new RegExp(`^${i + 1}/${tweets.length}`));
      }
    });

    test('first tweet announces the version', () => {
      const data = createSampleData();
      const formatter = new TwitterFormatter();
      const result = formatter.format(data);

      const tweets = JSON.parse(result);
      expect(tweets[0]).toContain('v2.1.0');
    });

    test('includes hashtags', () => {
      const data = createSampleData();
      const formatter = new TwitterFormatter();
      const result = formatter.format(data);

      const tweets = JSON.parse(result);
      const lastTweet = tweets[tweets.length - 1];
      expect(lastTweet).toContain('#Release');
      expect(lastTweet).toContain('#Changelog');
    });

    test('handles minimal data gracefully', () => {
      const data = createSampleData({
        categories: {},
        breaking: [],
        contributors: [],
        summary: '',
      });
      const formatter = new TwitterFormatter();
      const result = formatter.format(data);

      const tweets = JSON.parse(result);
      expect(tweets.length).toBeGreaterThan(0);
    });
  });
});
