import * as Plugin from "./.quartz/plugins"
import type { QuartzPluginData } from "@quartz-community/types"
import { loadQuartzConfig, loadQuartzLayout } from "./quartz/plugins/loader/config-loader"

type FrontmatterWithDates = {
  title?: string
  draft?: boolean
  tags?: string[]
  date?: unknown
  modified?: unknown
  created?: unknown
  published?: unknown
}

function hasExplicitDate(file: QuartzPluginData): boolean {
  const fm = file.frontmatter as FrontmatterWithDates | undefined
  if (!fm) return false
  return fm.date != null || fm.modified != null || fm.created != null || fm.published != null
}

function getExplicitSortDate(file: QuartzPluginData): Date | undefined {
  const fm = file.frontmatter as FrontmatterWithDates | undefined
  if (!fm) return undefined
  const raw = fm.date ?? fm.modified ?? fm.published ?? fm.created
  if (raw == null) return undefined
  const d = new Date(raw as string | number)
  return Number.isNaN(d.getTime()) ? undefined : d
}

function hasTag(file: QuartzPluginData, tag: string): boolean {
  const tags = (file.frontmatter as FrontmatterWithDates | undefined)?.tags
  return Array.isArray(tags) && tags.includes(tag)
}

Plugin.Explorer({
  filterFn: (node) =>
    node.file?.frontmatter?.tags?.includes("explorerexclude") !== true,
})

Plugin.RecentNotes({
  hideFolderPages: true,
  hideTagPages: true,
  filter: (file: QuartzPluginData) => {
    if (file.slug === "index") return false
    if (file.frontmatter?.draft === true) return false
    if (hasTag(file, "explorerexclude")) return false
    return hasExplicitDate(file)
  },
  sort: (a: QuartzPluginData, b: QuartzPluginData) => {
    const da = getExplicitSortDate(a)
    const db = getExplicitSortDate(b)
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
