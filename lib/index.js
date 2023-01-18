const noShallowRule = require("./rules/no-shallow");
const noMountRule = require("./rules/no-mount");

const rules = {
  "no-shallow": noShallowRule,
  "no-mount": noMountRule,
};
module.exports = {
  rules,
  configs: {
    recommended: {
      rules,
    },
  },
};
