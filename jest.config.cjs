module.exports = {
  projects: [
    {
      displayName: 'demo',
      testMatch: ['<rootDir>/packages/demo/src/**/*.test.(ts|tsx|js)'],
      testEnvironment: 'jsdom',
      setupFilesAfterEnv: ['<rootDir>/packages/demo/src/test/setup.ts'],
      moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
      transform: {
        '^.+\\.(ts|tsx|js|jsx)$': [
          'ts-jest',
          {
            useESM: false,
            tsconfig: '<rootDir>/packages/demo/tsconfig.json',
          },
        ],
      },
      preset: 'ts-jest',
      moduleNameMapping: {
        '^~/(.*)$': '<rootDir>/packages/demo/src/$1',
        '^~/shared/(.*)$': '<rootDir>/packages/demo/src/shared/$1',
        '^~/entities/(.*)$': '<rootDir>/packages/demo/src/entities/$1',
        '^~/features/(.*)$': '<rootDir>/packages/demo/src/features/$1',
        '^~/widgets/(.*)$': '<rootDir>/packages/demo/src/widgets/$1',
        '^~/pages/(.*)$': '<rootDir>/packages/demo/src/pages/$1',
        '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
      },
    },
    {
      displayName: 'react-wasm-utils',
      testMatch: ['<rootDir>/packages/react-wasm-utils/**/*.test.(ts|tsx|js)'],
      testEnvironment: 'jsdom',
      moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
      transform: {
        '^.+\\.(ts|tsx|js|jsx)$': [
          'ts-jest',
          {
            useESM: false,
            tsconfig: '<rootDir>/packages/react-wasm-utils/tsconfig.json',
          },
        ],
      },
      preset: 'ts-jest',
    },
  ],
  collectCoverageFrom: [
    'packages/*/src/**/*.{ts,tsx}',
    '!packages/*/src/**/*.d.ts',
    '!packages/*/src/test/**/*',
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html'],
}
