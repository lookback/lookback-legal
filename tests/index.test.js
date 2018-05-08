const { test, suite } = require('./test-runner');

suite('All consents', () => {
  require('./included-consents.test');
});

// Under test
const { userHasConsented, findConsent, Consents } = require('../')(`${__dirname}/fixtures`);

suite('Index', () => {

  // ------ Test the data structure

  test('All consents are grouped on consent name and sorted in descending order by date', t => {
    // Check that the two directories in fixtures exist as top level "groups":
    t.ok(Consents.testconsent, 'testconsent exists');
    t.ok(Consents.someotherconsent, 'someotherconsent exists');

    // Simple sort check to see that the first element's
    // createdAt is before the next one
    t.ok(Consents.testconsent[0].createdAt.getTime() > Consents.testconsent[1].createdAt.getTime()
      , 'sorted latest to oldest');
  });

  // ------ userHasConsented

  test('userHasConsented returns false if user has no consents', t => {
    const user = {};

    t.equal(userHasConsented(user, 'testconsent'), false);
  });

  test('userHasConsented returns true if user has consented to latest version', t => {
    const user = {
      consents: [
        {
          consentName: 'testconsent',
          version:     '9bcbcc8ddd742d0386cda25501786914e5a57a82b7fbfa5e5ab1b488807ec3ca'
        }
      ]
    };

    t.equal(userHasConsented(user, 'testconsent'), true);
  });

  // XXX Is this function supposed to work like this?
  test('userHasConsented returns false if user has not consented to latest version', t => {
    const user = {
      consents: [
        {
          consentName: 'testconsent',
          version:     '008d3f71f1a0367205d95759d7ef4fbcf67420e7219026470d278dd73003a243'
        }
      ]
    };

    t.equal(userHasConsented(user, 'testconsent'), false);
  });

  test('userHasConsented returns false if user has not consented to the specified consent', t => {
    const user = {
      consents: [
        {
          consentName: 'randomconsent',
          version:     'aadd3f71f1a0367205d95759d7ef4fbcf67420e7219026470d278dd73003a241'
        }
      ]
    };

    t.equal(userHasConsented(user, 'testconsent'), false);
  });

  test('userHasConsented returns true if user has consented to specific version', t => {
    const version = '008d3f71f1a0367205d95759d7ef4fbcf67420e7219026470d278dd73003a243';

    const user = {
      consents: [
        {
          consentName: 'testconsent',
          version
        }
      ]
    };

    t.equal(userHasConsented(user, 'testconsent', version), true);
  });

  // ------ findConsent

  test('findConsent without specifying returns the latest consent', t => {
    const latest = Consents.testconsent[0];

    t.ok(findConsent('testconsent'), 'returns latest');
    t.equal(findConsent('testconsent').version, latest.version, 'the versions match');
  });

  test('findConsent can return a specific version', t => {
    const version = '008d3f71f1a0367205d95759d7ef4fbcf67420e7219026470d278dd73003a243';
    const consent = findConsent('testconsent', version);

    t.ok(consent, 'returns specific version');
    t.equal(consent.version, version, 'the versions match');
  });

  test('findConsent returns null for non existing consent name', t => {
    const consent = findConsent('herpderp');

    t.equal(consent, null, 'did not find consent');
  });

  test('findConsent returns null for non existing version', t => {
    const consent = findConsent('testconsent', 'foo');

    t.equal(consent, null, 'did not find consent version');
  });

});
