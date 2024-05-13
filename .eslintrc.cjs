/* eslint-env node */
require('@rushstack/eslint-patch/modern-module-resolution')

module.exports = {
  root: true,
  extends: ['@kwai-explore/eslint-config/preset/vue3-ts'],
  plugins: ['import-isolation', '@intlify/vue-i18n'],
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
    // 跨文件目录引用检查
    'import-isolation/isolation': [
      'error',
      {
        isolationGroups: [
          {
            directories: ['pages/*'],
          },
        ],
      },
    ],
    // i18n检查
    '@intlify/vue-i18n/no-raw-text': 'warn',
    '@intlify/vue-i18n/no-missing-keys': 'error',
    '@intlify/vue-i18n/no-html-messages': 'warn',
    '@intlify/vue-i18n/no-v-html': 'warn',
  },
  settings: {
    'vue-i18n': {
      localeDir: './src/locales/*.{json,json5,yaml,yml}',
    },
  },
}
