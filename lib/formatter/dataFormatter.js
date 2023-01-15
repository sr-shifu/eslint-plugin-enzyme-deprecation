const formatter = require(".");

const PLUGIN_NAME = "enzyme-deprecation";

function longestCommonPrefixPath(paths = []) {
  if (paths.length < 2) return "";

  let prefix = paths[0];
  for (let i = 1; i < paths.length; i++) {
    while (paths[i].indexOf(prefix) !== 0) {
      prefix = prefix.substring(0, prefix.length - 1);
      if (prefix.length === 0) return "";
    }
  }
  return prefix;
}

function getValueFormatter(formatter) {
  switch (formatter) {
    case "percentage":
      return (value, sum) => (value / sum * 100).toFixed(2);
    case "absolute-value":
    default:
      return (value) => value;
  }
}

module.exports = (data, options = {}) => {
  const { showAllFiles = false, valueFormatterType = "absolute-value" } =
    options;
  const valueFormatter = getValueFormatter(valueFormatterType);
  let total = 0;
  const table = data.reduce(
    (acc, result) => {
      acc.files[result.filePath] = result.messages.length;
      result.messages.forEach((message) => {
        const ruleId = message.ruleId || "unknown";
        acc.rules[ruleId] = (acc.rules[ruleId] || 0) + 1;
      });
      total += result.messages.length;
      return acc;
    },
    { files: {}, rules: {} }
  );

  const filePaths = Object.keys(table.files);
  const commonPrefixPath = longestCommonPrefixPath(filePaths);
  const violatedFiles = filePaths.filter((path) => table.files[path] > 0);
  return {
    rules: Object.fromEntries(
      Object.entries(table.rules).map(([ruleName, msgCount]) => [
        ruleName.replace(`${PLUGIN_NAME}/`, ""),
        valueFormatter(msgCount, total),
      ])
    ),
    files: (showAllFiles ? filePaths : violatedFiles).reduce(
      (acc, filePath) => {
        return Object.assign(acc, {
          [filePath.replace(commonPrefixPath, "")]: valueFormatter(
            table.files[filePath],
            total
          ),
        });
      },
      {}
    ),
    summary: {
      "Files to migrate": valueFormatter(
        violatedFiles.length,
        filePaths.length
      ),
      "Files good-to-go": valueFormatter(
        filePaths.length - violatedFiles.length,
        filePaths.length
      ),
    },
  };
};
