import assert from "node:assert/strict"
import { test } from "node:test"
import { h } from "preact"
import { renderToString } from "preact-render-to-string"
import type { QuartzComponentProps } from "@quartz-community/types"
import { PrintSource as PrintSourceConstructor } from "../../dist/components/index.js"

function renderSource(slug: string, baseUrl: string | undefined = "blog.eledah.ir") {
  return renderToString(
    h(PrintSourceConstructor(), {
      cfg: { pageTitle: "کریستالین", baseUrl },
      fileData: { slug },
    } as QuartzComponentProps),
  )
}

test("print source includes site attribution and an isolated article URL", () => {
  const html = renderSource("expressions/gifts")
  assert.match(html, /منبع: کریستالین/)
  assert.match(html, /href="https:\/\/blog.eledah.ir\/expressions\/gifts"/)
  assert.match(html, /dir="ltr"/)
})

test("print source normalizes folder index slugs and configured base paths", () => {
  const html = renderSource("notes/index", "https://example.com/blog/")
  assert.match(html, /href="https:\/\/example.com\/blog\/notes\/"/)
  assert.doesNotMatch(html, /notes\/index/)
})

test("print source is omitted when no public base URL is configured", () => {
  assert.equal(renderSource("notes/test", ""), "")
})
