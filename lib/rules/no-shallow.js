"use strict";
const resolveEnzymeIdentifierInScope = require("./utils/resolve-enzyme-source");
const schema = require("./schema");

module.exports = {
  meta: {
    messages: {
      noShallowCall: "Enzyme is deprecated: do not use shallow API.",
    },
    docs: {
      description: "Disallow Enzyme shallow rendering",
      category: "Tests",
      recommended: true,
    },
    schema,
    fixable: null,
  },

  create(context) {
    const [options = {}] = context.options || [];
    return {
      "CallExpression:exit"(node) {
        if (
          node.callee.name !== "shallow" &&
          node.callee.property?.name !== "shallow"
        ) {
          return;
        }
        let targetDeclarationName = "shallow";
        if (node.callee.property?.name === "shallow") {
          targetDeclarationName = node.callee.object.name;
        }
        const resolved = context
          .getScope()
          .references.find(
            ({ identifier }) => identifier.name === targetDeclarationName
          ).resolved;
        const isEnzyme = resolveEnzymeIdentifierInScope(
          resolved?.scope,
          targetDeclarationName
        );
        if (isEnzyme || options.implicitlyGlobal) {
          context.report({ node, messageId: "noShallowCall" });
        }
      },
    };
  },
};
