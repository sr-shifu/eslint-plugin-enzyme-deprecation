const formatter = require("./dataFormatter");
const visualizer = require("./dataVisualizer");
const log = require("./terminalLogger");

module.exports = (results, options) => {
  const { files, rules, summary } = formatter(results, options);
  log("Enzyme deprecation progress", "Big");
  log("Files", "rectangles");
  visualizer(files);

  log("Rules", "rectangles");
  visualizer(rules);

  log("Summary", "rectangles");
  visualizer(summary);
};
