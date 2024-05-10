const fs = require('fs')
const path = require('path')

const pageBaseDir = path.resolve(__dirname, '../src/pages')
const pageDirs = fs.readdirSync(pageBaseDir)

const zones = pageDirs.map((dir) => {
  const targetRegexp = new RegExp(`\/${dir}\/.+`)
  return {
    target: targetRegexp,
    forbiddenPatterns: [
      {
        pattern: {
          test(str) {
            // Exclude modules from the pages directory
            return !pageDirs.every(page => dir === page || !str.includes(`/${page}`))
          },
        },
        errorMessage: 'Do not reuse modules across page directories',
      },
    ],
  }
})

module.exports = ['error', { zones }]
