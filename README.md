# Lookback Legal

A repository for terms, consents, and various legal things we show for users.

## Consents

We store consent texts in Markdown (`.md`) files inside the `consents` directory.

### Adding a new consent or changing an existing consent

1. Branch off into a new new git branch.
2. Create a new Markdown file in `consents` directory or change an existing one.
3. Add an existence test for the consent in `tests/index.test.js`.
4. Submit a PR on GitHub based on your branch. Ping relevant people for review.
5. Once merged, updated relevant services which depends on this module.

## Usage

The module exports a `Consents` object which is a dict on the following format:

```js
{
    'nameOfConsentFile': {
        name: '<same as key>',
        text: '<contents of consent file>',
        version: '<sha256 hash of `text` property>'
    },
    // ...
}
```

You can access the consents as keys on the exported dictionary. The keys of the dict are the filenames of the Markdown files (minus the `.md` extension).

```js
// React example
import { Consents } from 'lookback-legal';
import React from 'react';

// Do stuff with the consent:
function SomeComponent() {
    return (
        <p>{Consents.signupconsent.text}</p>
    );
}
```

Use the `version` of each consent as a reference to what the user actually consented to. This is a sample user document in a Mongo collection:

```js
import { Consents } from 'lookback-legal';

{
    // ...
    "consents": [
        {
            "consentName": Consents.signupconsent.name,
            "version": Consents.signupconsent.version,
            "consentedAt": new Date(),
            "where": "signupForm",
            "path": "/signup"
        }
    ]
}
```

## Tests

```
npm test
```

The tests currently check the output of the main module, and asserts its contents.
