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

module.exports = resolveEnzymeIdentifierInScope;
