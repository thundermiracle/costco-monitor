// const { pathsToModuleNameMapper } = require('ts-jest/utils');
// const { compilerOptions } = require('./tsconfig');

module.exports = {
  roots: ['./src', './__test__'],

  collectCoverage: true,
  collectCoverageFrom: [
    '**/src/**/*.(js|ts)',
    '!**/node_modules/**',
    '!**/index.(js|ts)',
  ],

  transformIgnorePatterns: ['/node_modules/(?!ramda).+\\.js$', 'dist'],
  testPathIgnorePatterns: ['mocks'],
  testEnvironment: 'node',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  testRegex: '(/__test__/.*.(test|spec)).(jsx?|tsx?)$',
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
  },
  // moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, {
  //   prefix: './src/',
  // }),
  verbose: true,
};
