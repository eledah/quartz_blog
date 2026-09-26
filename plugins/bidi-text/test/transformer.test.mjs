import assert from "node:assert/strict"
import test from "node:test"
import { BidiText } from "../dist/index.js"

const text = (value) => ({ type: "text", value })
const element = (tagName, children = [], properties) => ({
  type: "element",
  tagName,
  properties,
  children,
})

function transform(...children) {
  const tree = { type: "root", children }
  const [plugin] = BidiText().htmlPlugins()
  plugin()(tree)
  return tree
}

function direction(node) {
  return node.properties?.dir
}

test("preserves explicit direction on blocks and blockquotes", () => {
  const paragraph = element("p", [text("English فارسی")], { dir: "rtl" })
  const blockquote = element("blockquote", [element("p", [text("English فارسی")])], {
    dir: "auto",
    className: ["english-blockquote"],
  })

  transform(paragraph, blockquote)

  assert.equal(direction(paragraph), "rtl")
  assert.equal(direction(blockquote), "auto")
})

test("finds Persian after leading digits", () => {
  const paragraph = element("p", [text("123، فارسی")])
  transform(paragraph)
  assert.equal(direction(paragraph), "rtl")
})

test("uses the first strong Latin character in a mixed block", () => {
  const paragraph = element("p", [text("English فارسی")])
  transform(paragraph)
  assert.equal(direction(paragraph), "ltr")
})

test("recursively collects text from nested markup", () => {
  const paragraph = element("p", [
    text("123 "),
    element("em", [element("strong", [text("فارسی")])]),
  ])
  transform(paragraph)
  assert.equal(direction(paragraph), "rtl")
})

test("keeps neutral-only blocks at the Persian page default", () => {
  const paragraph = element("p", [text("123 … 👋")])
  transform(paragraph)
  assert.equal(direction(paragraph), "rtl")
})

test("honors blockquote direction classes", () => {
  const english = element("blockquote", [element("p", [text("فارسی")])], {
    className: ["english-blockquote"],
  })
  const farsi = element("blockquote", [element("p", [text("English")])], {
    className: "farsi-blockquote",
  })

  transform(english, farsi)

  assert.equal(direction(english), "ltr")
  assert.equal(direction(farsi), "rtl")
  assert.equal(direction(english.children[0]), undefined)
  assert.equal(direction(farsi.children[0]), undefined)
})

test("sets English and Persian heading directions independently", () => {
  const english = element("h2", [text("Release notes فارسی")])
  const farsi = element("h3", [text("یادداشت‌ها English")])
  transform(english, farsi)
  assert.equal(direction(english), "ltr")
  assert.equal(direction(farsi), "rtl")
})

test("isolated inline fragments do not set the surrounding direction", () => {
  const paragraph = element("p", [
    element("code", [text("const hello = 1")]),
    element("bdi", [text("English")]),
    element("span", [text("English")], { dir: "ltr" }),
    text(" فارسی"),
  ])
  transform(paragraph)
  assert.equal(direction(paragraph), "rtl")
})

test("does not add direction to semantic inline boundaries", () => {
  const code = element("code", [text("فارسی")])
  const time = element("time", [text("123")])
  const link = element("a", [text("English")], { href: "/english" })
  const paragraph = element("p", [code, time, text(" فارسی "), link])

  transform(paragraph)

  assert.equal(direction(paragraph), "rtl")
  assert.equal(direction(code), undefined)
  assert.equal(direction(time), undefined)
  assert.equal(direction(link), undefined)
})
