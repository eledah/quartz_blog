import type { PluggableList } from "unified"
import type { Element, Root as HastRoot } from "hast"
import type { QuartzTransformerPlugin } from "@quartz-community/types"

type Direction = "ltr" | "rtl"
type HastParent = HastRoot | Element

// These are the scripts whose letters have strong right-to-left direction. The
// letter check below deliberately excludes Arabic-Indic digits and punctuation
// that also live in some of these blocks.
const rtlScript = /[\u0590-\u08FF\uFB1D-\uFDFF\uFE70-\uFEFF\u{1E800}-\u{1EEFF}]/u
const letter = /\p{Letter}/u

function firstStrongDirection(text: string): Direction {
  for (const character of text) {
    if (!letter.test(character)) continue
    if (rtlScript.test(character)) return "rtl"
    return "ltr"
  }

  // This plugin is primarily used by Persian pages. Neutral-only blocks keep
  // that page-level default instead of becoming LTR because they start with a
  // number, punctuation mark, or emoji.
  return "rtl"
}

function getTextContent(node: HastParent): string {
  return node.children
    .map((child) => {
      if (child.type === "text") return child.value
      if (child.type === "element") {
        // Isolated or explicitly directed fragments should not determine the
        // surrounding paragraph's direction (notably leading inline code).
        if (hasAuthorDirection(child) || ["bdi", "code", "pre", "time"].includes(child.tagName))
          return ""
        return getTextContent(child)
      }
      return ""
    })
    .join("")
}

function hasAuthorDirection(node: Element): boolean {
  return node.properties != null && "dir" in node.properties && node.properties.dir != null
}

function getBlockquoteDirection(node: Element): Direction | null {
  const className: unknown = node.properties?.className
  const classNames = Array.isArray(className)
    ? className.filter((value): value is string => typeof value === "string")
    : typeof className === "string"
      ? className.split(/\s+/)
      : []

  if (classNames.includes("english-blockquote")) return "ltr"
  if (classNames.includes("farsi-blockquote")) return "rtl"
  return null
}

function isDirectionalBlock(node: Element): boolean {
  return node.tagName === "p" || /^h[1-6]$/.test(node.tagName)
}

function setDirection(node: Element, direction: Direction): void {
  node.properties = node.properties ?? {}
  node.properties.dir = direction
}

function transformChildren(node: HastParent, inheritedDirection: boolean): void {
  for (const child of node.children) {
    if (child.type !== "element") continue

    // An explicit dir always wins, including dir="auto". Blockquote classes
    // are an author-facing direction declaration as well.
    const explicitDirection = hasAuthorDirection(child)
    const blockquoteDirection =
      !explicitDirection && child.tagName === "blockquote" ? getBlockquoteDirection(child) : null

    if (blockquoteDirection) setDirection(child, blockquoteDirection)

    const ownDirection = explicitDirection || blockquoteDirection !== null
    const textContent = isDirectionalBlock(child) ? getTextContent(child) : ""
    const shouldInfer =
      !inheritedDirection && !ownDirection && isDirectionalBlock(child) && textContent.length > 0
    if (shouldInfer) setDirection(child, firstStrongDirection(textContent))

    // A direction on a parent is inherited by its contents. Do not add a
    // competing direction to descendants of an author-directed element (or a
    // class-directed blockquote). Semantic elements such as code, time, and a
    // are only traversed for text discovery; they are never modified.
    transformChildren(child, inheritedDirection || ownDirection || shouldInfer)
  }
}

export const BidiText: QuartzTransformerPlugin = () => {
  return {
    name: "BidiText",
    htmlPlugins(): PluggableList {
      return [
        () => (tree: HastRoot) => {
          transformChildren(tree, false)
        },
      ]
    },
  }
}
