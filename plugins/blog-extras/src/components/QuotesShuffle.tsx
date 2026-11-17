import type { QuartzComponent, QuartzComponentConstructor } from "@quartz-community/types"

const QuotesShuffle: QuartzComponent = () => null

QuotesShuffle.afterDOMLoaded = `
document.addEventListener("nav", (event) => {
  if (event.detail.url !== "quotes") return;

  const content = document.querySelector("article > .markdown-rendered");
  if (!content) return;

  const quotes = Array.from(content.children).filter((child) => child.tagName === "BLOCKQUOTE");
  // Replace quote positions only, leaving every intervening node (including <br>s) in place.
  const placeholders = quotes.map((quote) => {
    const placeholder = document.createComment("quote-position");
    quote.replaceWith(placeholder);
    return placeholder;
  });
  for (let i = quotes.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [quotes[i], quotes[j]] = [quotes[j], quotes[i]];
  }
  placeholders.forEach((placeholder, index) => placeholder.replaceWith(quotes[index]));
});
`

export default (() => QuotesShuffle) satisfies QuartzComponentConstructor
