import js from '@eslint/js'
import tseslint from 'typescript-eslint'
import pluginReact from 'eslint-plugin-react'
import pluginReactHooks from 'eslint-plugin-react-hooks'
import pluginUnusedImports from 'eslint-plugin-unused-imports'
import { defineConfig } from 'eslint/config'
import reactRefresh from 'eslint-plugin-react-refresh'
import testingLibrary from 'eslint-plugin-testing-library'
import pluginPrettier from 'eslint-plugin-prettier'

export default defineConfig([
  {
    ignores: [
      'build',
      'node_modules',
      'dist',
      'android',
      'ios',
      '.expo',
      'scripts',
    ],
  },
  {
    files: ['src/**/*.{js,mjs,cjs,ts,jsx,tsx}'],
    plugins: {
      js,
      'react-hooks': pluginReactHooks,
      prettier: pluginPrettier,
      'unused-imports': pluginUnusedImports,
    },
    extends: ['js/recommended'],
    rules: {
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'error',
      'unused-imports/no-unused-imports': 'warn',
      'prettier/prettier': 'warn',
    },
  },
  tseslint.configs.recommended,
  pluginReact.configs.flat.recommended,
  reactRefresh.configs.recommended,
  {
    rules: {
      'react/prop-types': 'off',
      'react/react-in-jsx-scope': 'off',
      'react/jsx-uses-react': 'off',
      'react/no-unescaped-entities': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      'no-console': ['warn', { allow: ['warn', 'error', 'info'] }],
      'no-warning-comments': [
        'warn',
        {
          terms: ['add', 'fix', 'todo', 'do', 'const'],
          location: 'anywhere',
        },
      ],
      'no-inline-comments': 'warn',
      'react-refresh/only-export-components': ['error'],
    },
  },
  {
    files: ['**/__tests__/**/*.[jt]s?(x)', '**/?(*.)+(spec|test).[jt]s?(x)'],
    plugins: {
      'testing-library': testingLibrary,
    },
  },
])
