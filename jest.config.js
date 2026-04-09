'use strict';

module.exports = {
  testEnvironment: 'node',
  testMatch: ['**/__tests__/**/*.test.js'],
  collectCoverageFrom: ['src/**/*.js', '!src/logger.js'],
  coverageThreshold: {
    global: { branches: 20, functions: 20, lines: 20, statements: 20 },
  },
};
