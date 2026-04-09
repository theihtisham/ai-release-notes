'use strict';

const { createConfig } = require('../src/config');

describe('config', () => {
  const validInputs = {
    'github-token': 'ghp_test123',
  };

  test('creates config with defaults', () => {
    const config = createConfig(validInputs);
    expect(config).toBeTruthy();
    expect(config.githubToken).toBe('ghp_test123');
  });

  test('throws for missing github token', () => {
    expect(() => createConfig({})).toThrow();
  });

  test('throws for empty github token', () => {
    expect(() => createConfig({ 'github-token': '' })).toThrow();
  });

  test('accepts valid template', () => {
    const config = createConfig({ ...validInputs, template: 'default' });
    expect(config).toBeTruthy();
    expect(config.template).toBe('default');
  });

  test('sets default template when not provided', () => {
    const config = createConfig(validInputs);
    expect(config.template).toBe('default');
  });

  test('accepts valid commit mode', () => {
    const config = createConfig({ ...validInputs, 'commit-mode': 'auto' });
    expect(config.commitMode).toBe('auto');
  });

  test('accepts valid language', () => {
    const config = createConfig({ ...validInputs, language: 'en' });
    expect(config.language).toBe('en');
  });

  test('parses max commits', () => {
    const config = createConfig({ ...validInputs, 'max-commits': '50' });
    expect(config.maxCommits).toBe(50);
  });

  test('uses default max commits when not provided', () => {
    const config = createConfig(validInputs);
    expect(config.maxCommits).toBe(200);
  });

  test('parses boolean include-breaking', () => {
    const config = createConfig({ ...validInputs, 'include-breaking': 'false' });
    expect(config.includeBreaking).toBe(false);
  });

  test('parses boolean dry-run', () => {
    const config = createConfig({ ...validInputs, 'dry-run': 'true' });
    expect(config.dryRun).toBe(true);
  });

  test('defaults dry-run to false', () => {
    const config = createConfig(validInputs);
    expect(config.dryRun).toBe(false);
  });

  test('throws for invalid commit mode', () => {
    expect(() => createConfig({ ...validInputs, 'commit-mode': 'invalid' })).toThrow();
  });

  test('throws for invalid language', () => {
    expect(() => createConfig({ ...validInputs, language: 'xx' })).toThrow();
  });

  test('detects AI availability', () => {
    const config = createConfig({ ...validInputs, 'api-key': 'sk-test' });
    expect(config.hasAI).toBe(true);
  });

  test('detects no AI when api-key missing', () => {
    const config = createConfig(validInputs);
    expect(config.hasAI).toBe(false);
  });

  test('returns frozen object', () => {
    const config = createConfig(validInputs);
    expect(Object.isFrozen(config)).toBe(true);
  });
});
