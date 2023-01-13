"use strict";
const noShallowRule = require("./rules/no-shallow");
const noMountRule = require("./rules/no-mount");

module.exports = {
  rules: {
    "no-shallow": noShallowRule,
    "no-mount": noMountRule,
  },
};
