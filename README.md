# eslint-plugin-enzyme-deprecation

A custom ESLint plugin that detects and warns about using render APIs of Enzyme (`shallow`/`mount`). If you are using React in your project and want to switch to a future-proof solution for rendering components in your tests (e.g., React Testing Library), you might find this plugin useful. `eslint-plugin-enzyme-deprecation` plugin helps developers that require some way of preventing od writing a new code using these APIs as well as tracking their progress of migration from Enzyme to the library of your choice. You can find more details about migration strategies and plugin's implementation details in this [article](https://thesametech.com/migrate-away-from-enzyme/).

## Installation

You'll first need to install ESLint:

```bash
$ npm i eslint --save-dev
```

Next, install `eslint-plugin-enzyme-deprecation`:

```bash
$ npm install eslint-plugin-enzyme-deprecation --save-dev
```

Note: If you installed ESLint globally (using the `-g` flag) then you must also install `eslint-plugin-enzyme-deprecation` globally.

## Usage

### Linting with no tracking

Add `enzyme-deprecation` to the plugins section of your `.eslintrc` configuration file. You can specify the rules you want to use under the `rules` section.

```json
{
  "plugins": ["enzyme-deprecation"],
  "rules": {
    "enzyme-deprecation/no-shallow": 2,
    "enzyme-deprecation/no-mount": 2
  }
}
```

### Linting with tracking

**Option 1:** Define separate ESLint config for migration

`.eslintrc.migration.js`:

```js
module.exports = {
  parser: "<your-parser>",
  extends: ["plugin:enzyme-deprecation/recommended"],
  env: {
    browser: true,
  },
  rules: {
    "enzyme-deprecation/no-shallow": 2,
    "enzyme-deprecation/no-mount": 2,
  },
};
```

And in your `package.json` define command:

```
"track:migration": "NODE_ENV=development eslint --no-eslintrc  --config .eslintrc.migration.js -f node_modules/eslint-plugin-enzyme-deprecation/lib/formatter --ext .test.jsx src/"
```

You can also configure display value format via environment variable:

```
"track:migration": "EDP_VALUE_FORMAT=<format> NODE_ENV=development eslint --no-eslintrc  --config .eslintrc.migration.js -f node_modules/eslint-plugin-enzyme-deprecation/lib/formatter --ext .test.jsx src",
```

Supported formats:

- `absolute-value`
- `percentage`

**Option 2:** Using Node.js API

You can find an example [here](https://github.com/sr-shifu/eslint-plugin-enzyme-deprecation/blob/main/examples/run.js) (see `npm run demo` command in `package.json` to see how to run it).

## Additional configuration

### Enzyme API is defined implicitly in global scope

If you assign Enzyme API to global scope at test initialization stage:

```js
global.shallow = require("enzyme").shallow;
```

you might want to pass additional configuration to ESLint rules:

```json
{
  "plugins": ["enzyme-deprecation"],
  "rules": {
    "enzyme-deprecation/no-shallow": [2, { "implicitlyGlobal": true }],
    "enzyme-deprecation/no-mount": [2, { "implicitlyGlobal": true }]
  }
}
```

### Code has custom implementation built on top of Enzyme API

If you are using Redux, then most likely you have some custom `shallowWithState` method in your package that automatically wraps component under test into Redux store provider. In this case you may want to enhance rule to search for this custom API.

**Example:**

```json
{
  "plugins": ["enzyme-deprecation"],
  "rules": {
    "enzyme-deprecation/no-shallow": [2, { "resolveAs": [{
        "name": "shallowWithState",
        "sources" ["^@testUtils"]
    }] }],
  }
}
```

## Supported Rules

- `enzyme-deprecation/no-shallow`: warns when using Enzyme's `shallow` [API](https://enzymejs.github.io/enzyme/docs/api/shallow.html)
- `enzyme-deprecation/no-mount`: warns when using Enzyme's `mount` [API](https://enzymejs.github.io/enzyme/docs/api/mount.html)
