# Lookback Legal

A repository for terms, consents, and various legal things we show for users.

## Consents

- We store consent texts in Markdown (`.md`) files inside the `consents` directory.
- Each directory name is treated as the name of the consent.
- Each Markdown file inside of the directories is treated as a version of the consent. The name of the Markdown text file is irrelevant.
- Each consent file must include [YAML Front Matter](https://jekyllrb.com/docs/frontmatter/). Front Matter is a way to embed metadata fields inside a text file. So each consent file should look like:
    ```markdown
    ---
    date: 2018-05-08T14:06:00  # Required
    ---
    Your text here.
    ```

### Adding a whole new consent

1. Branch off into a new new git branch.
2. Create a new directory in the `consents` directory. Give it a unique, `camelCase` name. This name will end up on the user object in the database, so make it easy to understand.
3. Add a `.md` file in the newly created directory, with a front matter and body text. You *must* attach today's date formatted as an ISO string:
    ```markdown
    ---
    date: 2018-05-08T14:06:00
    ---
    Your text here.
    ```
4. Submit a PR on GitHub based on your branch. Ping relevant people for review.
5. Once merged, updated relevant services which depends on this module.

### Adding a new version of a consent

See steps 1) and 3-5) above.

### Changing an existing consent

⚠️ Never mutate an existing consent text! Add a new version instead.

## API

**Schema Definitions**

```ts
interface Consent {
    version: string;
    name: string;
    createdAt: Date;
    text: string;
}
```

- **Versioning.** The `version` property is a SHA hash of the `text` property, calculated at runtime.

The module expose the following APIs:

**Default export**

```js
init(consentPath?: string): object
```

Call this function with no arguments to make it look for consents in a default directory. Returns an object with API functions:

```js
findConsent(consentName, version?: string): Consent;
```
Returns a consent object for the given `consentName`. If no `version` string is passed, the latest consent version is returned. Might return `null` if no consent was found for the given version.

```js
userHasConsented(user: object, consentName: string, version?: string): boolean;
```
Returns true if the given `user` has given consent for a `consentName`. A specific `version` string can be passed, otherwise the default is to check the latest available. False is returned if no consent exists for the given name.

### Example Usage

This is a sample user document in a Mongo collection:

```js
{
    // ...
    "consents": [
        {
            "consentName": "someConsent",
            "version": "hash...",
            "consentedAt": new Date(),
            "where": "signupForm",
            "path": "/signup"
        }
    ]
}
```

```js
const { findConsent, userHasConsented } = require('lookback-legal')();

const consent = findConsent('someConsent');

console.log(userHasConsented(user, 'someConsent'));
```


## Tests

```
npm test
```

