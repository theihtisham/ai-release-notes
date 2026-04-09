'use strict';

const { getTone, TONES, isValidTone, ProfessionalTone, CasualTone, HumorousTone, TechnicalTone } = require('../src/tones');

/**
 * Create sample release data for testing.
 */
function createSampleData(overrides = {}) {
  return {
    version: '2.1.0',
    previousVersion: '2.0.0',
    date: '2025-01-15',
    summary: 'Release v2.1.0 with 3 features and 2 fixes.',
    categories: {
      '🚀 Features': [
        { description: 'Added user avatar upload', type: 'feat', scope: 'api' },
        { description: 'Added dark mode', type: 'feat', scope: 'ui' },
      ],
      '🐛 Bug Fixes': [
        { description: 'Fixed login timeout', type: 'fix', scope: 'auth' },
      ],
    },
    breaking: [
      { description: 'Removed old API endpoint', scope: 'api', type: 'feat', migration_guide: 'Use new endpoint' },
    ],
    contributors: [
      { login: 'alice', commits_count: 3, is_first_time: false },
      { login: 'bob', commits_count: 1, is_first_time: true },
    ],
    repoUrl: 'https://github.com/acme/app',
    ...overrides,
  };
}

describe('tones', () => {
  describe('tone factory', () => {
    test('getTone returns ProfessionalTone', () => {
      const t = getTone('professional');
      expect(t).toBeInstanceOf(ProfessionalTone);
      expect(t.name).toBe('professional');
    });

    test('getTone returns CasualTone', () => {
      const t = getTone('casual');
      expect(t).toBeInstanceOf(CasualTone);
      expect(t.name).toBe('casual');
    });

    test('getTone returns HumorousTone', () => {
      const t = getTone('humorous');
      expect(t).toBeInstanceOf(HumorousTone);
      expect(t.name).toBe('humorous');
    });

    test('getTone returns TechnicalTone', () => {
      const t = getTone('technical');
      expect(t).toBeInstanceOf(TechnicalTone);
      expect(t.name).toBe('technical');
    });

    test('getTone throws for unknown tone', () => {
      expect(() => getTone('sarcastic')).toThrow('Unknown tone');
    });

    test('TONES contains all tone types', () => {
      expect(TONES).toEqual(['professional', 'casual', 'humorous', 'technical']);
    });

    test('isValidTone validates correctly', () => {
      expect(isValidTone('professional')).toBe(true);
      expect(isValidTone('casual')).toBe(true);
      expect(isValidTone('unknown')).toBe(false);
    });
  });

  describe('ProfessionalTone', () => {
    test('applies professional language to summary', () => {
      const data = createSampleData();
      const tone = new ProfessionalTone();
      const result = tone.apply(data);

      expect(result.summary).toContain('We are pleased to announce');
      expect(result.summary).toContain('2.1.0');
    });

    test('renames categories to professional names', () => {
      const data = createSampleData();
      const tone = new ProfessionalTone();
      const result = tone.apply(data);

      const categories = Object.keys(result.categories);
      expect(categories.some(c => c.includes('New Features'))).toBe(true);
      expect(categories.some(c => c.includes('Bug Fixes'))).toBe(true);
    });

    test('handles data without categories', () => {
      const data = createSampleData({ categories: {} });
      const tone = new ProfessionalTone();
      const result = tone.apply(data);

      expect(result.summary).toContain('2.1.0');
    });
  });

  describe('CasualTone', () => {
    test('applies casual language to summary', () => {
      const data = createSampleData();
      const tone = new CasualTone();
      const result = tone.apply(data);

      expect(result.summary).toContain("Here's what's new");
      expect(result.summary).toContain('v2.1.0');
    });

    test('adds emojis to category names', () => {
      const data = createSampleData();
      const tone = new CasualTone();
      const result = tone.apply(data);

      const categories = Object.keys(result.categories);
      expect(categories.some(c => c.includes(':rocket:') || c.includes(':bug:'))).toBe(true);
    });

    test('adds exclamation to feature descriptions', () => {
      const data = createSampleData();
      const tone = new CasualTone();
      const result = tone.apply(data);

      const featCategory = Object.keys(result.categories).find(c => c.includes('Cool'));
      if (featCategory) {
        const changes = result.categories[featCategory];
        expect(changes.some(c => c.description.includes('!'))).toBe(true);
      }
    });

    test('casual breaking changes include warning', () => {
      const data = createSampleData();
      const tone = new CasualTone();
      const result = tone.apply(data);

      expect(result.breaking[0].description).toContain('Watch out');
    });
  });

  describe('HumorousTone', () => {
    test('applies humorous language to summary', () => {
      const data = createSampleData();
      const tone = new HumorousTone();
      const result = tone.apply(data);

      expect(result.summary).toContain('v2.1.0');
      // Should be funny - check for one of the known openings
      const openings = ['Hold onto', 'Drumroll', 'Spoiler', 'Cue the', 'waiting for'];
      expect(openings.some(o => result.summary.includes(o))).toBe(true);
    });

    test('uses humorous category names', () => {
      const data = createSampleData();
      const tone = new HumorousTone();
      const result = tone.apply(data);

      const categories = Object.keys(result.categories);
      expect(categories.some(c => c.includes('New and Shiny') || c.includes('Bug Heaven'))).toBe(true);
    });

    test('adds humorous suffixes to feature descriptions', () => {
      const data = createSampleData();
      const tone = new HumorousTone();
      const result = tone.apply(data);

      const featCategory = Object.keys(result.categories).find(c => c.includes('Shiny'));
      if (featCategory) {
        const changes = result.categories[featCategory];
        expect(changes.some(c =>
          c.description.includes('love this') ||
          c.description.includes('finally') ||
          c.description.includes('really')
        )).toBe(true);
      }
    });

    test('adds funny prefixes to breaking changes', () => {
      const data = createSampleData();
      const tone = new HumorousTone();
      const result = tone.apply(data);

      const prefixes = ['Plot twist', 'Breaking news', 'Change of plans', 'In plot twist news'];
      expect(prefixes.some(p => result.breaking[0].description.includes(p))).toBe(true);
    });
  });

  describe('TechnicalTone', () => {
    test('applies technical language to summary', () => {
      const data = createSampleData();
      const tone = new TechnicalTone();
      const result = tone.apply(data);

      expect(result.summary).toContain('v2.1.0');
      expect(result.summary).toContain('MAJOR');
    });

    test('uses conventional commit prefixes in categories', () => {
      const data = createSampleData();
      const tone = new TechnicalTone();
      const result = tone.apply(data);

      const categories = Object.keys(result.categories);
      expect(categories.some(c => c.startsWith('feat:') || c.startsWith('fix:'))).toBe(true);
    });

    test('includes scope in descriptions', () => {
      const data = createSampleData();
      const tone = new TechnicalTone();
      const result = tone.apply(data);

      const allChanges = Object.values(result.categories).flat();
      expect(allChanges.some(c => c.description.includes('['))).toBe(true);
    });

    test('generates default migration guide for breaking changes', () => {
      const data = createSampleData({
        breaking: [{ description: 'Removed endpoint', scope: 'api', type: 'feat' }],
      });
      const tone = new TechnicalTone();
      const result = tone.apply(data);

      expect(result.breaking[0].migration_guide).toBeDefined();
      expect(result.breaking[0].migration_guide).toContain('Migration Steps');
    });

    test('marks feature-only releases as MINOR', () => {
      const data = createSampleData({ breaking: [] });
      const tone = new TechnicalTone();
      const result = tone.apply(data);

      expect(result.summary).toContain('MINOR');
    });

    test('marks fix-only releases as PATCH', () => {
      const data = createSampleData({
        breaking: [],
        categories: {
          '🐛 Bug Fixes': [{ description: 'Fixed something', type: 'fix' }],
        },
      });
      const tone = new TechnicalTone();
      const result = tone.apply(data);

      expect(result.summary).toContain('PATCH');
    });
  });
});
