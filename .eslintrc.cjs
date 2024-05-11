/* eslint-env node */
require('@rushstack/eslint-patch/modern-module-resolution')

module.exports = {
  root: true,
  extends: ['@kwai-explore/eslint-config/preset/vue3-ts'],
  plugins: ['import-isolation'],
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
    'import-isolation/isolation': [
      'error',
      {
        isolationGroups: [
          {
            directories: [
              'pages/*',
              // 'modules/*',
              // equivalent to
              // "modules/a"
              // "modules/b"
              // ...
            ],
          },
        ],
      },
    ],
  },
}
