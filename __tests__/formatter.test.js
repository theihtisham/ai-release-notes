'use strict';

const { formatReleaseNotes, generateSummary } = require('../src/formatter');

describe('formatter', () => {
  describe('formatReleaseNotes', () => {
    test('formats release notes with version', () => {
      const analysis = {
        categories: {},
        breaking: [],
        contributors: [],
        stats: { total_commits: 2 },
      };
      const diffSummary = {};
      const result = formatReleaseNotes(analysis, diffSummary, '1.0.0', '0.9.0', {});
      expect(result).toContain('1.0.0');
      expect(typeof result).toBe('string');
      expect(result.length).toBeGreaterThan(0);
    });

    test('handles empty analysis with default version', () => {
      const analysis = {
        categories: {},
        breaking: [],
        contributors: [],
        stats: { total_commits: 0 },
      };
      const result = formatReleaseNotes(analysis, {}, '', '', {});
      expect(typeof result).toBe('string');
      expect(result.length).toBeGreaterThan(0);
    });

    test('uses v0.0.0 when no version provided', () => {
      const analysis = {
        categories: {},
        breaking: [],
        contributors: [],
        stats: { total_commits: 0 },
      };
      const result = formatReleaseNotes(analysis, {}, '', '', {});
      expect(result).toContain('0.0.0');
    });
  });

  describe('generateSummary', () => {
    test('generates summary from analysis', () => {
      const analysis = {
        stats: { total_commits: 10, additions: 500, deletions: 200 },
        categories: { 'Features': [{}, {}], 'Bug Fixes': [{}] },
        breaking: [],
        contributors: [{ name: 'Alice' }, { name: 'Bob' }],
      };
      const summary = generateSummary(analysis, '1.0.0');
      expect(typeof summary).toBe('string');
      expect(summary.length).toBeGreaterThan(0);
    });

    test('handles null analysis', () => {
      const summary = generateSummary(null, '1.0.0');
      expect(typeof summary).toBe('string');
    });
  });
});
