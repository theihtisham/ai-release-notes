'use strict';

const { analyzeCommits } = require('../src/analyzer');
const { DEFAULT_CATEGORIES } = require('../src/constants');

describe('analyzer', () => {
  describe('analyzeCommits', () => {
    test('returns empty analysis for no commits', () => {
      const result = analyzeCommits([], { categories: DEFAULT_CATEGORIES });
      expect(result.stats.total_commits).toBe(0);
      expect(result.categories).toEqual({});
      expect(result.contributors).toEqual([]);
    });

    test('returns empty analysis for null commits', () => {
      const result = analyzeCommits(null, { categories: DEFAULT_CATEGORIES });
      expect(result.stats.total_commits).toBe(0);
    });

    test('categorizes conventional commits', () => {
      const commits = [
        { sha: 'abc123', commit: { message: 'feat: add new login page', author: { name: 'Alice', email: 'alice@test.com' } } },
        { sha: 'def456', commit: { message: 'fix: resolve login timeout', author: { name: 'Bob', email: 'bob@test.com' } } },
      ];
      const result = analyzeCommits(commits, { categories: DEFAULT_CATEGORIES });
      expect(result.stats.total_commits).toBe(2);
      expect(result.contributors.length).toBeGreaterThan(0);
    });

    test('detects breaking changes', () => {
      const commits = [
        { sha: 'abc123', commit: { message: 'feat!: completely new API\n\nBREAKING CHANGE: old API removed', author: { name: 'Alice', email: 'alice@test.com' } } },
      ];
      const result = analyzeCommits(commits, { categories: DEFAULT_CATEGORIES });
      expect(result.breaking.length).toBeGreaterThan(0);
    });

    test('extracts scopes from commits', () => {
      const commits = [
        { sha: 'abc123', commit: { message: 'feat(auth): add OAuth support', author: { name: 'Alice', email: 'alice@test.com' } } },
      ];
      const result = analyzeCommits(commits, { categories: DEFAULT_CATEGORIES });
      expect(result.stats.total_commits).toBe(1);
    });

    test('handles commits without author info', () => {
      const commits = [
        { sha: 'abc123', commit: { message: 'chore: update deps' } },
      ];
      const result = analyzeCommits(commits, { categories: DEFAULT_CATEGORIES });
      expect(result.stats.total_commits).toBe(1);
    });

    test('counts total commits correctly', () => {
      const commits = Array.from({ length: 10 }, (_, i) => ({
        sha: `abc${i}`,
        commit: { message: `feat: feature ${i}`, author: { name: 'Dev', email: 'dev@test.com' } },
      }));
      const result = analyzeCommits(commits, { categories: DEFAULT_CATEGORIES });
      expect(result.stats.total_commits).toBe(10);
    });
  });
});
