const { ESLint } = require("eslint");
const glob = require("glob");
const enzymeDeprecate = require("../lib");
const path = require("path");

const getTestFiles = async (pathPattern) => {
  return new Promise((resolve, reject) => {
    glob(pathPattern, (error, files) => {
      if (error) {
        return reject(error);
      }
      resolve(files);
    });
  });
};

(async function main() {
  // 1. Create an instance with the `fix` option.
  const eslint = new ESLint({
    fix: false,
    useEslintrc: false,
    baseConfig: {
      env: {
        es6: true,
        node: true,
      },
      parserOptions: {
        ecmaVersion: 2020,
        ecmaFeatures: {
          impliedStrict: true,
          jsx: true,
        },
      },
      plugins: ["enzyme-deprecation"],
      rules: {
        "enzyme-deprecation/no-shallow": "error",
        "enzyme-deprecation/no-mount": "error",
      },
    },
    plugins: {
      "enzyme-deprecation": enzymeDeprecate,
    },
  });

  const files = await getTestFiles("examples/**/*.test.{js,jsx}");

  // 2. Lint files. This doesn't modify target files.
  const results = await eslint.lintFiles(files);

  // 3. Format the results.
  const formatter = await eslint.loadFormatter(
    path.resolve(__dirname, "../lib/formatter")
  );
  formatter.format(results, {
    showAllFiles: true,
    valueFormatterType: "percentage",
  });
})().catch((error) => {
  process.exitCode = 1;
  console.error(error);
});
