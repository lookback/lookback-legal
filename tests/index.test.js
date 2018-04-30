const assert = require('assert');
const crypto = require('crypto');

// Under test
const { Consents } = require('../');

const createHash = (text) =>
  crypto.createHash('sha256').update(text).digest('hex');

function test(title, cb) {
  try {
    cb();
    console.log(`✔︎ ${title}`);
  } catch (ex) {
    console.error(`✗ ${title}`);
    throw ex;
  }
}

test('All consents have valid keys', () => {
  Object.keys(Consents).forEach(consentName => {
    const consent = Consents[consentName];

    assert.ok(typeof consent.name === 'string', 'The name is a string');
    assert.equal(consent.name, consentName);
    assert.ok(typeof consent.text === 'string', 'The text is a string');
    assert.ok(typeof consent.version === 'string', 'The version is a string');

    assert.equal(consent.version, createHash(consent.text), 'The version is a correct hash of the text');
  });
});

test('Includes a sign up consent', () => {
  assert.ok(Consents.signupconsent, 'Signup consent exists');
});
