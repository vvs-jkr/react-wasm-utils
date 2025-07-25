import js from '@eslint/js'
import globals from 'globals'
import react from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from '@typescript-eslint/eslint-plugin'
import tsParser from '@typescript-eslint/parser'
import eslintConfigPrettier from 'eslint-config-prettier'

export default [
  {
    ignores: [
      'packages/demo/public/wasm/**',
      'packages/demo/dist/**',
      'packages/react-wasm-utils/dist/**',
      'packages/react-wasm-utils/wasm-lib/pkg/**',
      'packages/react-wasm-utils/wasm-lib/target/**',
      'node_modules/**',
      'dist/**',
      'build/**',
      '.env',
      '**/*.min.js',
      '**/*.bundle.js',
    ],
  },
  {
    files: ['**/*.test.ts', '**/*.test.tsx', '**/setup.ts', '**/setup.js'],
    languageOptions: {
      parserOptions: {
        project: undefined,
      },
      globals: {
        ...globals.jest,
        ...globals.node,
        describe: 'readonly',
        it: 'readonly',
        expect: 'readonly',
        beforeEach: 'readonly',
        afterEach: 'readonly',
        beforeAll: 'readonly',
        afterAll: 'readonly',
        jest: 'readonly',
        global: 'writable',
      },
    },
  },
  {
    files: [
      '**/vite.config.ts',
      '**/vitest.config.ts',
      '**/webpack.config.cjs',
      '**/jest.config.cjs',
    ],
    languageOptions: {
      globals: {
        ...globals.node,
        __dirname: 'readonly',
        __filename: 'readonly',
        process: 'readonly',
        require: 'readonly',
        module: 'readonly',
        exports: 'writable',
      },
    },
  },
  js.configs.recommended,
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: './tsconfig.json',
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: { jsx: true },
      },
      globals: {
        ...globals.browser,
        ...globals.es2021,
      },
    },
    plugins: {
      '@typescript-eslint': tseslint,
      react,
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...tseslint.configs.recommended.rules,
      ...react.configs.recommended.rules,
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-non-null-assertion': 'warn',
    },
    settings: {
      react: { version: 'detect' },
    },
  },
  eslintConfigPrettier,
]
