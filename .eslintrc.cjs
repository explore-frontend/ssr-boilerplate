/* eslint-env node */
require('@rushstack/eslint-patch/modern-module-resolution');

const crossImportsPatterns = require('./custom-lint-rules/cross-import-patterns.cjs');

module.exports = {
  root: true,
  extends: ['@kwai-explore/eslint-config/preset/vue3-ts'],
  plugins: ['code-import-patterns'],
  overrides: [
    {
      files: ['src/**/*.ts', 'src/**/*.vue', 'server/**/*.ts'],
      parserOptions: {
        project: ['./tsconfig.json', 'tsconfig.node.json'],
        tsconfigRootDir: __dirname,
        ecmaVersion: 'latest',
      },
    },
  ],
  rules: {
    'vue-scoped-css/enforce-style-type': ['error', { allows: ['scoped', 'module'] }],
    semi: [
      'warn',
      'never',
      {
        beforeStatementContinuationChars: 'never',
      },
    ],
    'code-import-patterns/patterns': crossImportsPatterns,
  },
};
