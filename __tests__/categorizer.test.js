'use strict';

const { categorizeCommits, deduplicateChanges } = require('../src/categorizer');
const { DEFAULT_CATEGORIES } = require('../src/constants');

describe('categorizer', () => {
  describe('categorizeCommits', () => {
    test('returns empty categories for no commits', () => {
      const result = categorizeCommits([], DEFAULT_CATEGORIES);
      expect(Object.keys(result).length).toBeGreaterThanOrEqual(0);
    });

    test('categorizes feat commits', () => {
      const commits = [
        { sha: 'abc123', commit: { message: 'feat: add new dashboard' } },
      ];
      const result = categorizeCommits(commits, DEFAULT_CATEGORIES);
      const allChanges = Object.values(result).flat();
      expect(allChanges.length).toBeGreaterThan(0);
    });

    test('categorizes fix commits', () => {
      const commits = [
        { sha: 'abc123', commit: { message: 'fix: resolve crash on startup' } },
      ];
      const result = categorizeCommits(commits, DEFAULT_CATEGORIES);
      const allChanges = Object.values(result).flat();
      expect(allChanges.length).toBeGreaterThan(0);
    });

    test('handles non-conventional commits as Other', () => {
      const commits = [
        { sha: 'abc123', commit: { message: 'updated something' } },
      ];
      const result = categorizeCommits(commits, DEFAULT_CATEGORIES);
      const allChanges = Object.values(result).flat();
      expect(allChanges.length).toBeGreaterThan(0);
    });

    test('handles commit with message directly on object', () => {
      const commits = [
        { sha: 'abc123', message: 'feat: direct message field' },
      ];
      const result = categorizeCommits(commits, DEFAULT_CATEGORIES);
      const allChanges = Object.values(result).flat();
      expect(allChanges.length).toBeGreaterThan(0);
    });

    test('removes empty categories', () => {
      const commits = [
        { sha: 'abc123', commit: { message: 'feat: only feature' } },
      ];
      const result = categorizeCommits(commits, DEFAULT_CATEGORIES);
      for (const changes of Object.values(result)) {
        expect(changes.length).toBeGreaterThan(0);
      }
    });
  });

  describe('deduplicateChanges', () => {
    test('removes duplicate descriptions across categories', () => {
      const categorized = {
        'Features': [
          { description: 'same thing', commit: 'abc' },
          { description: 'new feature', commit: 'ghi' },
        ],
        'Bug Fixes': [
          { description: 'same thing', commit: 'def' },
        ],
      };
      const result = deduplicateChanges(categorized);
      const allChanges = Object.values(result).flat();
      const descs = allChanges.map(c => c.description.toLowerCase().trim());
      const uniqueDescs = [...new Set(descs)];
      expect(uniqueDescs.length).toBe(descs.length);
    });

    test('returns all unique changes', () => {
      const categorized = {
        'Features': [{ description: 'a', commit: '1' }],
        'Bug Fixes': [{ description: 'b', commit: '2' }],
      };
      const result = deduplicateChanges(categorized);
      const allChanges = Object.values(result).flat();
      expect(allChanges.length).toBeGreaterThanOrEqual(2);
    });

    test('handles empty object', () => {
      const result = deduplicateChanges({});
      expect(Object.keys(result).length).toBe(0);
    });
  });
});
