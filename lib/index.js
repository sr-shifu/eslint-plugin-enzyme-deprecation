const noShallowRule = require("./rules/no-shallow");
const noMountRule = require("./rules/no-mount");
const { progressTracker } = require("./formatter");

const rules = {
  "no-shallow": noShallowRule,
  "no-mount": noMountRule,
};
module.exports = {
  rules,
  configs: {
    "with-progress-tracker": {
      rules,
      formatter: progressTracker,
    },
  },
};
