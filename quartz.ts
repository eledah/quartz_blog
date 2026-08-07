import type { QuartzPluginData } from "@quartz-community/types"
import { loadQuartzConfig, loadQuartzLayout } from "./quartz/plugins/loader/config-loader"
import { componentRegistry } from "./quartz/components/registry"

type FrontmatterWithDates = {
  title?: string
  draft?: boolean
  tags?: string[]
  date?: unknown
}

function hasDateMetadata(file: QuartzPluginData): boolean {
  const fm = file.frontmatter as FrontmatterWithDates | undefined
  return fm?.date != null
}

function getSortDate(file: QuartzPluginData): Date | undefined {
  const raw = (file.frontmatter as FrontmatterWithDates | undefined)?.date
  if (raw == null) return undefined
  const d = new Date(raw as string | number)
  return Number.isNaN(d.getTime()) ? undefined : d
}

function hasTag(file: QuartzPluginData, tag: string): boolean {
  const tags = (file.frontmatter as FrontmatterWithDates | undefined)?.tags
  return Array.isArray(tags) && tags.includes(tag)
}

componentRegistry.setOptionOverrides("explorer", {
  filterFn: (node: { slugSegment?: string; data?: { tags?: string[] } | null }) => {
    if (node.slugSegment === "tags") return false
    return node.data?.tags?.includes("explorerexclude") !== true
  },
})

componentRegistry.setOptionOverrides("recent-notes", {
  hideFolderPages: true,
  hideTagPages: true,
  filter: (file: QuartzPluginData) => {
    if (file.slug === "index") return false
    if (file.frontmatter?.draft === true) return false
    if (hasTag(file, "explorerexclude")) return false
    return hasDateMetadata(file)
  },
  sort: (a: QuartzPluginData, b: QuartzPluginData) => {
    const da = getSortDate(a)
    const db = getSortDate(b)
    if (da && db) return db.getTime() - da.getTime()
    if (da) return -1
    if (db) return 1
    const titleA = String(a.frontmatter?.title ?? "")
    const titleB = String(b.frontmatter?.title ?? "")
    return titleA.localeCompare(titleB, "fa")
  },
})

const config = await loadQuartzConfig()
export default config
export const layout = await loadQuartzLayout()
