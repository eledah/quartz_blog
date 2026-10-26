import type { QuartzComponent, QuartzComponentConstructor } from "@quartz-community/types"

const PrintButton: QuartzComponent = ({ displayClass }) => (
  <div class={[displayClass, "print-actions"].filter(Boolean).join(" ")}>
    <button type="button" class="print-button" title="چاپ یا ذخیره به صورت PDF">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="1.75"
        stroke-linecap="round"
        stroke-linejoin="round"
        aria-hidden="true"
      >
        <path d="M6 9V3h12v6M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
        <path d="M6 14h12v7H6zM18 12h.01" />
      </svg>
      <span>چاپ</span>
    </button>
  </div>
)

PrintButton.css = `
.print-actions {
  display: flex;
  justify-content: flex-end;
  margin-block: 0 0.75rem;
}
.print-button {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  min-height: 2.75rem;
  padding: 0.5rem 0.85rem;
  border: 1px solid var(--surface-border);
  border-radius: var(--radius-control);
  background: var(--content-surface);
  color: var(--darkgray);
  font: inherit;
  cursor: pointer;
}
.print-button:hover {
  border-color: var(--secondary);
  color: var(--secondary);
}
`

// Delegation survives SPA navigation without accumulating per-page listeners.
PrintButton.afterDOMLoaded = `
document.addEventListener("click", (event) => {
  if (event.target instanceof Element && event.target.closest(".print-button")) {
    window.print();
  }
});
`

export default (() => PrintButton) satisfies QuartzComponentConstructor
