const formatter = require("./dataFormatter");
const visualizer = require("./dataVisualizer");
const log = require("./terminalLogger");

function formatLabel(label, valueFormat) {
  switch (valueFormat) {
    case "percentage":
      return `${label} [% of all errors]`;
    case "percentage-summary":
      return `${label} [%]`;
    case "absolute-value":
      return `${label} [number of errors]`;
    default:
      return label;
  }
}

function processResults(data, valueFormat) {
  return Object.fromEntries(
    Object.entries(data).map(([label, value]) => [
      formatLabel(label, valueFormat),
      value,
    ])
  );
}

module.exports = (results, options) => {
  const {
    valueFormatterType = process.env.EDP_VALUE_FORMAT || "absolute-value",
  } = options || {};
  const { files, rules, summary } = formatter(results, { valueFormatterType });
  log("Enzyme deprecation progress", "Big");
  log("Files", "rectangles");
  visualizer(processResults(files, valueFormatterType));

  log("Rules", "rectangles");
  visualizer(processResults(rules, valueFormatterType));

  log("Summary", "rectangles");
  visualizer(processResults(summary, `${valueFormatterType}-summary`));
};
