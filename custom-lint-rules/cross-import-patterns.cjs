const fs = require('fs');
const path = require('path');

const pageBaseDir = path.resolve(__dirname, '../src/pages');
const pageDirs = fs.readdirSync(pageBaseDir);

const baseRegexp = new RegExp(`\/${pageBaseDir}\/`);

const zones = pageDirs.map((dir) => {
  const targetRegexp = new RegExp(`\/${pageBaseDir}\/${dir}\/.+`);
  return {
    target: targetRegexp,
    forbiddenPatterns: [
      {
        pattern: {
          test(str) {
            // Exclude modules from the pages directory
            if (!baseRegexp.test(str)) {
              return false;
            }

            return !targetRegexp.test(str);
          },
        },
        errorMessage: 'Do not reuse modules across page directories',
      },
    ],
  };
});

module.exports = ['error', { zones }];
