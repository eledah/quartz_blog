// src/transformer.ts
var rtlScript = /[\u0590-\u08FF\uFB1D-\uFDFF\uFE70-\uFEFF\u{1E800}-\u{1EEFF}]/u;
var letter = /\p{Letter}/u;
function firstStrongDirection(text) {
  for (const character of text) {
    if (!letter.test(character)) continue;
    if (rtlScript.test(character)) return "rtl";
    return "ltr";
  }
  return "rtl";
}
function getTextContent(node) {
  return node.children.map((child) => {
    if (child.type === "text") return child.value;
    if (child.type === "element") {
      if (hasAuthorDirection(child) || ["bdi", "code", "pre", "time"].includes(child.tagName))
        return "";
      return getTextContent(child);
    }
    return "";
  }).join("");
}
function hasAuthorDirection(node) {
  return node.properties != null && "dir" in node.properties && node.properties.dir != null;
}
function getBlockquoteDirection(node) {
  const className = node.properties?.className;
  const classNames = Array.isArray(className) ? className.filter((value) => typeof value === "string") : typeof className === "string" ? className.split(/\s+/) : [];
  if (classNames.includes("english-blockquote")) return "ltr";
  if (classNames.includes("farsi-blockquote")) return "rtl";
  return null;
}
function isDirectionalBlock(node) {
  return node.tagName === "p" || /^h[1-6]$/.test(node.tagName);
}
function setDirection(node, direction) {
  node.properties = node.properties ?? {};
  node.properties.dir = direction;
}
function transformChildren(node, inheritedDirection) {
  for (const child of node.children) {
    if (child.type !== "element") continue;
    const explicitDirection = hasAuthorDirection(child);
    const blockquoteDirection = !explicitDirection && child.tagName === "blockquote" ? getBlockquoteDirection(child) : null;
    if (blockquoteDirection) setDirection(child, blockquoteDirection);
    const ownDirection = explicitDirection || blockquoteDirection !== null;
    const textContent = isDirectionalBlock(child) ? getTextContent(child) : "";
    const shouldInfer = !inheritedDirection && !ownDirection && isDirectionalBlock(child) && textContent.length > 0;
    if (shouldInfer) setDirection(child, firstStrongDirection(textContent));
    transformChildren(child, inheritedDirection || ownDirection || shouldInfer);
  }
}
var BidiText = () => {
  return {
    name: "BidiText",
    htmlPlugins() {
      return [
        () => (tree) => {
          transformChildren(tree, false);
        }
      ];
    }
  };
};
export {
  BidiText
};
