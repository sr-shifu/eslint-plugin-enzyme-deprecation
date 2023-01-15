const chart = require("ascii-horizontal-barchart");

module.exports = (data, showLabels = true) => {
  console.log(chart(data, showLabels));
};
