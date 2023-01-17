const astUtils = require("ast-utils");

const matchSource = (source, sourcesToMatch) => {
  for (const sourceToMatch of sourcesToMatch) {
    if (
      typeof sourceToMatch === "string" &&
      (source == sourceToMatch || new RegExp(sourceToMatch, "ig").test(source))
    ) {
      return sourceToMatch;
    }
    if (sourceToMatch instanceof RegExp && sourceToMatch.test(source)) {
      return sourceToMatch;
    }
  }
};

const resolveEnzymeIdentifierInScope = (
  name,
  scope,
  includeSourcePaths = ["enzyme"]
) => {
  if (!scope) {
    return false;
  }
  const node = scope.set.get(name);
  if (node != null) {
    const nodeDef = node.defs[0];
    if (
      nodeDef.type === "ImportBinding" &&
      !!matchSource(nodeDef.parent.source.value, includeSourcePaths)
    ) {
      return true;
    }

    if (
      astUtils.isStaticRequire(nodeDef.node.init) &&
      !!matchSource(
        astUtils.getRequireSource(nodeDef.node.init),
        includeSourcePaths
      )
    ) {
      return true;
    }
  }

  return false;
};

module.exports = resolveEnzymeIdentifierInScope;
