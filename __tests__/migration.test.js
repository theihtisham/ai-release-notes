'use strict';

const {
  detectBreakingChanges,
  generateMigrationGuide,
  generateUpgradeCommand,
  createBreakingChange,
  extractType,
  extractPRNumber,
  extractMigrationGuide,
  extractBeforeCode,
  extractAfterCode,
  extractAffectedAPIs,
  detectAPISignatureChange,
} = require('../src/analyzers/migration');

/**
 * Create a sample commit object.
 */
function createCommit(message, sha = 'abc123') {
  return { sha, commit: { message, author: { name: 'Dev', email: 'dev@test.com' } } };
}

describe('migration analyzer', () => {
  describe('detectBreakingChanges', () => {
    test('returns empty array for no commits', () => {
      expect(detectBreakingChanges([])).toEqual([]);
      expect(detectBreakingChanges(null)).toEqual([]);
    });

    test('detects BREAKING CHANGE footer', () => {
      const commits = [
        createCommit('feat: new API\n\nBREAKING CHANGE: old API removed'),
      ];
      const result = detectBreakingChanges(commits);
      expect(result.length).toBe(1);
      expect(result[0].description).toContain('old API removed');
    });

    test('detects ! suffix in conventional commits', () => {
      const commits = [
        createCommit('feat!: completely redesigned API'),
      ];
      const result = detectBreakingChanges(commits);
      expect(result.length).toBe(1);
      expect(result[0].description).toContain('completely redesigned API');
      expect(result[0].severity).toBe('major');
    });

    test('detects "breaking:" prefix', () => {
      const commits = [
        createCommit('breaking: removed legacy support'),
      ];
      const result = detectBreakingChanges(commits);
      expect(result.length).toBe(1);
    });

    test('detects "breaking change" keyword in message', () => {
      const commits = [
        createCommit('refactor: this is a breaking change to the config module'),
      ];
      const result = detectBreakingChanges(commits);
      expect(result.length).toBe(1);
    });

    test('detects API signature changes from keywords', () => {
      const commits = [
        createCommit('refactor: remove getUserById method from UserService'),
      ];
      const result = detectBreakingChanges(commits);
      expect(result.length).toBe(1);
      expect(result[0].affected_apis).toContain('getUserById');
    });

    test('detects renamed APIs', () => {
      const commits = [
        createCommit('refactor: rename fetchUsers to getUsers'),
      ];
      const result = detectBreakingChanges(commits);
      expect(result.length).toBe(1);
      expect(result[0].affected_apis).toContain('fetchUsers');
    });

    test('detects deprecated APIs', () => {
      const commits = [
        createCommit('chore: deprecate Config.getOldValue'),
      ];
      const result = detectBreakingChanges(commits);
      expect(result.length).toBe(1);
      expect(result[0].affected_apis).toContain('Config.getOldValue');
    });

    test('extracts scope from conventional commit', () => {
      const commits = [
        createCommit('feat(api)!: redesigned endpoint structure'),
      ];
      const result = detectBreakingChanges(commits);
      expect(result[0].scope).toBe('api');
    });

    test('extracts PR number', () => {
      const commits = [
        createCommit('feat!: big change (#123)'),
      ];
      const result = detectBreakingChanges(commits);
      expect(result[0].pr).toBe(123);
    });

    test('detects multiple breaking changes', () => {
      const commits = [
        createCommit('feat!: first breaking change'),
        createCommit('fix(api)!: second breaking change\n\nBREAKING CHANGE: details here'),
      ];
      const result = detectBreakingChanges(commits);
      expect(result.length).toBe(2);
    });

    test('extracts migration guide from body', () => {
      const commits = [
        createCommit('feat!: changed API\n\nMigration Guide:\n- Step 1\n- Step 2\n- Step 3'),
      ];
      const result = detectBreakingChanges(commits);
      expect(result[0].migration_guide).toContain('Step 1');
    });

    test('extracts before code blocks', () => {
      const commits = [
        createCommit('feat!: changed API\n\nBefore:\n```javascript\noldAPI()\n```\n\nAfter:\n```javascript\nnewAPI()\n```'),
      ];
      const result = detectBreakingChanges(commits);
      expect(result[0].before_code).toContain('oldAPI()');
      expect(result[0].after_code).toContain('newAPI()');
    });
  });

  describe('generateMigrationGuide', () => {
    test('returns no-migration message for empty changes', () => {
      const result = generateMigrationGuide([]);
      expect(result).toContain('No breaking changes detected');
    });

    test('generates structured migration guide', () => {
      const changes = [
        {
          description: 'Removed /api/v1/users endpoint',
          scope: 'api',
          severity: 'major',
          migration_guide: 'Use /api/v2/users instead',
          pr: 42,
        },
      ];
      const result = generateMigrationGuide(changes);

      expect(result).toContain('Migration Guide');
      expect(result).toContain('Removed /api/v1/users endpoint');
      expect(result).toContain('Use /api/v2/users instead');
      expect(result).toContain('PR #42');
    });

    test('includes before/after code examples', () => {
      const changes = [
        {
          description: 'Changed function signature',
          scope: 'utils',
          before_code: 'oldFunction(arg1)',
          after_code: 'newFunction(arg1, options)',
        },
      ];
      const result = generateMigrationGuide(changes);

      expect(result).toContain('oldFunction(arg1)');
      expect(result).toContain('newFunction(arg1, options)');
    });

    test('generates default steps when no migration guide', () => {
      const changes = [
        {
          description: 'Something broke',
          scope: 'core',
        },
      ];
      const result = generateMigrationGuide(changes);

      expect(result).toContain('Migration Steps');
      expect(result).toContain('Review the changes');
    });

    test('includes deprecation timeline', () => {
      const changes = [
        { description: 'A change', scope: 'api', severity: 'major' },
      ];
      const result = generateMigrationGuide(changes);

      expect(result).toContain('Deprecation Timeline');
    });

    test('handles multiple breaking changes', () => {
      const changes = [
        { description: 'Change 1', scope: 'a', severity: 'major' },
        { description: 'Change 2', scope: 'b', severity: 'major' },
      ];
      const result = generateMigrationGuide(changes);

      expect(result).toContain('Change 1');
      expect(result).toContain('Change 2');
    });

    test('lists affected APIs', () => {
      const changes = [
        {
          description: 'API changed',
          scope: 'api',
          affected_apis: ['oldEndpoint()', 'Config.set()'],
        },
      ];
      const result = generateMigrationGuide(changes);

      expect(result).toContain('oldEndpoint()');
      expect(result).toContain('Config.set()');
    });
  });

  describe('generateUpgradeCommand', () => {
    test('generates npm command', () => {
      const result = generateUpgradeCommand('1.0.0', '2.0.0', 'my-package');
      expect(result).toContain('npm install my-package@2.0.0');
    });

    test('generates yarn command', () => {
      const result = generateUpgradeCommand('1.0.0', '2.0.0', 'my-package');
      expect(result).toContain('yarn add my-package@2.0.0');
    });

    test('generates pnpm command', () => {
      const result = generateUpgradeCommand('1.0.0', '2.0.0', 'my-package');
      expect(result).toContain('pnpm add my-package@2.0.0');
    });

    test('warns about major upgrades', () => {
      const result = generateUpgradeCommand('1.0.0', '2.0.0');
      expect(result).toContain('major version upgrade');
    });

    test('notes minor version upgrades', () => {
      const result = generateUpgradeCommand('1.0.0', '1.1.0');
      expect(result).toContain('minor version');
      expect(result).toContain('Backward compatible');
    });

    test('notes patch version upgrades', () => {
      const result = generateUpgradeCommand('1.0.0', '1.0.1');
      expect(result).toContain('patch upgrade');
      expect(result).toContain('Safe to upgrade');
    });
  });

  describe('helper functions', () => {
    test('extractType returns correct type', () => {
      expect(extractType('feat: something')).toBe('feat');
      expect(extractType('fix: something')).toBe('fix');
      expect(extractType('random message')).toBe('other');
    });

    test('extractPRNumber returns correct PR number', () => {
      expect(extractPRNumber('feat: something (#42)')).toBe(42);
      expect(extractPRNumber('no PR')).toBeNull();
    });

    test('extractMigrationGuide finds migration text', () => {
      const body = 'Migration Guide:\n- Step 1\n- Step 2\n\nOther text';
      expect(extractMigrationGuide(body)).toContain('Step 1');
    });

    test('extractMigrationGuide finds MIGRATION text', () => {
      const body = 'MIGRATION:\n- Update code\n- Run tests';
      expect(extractMigrationGuide(body)).toContain('Update code');
    });

    test('extractMigrationGuide returns empty for no guide', () => {
      expect(extractMigrationGuide('no guide here')).toBe('');
      expect(extractMigrationGuide('')).toBe('');
    });

    test('extractBeforeCode extracts code blocks', () => {
      const body = 'Before:\n```javascript\noldCode()\n```\nAfter:\n```javascript\nnewCode()\n```';
      expect(extractBeforeCode(body)).toContain('oldCode()');
    });

    test('extractAfterCode extracts second code block', () => {
      const body = 'Before:\n```javascript\noldCode()\n```\nAfter:\n```javascript\nnewCode()\n```';
      expect(extractAfterCode(body)).toContain('newCode()');
    });

    test('extractAfterCode returns empty for single code block', () => {
      const body = '```javascript\nonlyCode()\n```';
      expect(extractAfterCode(body)).toBe('');
    });

    test('extractAffectedAPIs finds API patterns', () => {
      const body = 'Changed: `myApp.getUser()` and affected API: `myApp.setUser()`';
      const apis = extractAffectedAPIs(body);
      expect(apis.length).toBeGreaterThanOrEqual(2);
    });

    test('detectAPISignatureChange detects removed methods', () => {
      expect(detectAPISignatureChange('remove getUserById method from UserService')).toBe('getUserById');
    });

    test('detectAPISignatureChange detects renamed APIs', () => {
      expect(detectAPISignatureChange('rename fetchUsers to getUsers')).toBe('fetchUsers');
    });

    test('detectAPISignatureChange detects deprecated APIs', () => {
      expect(detectAPISignatureChange('deprecate Config.getOldValue')).toBe('Config.getOldValue');
    });

    test('detectAPISignatureChange returns null for no match', () => {
      expect(detectAPISignatureChange('add new feature')).toBeNull();
      expect(detectAPISignatureChange(null)).toBeNull();
    });
  });
});
