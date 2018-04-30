const fs = require('fs');
const path = require('path');
const glob = require('glob');
const crypto = require('crypto');

function findConsentsFromFile(pattern) {
  return glob.sync(pattern)
    .map(filename => {
      const text = fs.readFileSync(filename, { encoding: 'utf8' });

      return {
        name:    path.basename(filename).split('.')[0],
        text,
        version: crypto.createHash('sha256').update(text).digest('hex')
      };
    })
    // Convert to dict
    .reduce((acc, consent) => {
      acc[consent.name] = {
        name:    consent.name,
        text:    consent.text,
        version: consent.version
      };
      return acc;
    }, {});
}

exports.Consents = findConsentsFromFile(`${__dirname}/consents/*.md`);


