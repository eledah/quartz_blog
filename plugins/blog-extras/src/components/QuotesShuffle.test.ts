import assert from "node:assert/strict"
import { test } from "node:test"
import { runInNewContext } from "node:vm"
import { QuotesShuffle as QuotesShuffleConstructor } from "../../dist/components/index.js"

test("shuffle runs only when navigating to quotes", () => {
  const QuotesShuffle = QuotesShuffleConstructor()
  let listener: (event: { detail: { url: string } }) => void = () => assert.fail("No nav listener")
  let queried = 0
  runInNewContext(QuotesShuffle.afterDOMLoaded as string, {
    document: {
      addEventListener: (name: string, handler: typeof listener) => {
        assert.equal(name, "nav")
        listener = handler
      },
      querySelector: () => {
        queried++
        return null
      },
    },
    Math,
  })
  listener({ detail: { url: "other" } })
  assert.equal(queried, 0)
})

test("shuffles only direct blockquotes while preserving quote nodes, content, and other node positions", () => {
  const QuotesShuffle = QuotesShuffleConstructor()
  const children: any[] = []
  const content = {
    get children() {
      return children
    },
  }
  const quote = (text: string) => ({
    tagName: "BLOCKQUOTE",
    textContent: text,
    replaceWith(node: any) {
      const index = children.indexOf(this)
      children[index] = node
      if (node !== this) node.parent = content
    },
  })
  const nested = { tagName: "DIV" }
  const a = quote("A"),
    b = quote("B"),
    c = quote("C")
  children.push(a, { tagName: "BR" }, nested, b, { tagName: "BR" }, c)
  const originals = new Set([a, b, c])
  let handler: (event: { detail: { url: string } }) => void = () => {}
  runInNewContext(QuotesShuffle.afterDOMLoaded as string, {
    document: {
      addEventListener: (_name: string, callback: typeof handler) => {
        handler = callback
      },
      querySelector: (selector: string) => {
        assert.equal(selector, "article > .markdown-rendered")
        return content
      },
      createComment: () => ({
        tagName: "#comment",
        replaceWith(node: any) {
          const index = children.indexOf(this)
          children[index] = node
        },
      }),
    },
    Math: { floor: Math.floor, random: () => 0 },
  })
  handler({ detail: { url: "quotes" } })
  assert.deepEqual(
    children.filter((node) => node.tagName === "BR").map((node) => children.indexOf(node)),
    [1, 4],
  )
  assert.deepEqual(
    children.filter((node) => node === nested),
    [nested],
  )
  assert.deepEqual(new Set(children.filter((node) => originals.has(node))), originals)
  assert.deepEqual(
    children.filter((node) => originals.has(node)).map((node) => node.textContent),
    ["B", "C", "A"],
  )
  assert.ok(children.every((node) => node.tagName !== "#comment"))
})

test("repeated navigation and zero or one quote are safe", () => {
  const QuotesShuffle = QuotesShuffleConstructor()
  let handler: (event: { detail: { url: string } }) => void = () => {}
  const makeContent = (count: number) => {
    const children: any[] = []
    const content = { children }
    for (let i = 0; i < count; i++)
      children.push({
        tagName: "BLOCKQUOTE",
        replaceWith(node: any) {
          children[children.indexOf(this)] = node
        },
      })
    return { children, content }
  }
  let current = makeContent(0)
  runInNewContext(QuotesShuffle.afterDOMLoaded as string, {
    document: {
      addEventListener: (_name: string, callback: typeof handler) => {
        handler = callback
      },
      querySelector: () => current.content,
      createComment: () => ({
        replaceWith(node: any) {
          current.children[current.children.indexOf(this)] = node
        },
      }),
    },
    Math,
  })
  handler({ detail: { url: "quotes" } })
  current = makeContent(1)
  handler({ detail: { url: "quotes" } })
  handler({ detail: { url: "quotes" } })
  assert.equal(current.children.length, 1)
  assert.equal(current.children[0].tagName, "BLOCKQUOTE")
})
