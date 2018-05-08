const { test } = require('./test-runner');
const crypto = require('crypto');

// Under test
const { Consents } = require('../')();

const createHash = (text) =>
  crypto.createHash('sha256').update(text).digest('hex');

test('All consents have valid keys', t => {
  Object.keys(Consents).forEach(consentName => {
    Consents[consentName].forEach(consent => {
      t.ok(typeof consent.name === 'string', 'The name is a string');
      t.equal(consent.name, consentName);
      t.ok(typeof consent.text === 'string', 'The text is a string');
      t.ok(typeof consent.version === 'string', 'The version is a string');
      t.ok(consent.createdAt instanceof Date, 'createdAt is a Date');

      t.equal(consent.version, createHash(consent.text), 'The version is a correct hash of the text');
    });
  });
});
