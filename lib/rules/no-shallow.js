"use strict";
const astUtils = require("ast-utils");

const resolveEnzymeIdentifierInScope = (scope, name) => {
  if (!scope) {
    return false;
  }
  const node = scope.set.get(name);
  if (node != null) {
    const nodeDef = node.defs[0];
    if (
      nodeDef.type === "ImportBinding" &&
      nodeDef.parent.source.value === "enzyme"
    ) {
      return true;
    }

    if (
      astUtils.isStaticRequire(nodeDef.node.init) &&
      astUtils.getRequireSource(nodeDef.node.init) === "enzyme"
    ) {
      return true;
    }
  }

  return false;
};

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
    schema: [
      {
        type: "object",
        properties: {
          resolveAsGlobal: {
            type: "boolean",
          },
        },
        additionalProperties: false,
      },
    ],
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
        if (isEnzyme || options.resolveAsGlobal) {
          context.report({ node, messageId: "noShallowCall" });
        }
      },
    };
  },
};
