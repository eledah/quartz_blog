import assert from "node:assert/strict"
import { test } from "node:test"
import { runInNewContext } from "node:vm"
import { h } from "preact"
import { renderToString } from "preact-render-to-string"
import type { QuartzComponentProps } from "@quartz-community/types"
import { PrintButton as PrintButtonConstructor } from "../../dist/components/index.js"

test("print button has a visible Persian label and native button semantics", () => {
  const PrintButton = PrintButtonConstructor()
  const html = renderToString(h(PrintButton, {} as QuartzComponentProps))
  assert.match(html, /type="button"/)
  assert.match(html, /<span>چاپ<\/span>/)
  assert.match(html, /aria-hidden="true"/)
})

test("delegated print handler supports replaced SPA buttons and ignores unrelated clicks", () => {
  const PrintButton = PrintButtonConstructor()
  let click: (event: { target: unknown }) => void = () => assert.fail("No click handler")
  let calls = 0
  let listeners = 0
  class Element {
    constructor(private isPrintButton: boolean) {}
    closest(selector: string) {
      assert.equal(selector, ".print-button")
      return this.isPrintButton ? this : null
    }
  }
  const script = PrintButton.afterDOMLoaded
  assert.equal(typeof script, "string")
  runInNewContext(script as string, {
    Element,
    document: {
      addEventListener: (event: string, handler: typeof click) => {
        assert.equal(event, "click")
        click = handler
        listeners++
      },
    },
    window: { print: () => calls++ },
  })
  click({ target: new Element(true) })
  click({ target: new Element(false) })
  click({ target: null })
  // A new element represents a button inserted by SPA navigation.
  click({ target: new Element(true) })
  assert.equal(calls, 2)
  assert.equal(listeners, 1)
})
