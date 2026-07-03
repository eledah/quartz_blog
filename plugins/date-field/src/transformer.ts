import type { QuartzTransformerPlugin } from "@quartz-community/types"
import type { Root } from "mdast"
import type { VFile } from "vfile"

type FrontmatterDates = {
  date?: unknown
  modified?: unknown
}

/**
 * Blog posts use `date:` in frontmatter, but CreatedModifiedDate only reads
 * created/modified/published. Copy date → modified before that plugin runs.
 */
export const DateField: QuartzTransformerPlugin = () => {
  return {
    name: "DateField",
    markdownPlugins() {
      return [
        () => async (_tree: Root, file: VFile) => {
          const data = file.data as { frontmatter?: FrontmatterDates }
          const fm = data.frontmatter
          if (!fm?.date || fm.modified != null) return
          fm.modified = fm.date
        },
      ]
    },
  }
}
