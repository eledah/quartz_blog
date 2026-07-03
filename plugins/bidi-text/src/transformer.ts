import type { PluggableList } from "unified"
import type { Root as HastRoot, Element, Literal } from "hast"
import { visit } from "unist-util-visit"
import type { QuartzTransformerPlugin } from "@quartz-community/types"

const farsiRange = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/
const skipChars =
  /[\p{Emoji_Presentation}\p{Extended_Pictographic}\s\-\[\]{}\/\\#=@!*_\u200D(){}[\].,:»«]/u

function isFarsi(text: string): boolean {
  for (const char of text) {
    if (skipChars.test(char)) {
      continue
    }
    return farsiRange.test(char)
  }
  return false
}

function getTextContent(node: Element): string {
  return node.children
    .map((child) => {
      if (child.type === "text") return child.value
      if (child.type === "element") {
        return (child as Element).children
          .map((c) => (c.type === "text" ? (c as Literal).value : ""))
          .join("")
      }
      return ""
    })
    .join("")
}

export const BidiText: QuartzTransformerPlugin = () => {
  return {
    name: "BidiText",
    htmlPlugins(): PluggableList {
      return [
        () => (tree: HastRoot) => {
          visit(tree, "element", (node: Element) => {
            if (node.tagName === "p" || /^h[1-6]$/.test(node.tagName)) {
              const textContent = getTextContent(node)
              if (textContent.length > 0) {
                node.properties = node.properties || {}
                node.properties.dir = isFarsi(textContent) ? "rtl" : "ltr"
              }
            }
          })
        },
      ]
    },
  }
}
