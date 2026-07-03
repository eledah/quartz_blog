// src/transformer.ts
import { visit } from "unist-util-visit";
var farsiRange = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/;
var skipChars = /[\p{Emoji_Presentation}\p{Extended_Pictographic}\s\-\[\]{}\/\\#=@!*_\u200D(){}[\].,:»«]/u;
function isFarsi(text) {
  for (const char of text) {
    if (skipChars.test(char)) {
      continue;
    }
    return farsiRange.test(char);
  }
  return false;
}
function getTextContent(node) {
  return node.children.map((child) => {
    if (child.type === "text") return child.value;
    if (child.type === "element") {
      return child.children.map((c) => c.type === "text" ? c.value : "").join("");
    }
    return "";
  }).join("");
}
var BidiText = () => {
  return {
    name: "BidiText",
    htmlPlugins() {
      return [
        () => (tree) => {
          visit(tree, "element", (node) => {
            if (node.tagName === "p" || /^h[1-6]$/.test(node.tagName)) {
              const textContent = getTextContent(node);
              if (textContent.length > 0) {
                node.properties = node.properties || {};
                node.properties.dir = isFarsi(textContent) ? "rtl" : "ltr";
              }
            }
          });
        }
      ];
    }
  };
};
export {
  BidiText
};
