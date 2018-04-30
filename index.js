const fs = require('fs');
const path = require('path');
const glob = require('glob');

function findConsentsFromFile(pattern) {
  return glob.sync(pattern)
    .map(filename => ({
      name: path.basename(filename).split('.')[0],
      text: fs.readFileSync(filename, { encoding: 'utf8' })
    }))
    .reduce((acc, consent) => {
      acc[consent.name] = consent.text;
      return acc;
    }, {});
}

module.exports = findConsentsFromFile(`${__dirname}/consents/*.md`);
