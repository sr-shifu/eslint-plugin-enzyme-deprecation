const resolveEnzymeIdentifierInScope = require("./utils/resolve-enzyme-source");
const schema = require("./schema");

module.exports = {
  meta: {
    messages: {
      noMountCall: "Enzyme is deprecated: do not use mount API.",
    },
    docs: {
      description: "Disallow Enzyme mount rendering",
      category: "Tests",
      recommended: true,
    },
    schema,
    fixable: null,
  },

  create(context) {
    const [options = {}] = context.options || [];
    const [...resolveIdentifiers] = options.resolveAs || [];
    resolveIdentifiers.push({ name: "mount", source: ["enzyme"] });
    return {
      "CallExpression:exit"(node) {
        const target = resolveIdentifiers.find(
          ({ name }) =>
            name === node.callee.name || name === node.callee.property?.name
        );
        if (!target) {
          return;
        }
        const { name, sources } = target;
        let targetDeclarationName = name;
        if (node.callee.property?.name === targetDeclarationName) {
          targetDeclarationName = node.callee.object.name;
        }
        const resolved = context
          .getScope()
          .references.find(
            ({ identifier }) => identifier.name === targetDeclarationName
          )?.resolved;
        const isEnzyme =
          resolved == null || resolved.scope.type === "global"
            ? options.implicitlyGlobal
            : resolveEnzymeIdentifierInScope(
                targetDeclarationName,
                resolved.scope,
                sources
              );
        if (isEnzyme) {
          context.report({ node, messageId: "noMountCall" });
        }
      },
    };
  },
};
