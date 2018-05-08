const fs = require('fs');
const path = require('path');
const glob = require('glob');
const crypto = require('crypto');
const fm = require('front-matter');

const createHash = (text) =>
  crypto.createHash('sha256').update(text).digest('hex');

const nameOfParentDirectory = (filePath) =>
  path.dirname(filePath).split(path.sep).pop();

function findConsentsFromFile(pattern) {
  return glob.sync(pattern)
    .map(filename => {
      // The name of the parent directory of the .md file.
      const data = fs.readFileSync(filename, { encoding: 'utf8' });

      const consentName = nameOfParentDirectory(filename);
      const { attributes, body } = fm(data);

      return {
        name:      consentName,
        text:      body,
        createdAt: attributes.date,
        version:   createHash(body)
      };
    })
    // Convert to dict
    .reduce((acc, consent) => {
      // If a consent already exists, push this version on to the array and
      // re-sort it.
      if (acc[consent.name]) {
        acc[consent.name].push(consent);
        // Sort in descending order on date
        acc[consent.name].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
      } else {
        acc[consent.name] = [consent];
      }

      return acc;
    }, {});
}

module.exports = function init(consentPath = `${__dirname}/consents`) {
  // consents is a dict with values of sorted object arrays, on descending createdAt
  const consents = findConsentsFromFile(path.join(consentPath, '**/*.md'));

  const findConsent = (consentName, version) => {
    if (!consents[consentName]) {
      return null;
    }

    if (!version) {
      return consents[consentName][0];
    }

    return consents[consentName].filter(consent => consent.version === version)[0] || null;
  };

  const userHasConsented = (user, consentName, version) => {
    if (!user || !Array.isArray(user.consents) || !user.consents.length) {
      return false;
    }

    const consent = findConsent(consentName, version);

    // Consent doesn't exist. This shouldn't be happening though.
    if (!consent) {
      return false;
    }

    // Loop through and find if the user has given consent
    return user.consents.some(userConsent => userConsent.version === consent.version);
  };

  return {
    Consents: consents,
    findConsent,
    userHasConsented,
  };
};
