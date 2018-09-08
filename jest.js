// jest config
module.exports = {
  globals: {
    'ts-jest': {
      enableTsDiagnostics: true,
    },
  },
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  testRegex: '\\.test\\.(jsx?|tsx?)$',
  collectCoverageFrom: ['src/**/*.{ts,tsx,js,jsx}'],
  coverageReporters: ['text', 'lcov'],
  coverageDirectory: 'coverage',
  modulePathIgnorePatterns: ['<rootDir>/app'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
};
