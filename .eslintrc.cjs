/* eslint-env node */
require('@rushstack/eslint-patch/modern-module-resolution');

module.exports = {
  root: true,
  extends: ['@kwai-explore/eslint-config/preset/vue3-ts'],

  overrides: [
    {
      files: ['src/**/*.ts', 'src/**/*.vue'],
      parserOptions: {
        project: ['./tsconfig.json'],
        tsconfigRootDir: __dirname,
        ecmaVersion: 'latest'
      },
    },
  ],
  rules: {
    'vue-scoped-css/enforce-style-type': ['error', { allows: ['scoped', 'module'] }],
  },
};
