"use strict";
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
    return {
      "CallExpression:exit"(node) {
        if (
          node.callee.name !== "mount" &&
          node.callee.property?.name !== "mount"
        ) {
          return;
        }
        let targetDeclarationName = "mount";
        if (node.callee.property?.name === "mount") {
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
        if (isEnzyme || options.resolveAsGlobal) {
          context.report({ node, messageId: "noMountCall" });
        }
      },
    };
  },
};
