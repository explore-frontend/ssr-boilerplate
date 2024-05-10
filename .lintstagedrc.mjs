export default {
  'src/**/*.{ts,vue}': ['prettier --write', 'eslint --cache --fix'],
  'server/**/*.{ts}': ['prettier --write', 'eslint --cache --fix'],
  '**/*.{js,mts,mjs,css,json,md}': 'prettier --write',
  './**/*.{vue,css,scss,less}': 'stylelint',
}
