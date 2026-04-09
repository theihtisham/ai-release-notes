'use strict';

const { parseVersion, isPrerelease, getNextVersion, compareVersions } = require('../src/semver');

describe('semver', () => {
  describe('parseVersion', () => {
    test('parses valid semver', () => {
      const result = parseVersion('1.2.3');
      expect(result).toBeTruthy();
      if (result) {
        expect(result.major).toBe(1);
        expect(result.minor).toBe(2);
        expect(result.patch).toBe(3);
      }
    });

    test('parses semver with v prefix', () => {
      const result = parseVersion('v1.2.3');
      expect(result).toBeTruthy();
      if (result) {
        expect(result.major).toBe(1);
      }
    });

    test('parses prerelease version', () => {
      const result = parseVersion('1.2.3-beta.1');
      expect(result).toBeTruthy();
    });

    test('returns null for invalid version', () => {
      expect(parseVersion('not-a-version')).toBeNull();
      expect(parseVersion('')).toBeNull();
      expect(parseVersion('1')).toBeNull();
    });
  });

  describe('isPrerelease', () => {
    test('identifies prerelease versions', () => {
      expect(isPrerelease('1.0.0-alpha.1')).toBe(true);
      expect(isPrerelease('1.0.0-beta')).toBe(true);
      expect(isPrerelease('1.0.0-rc.2')).toBe(true);
    });

    test('identifies stable versions', () => {
      expect(isPrerelease('1.0.0')).toBe(false);
      expect(isPrerelease('2.3.4')).toBe(false);
    });

    test('handles v prefix', () => {
      expect(isPrerelease('v1.0.0-alpha')).toBe(true);
      expect(isPrerelease('v1.0.0')).toBe(false);
    });
  });

  describe('compareVersions', () => {
    test('returns positive for greater version', () => {
      expect(compareVersions('2.0.0', '1.0.0')).toBeGreaterThan(0);
    });

    test('returns negative for lesser version', () => {
      expect(compareVersions('1.0.0', '2.0.0')).toBeLessThan(0);
    });

    test('returns 0 for equal versions', () => {
      expect(compareVersions('1.0.0', '1.0.0')).toBe(0);
    });
  });

  describe('getNextVersion', () => {
    test('bumps major for breaking changes', () => {
      const commits = [
        { commit: { message: 'feat: new api\n\nBREAKING CHANGE: old API removed' } },
      ];
      const result = getNextVersion(commits, '1.2.3');
      expect(result).toMatch(/^2\.0\.0/);
    });

    test('bumps minor for features', () => {
      const commits = [
        { commit: { message: 'feat: new feature' } },
      ];
      const result = getNextVersion(commits, '1.2.3');
      expect(result).toMatch(/^1\.3\.0/);
    });

    test('bumps patch for fixes', () => {
      const commits = [
        { commit: { message: 'fix: bug fix' } },
      ];
      const result = getNextVersion(commits, '1.2.3');
      expect(result).toMatch(/^1\.2\.4/);
    });
  });
});
