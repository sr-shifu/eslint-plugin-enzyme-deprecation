# eslint-plugin-enzyme-deprecation

A custom ESLint plugin that detects and warns about using render APIs of Enzyme (`shallow`/`mount`). If you are using React in your project and want to switch to a future-proof solution for rendering components in your tests (e.g., React Testing Library), you might find this plugin useful. `eslint-plugin-enzyme-deprecation` plugin helps developers that require some way of preventing od writing a new code using these APIs as well as tracking their progress of migration from Enzyme to the library of your choice.

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
