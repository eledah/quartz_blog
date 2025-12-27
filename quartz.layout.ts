import { PageLayout, SharedLayout } from "./quartz/cfg"
import * as Component from "./quartz/components"
import { QuartzPluginData } from "./quartz/plugins/vfile"
// import IndexPage from "./quartz/components/pages/IndexPage"

const recentNotesFilter = (f: QuartzPluginData): boolean => {
  const isIndex = f.slug === "index"
  const isDraft = f.frontmatter?.draft === true
  const hasExplorerExcludeTag = f.frontmatter?.tags?.includes("explorerexclude") === true
  // console.log(`Checking file: ${f.slug}, draft: ${f.frontmatter?.draft}, include: ${!isIndex && !isDraft}`)
  return !isIndex && !isDraft && !hasExplorerExcludeTag
}

// components shared across all pages
export const sharedPageComponents: SharedLayout = {
  head: Component.Head(),
  header: [],
  afterBody: [
    Component.Comments({
      provider: 'giscus',
      options: {
        // from data-repo
        repo: 'eledah/quartz_blog',
        // from data-repo-id
        repoId: 'R_kgDOLxbW_g',
        // from data-category
        category: 'Announcements',
        // from data-category-id
        categoryId: 'DIC_kwDOLxbW_s4ChRbJ',
      }
    }),
  ],
  footer: Component.Footer({
    links: {
      // "آپارات": "https://www.aparat.com/Crystalline",
      // "گیت‌هاب": "https://github.com/eledah",
    },
  }),
}

// components for pages that display a single page (e.g. a single note)
export const defaultContentPageLayout: PageLayout = {
  beforeBody: [
    Component.ConditionalRender({
      component: Component.Breadcrumbs(),
      condition: (page) => page.fileData.slug !== "index",
    }),
    Component.ArticleTitle(),
    Component.ContentMeta(),
    Component.TagList(),
  ],
  left: [
    // Component.DesktopOnly(Component.Sidenotes()),
    Component.DesktopOnly(Component.Graph()),
    Component.DesktopOnly(Component.Backlinks()),

    Component.MobileOnly(Component.PageTitle()),
    // Component.MobileOnly(Component.Search()),
  ],
  right: [
    Component.DesktopOnly(Component.PageTitle()),
    Component.DesktopOnly(Component.Darkmode()),
    Component.DesktopOnly(Component.Search()),
    // Component.DesktopOnly(Component.Explorer({
    //   filterFn: (node) => {
    //     // exclude files with the tag "explorerexclude"
    //     return node.file?.frontmatter?.tags?.includes("explorerexclude") !== true
    //   },
    // })),
    Component.DesktopOnly(Component.TableOfContents()),
    Component.MobileOnly(Component.Backlinks()),
  ],
}

// components for the index page specifically (with featured cards)
export const indexPageLayout: PageLayout = {
  beforeBody: [
    Component.ArticleTitle(),
    Component.ContentMeta(),
    Component.TagList(),
  ],
  left: [
    Component.DesktopOnly(Component.Graph()),
    Component.DesktopOnly(Component.Backlinks()),
    Component.MobileOnly(Component.PageTitle()),
    Component.MobileOnly(Component.Darkmode()),
  ],
  right: [
    Component.DesktopOnly(Component.PageTitle()),
    Component.DesktopOnly(Component.Darkmode()),
    Component.DesktopOnly(Component.Search()),
    Component.DesktopOnly(Component.RecentNotes({
      limit: 3,
      filter: recentNotesFilter
    })),
    Component.DesktopOnly(Component.TableOfContents()),
    Component.MobileOnly(Component.Backlinks()),
  ],
}

// components for pages that display lists of pages  (e.g. tags or folders)
export const defaultListPageLayout: PageLayout = {
  beforeBody: [Component.Breadcrumbs(), Component.ArticleTitle(), Component.ContentMeta()],
  left: [
    Component.MobileOnly(Component.PageTitle()),
  ],
  right: [
    Component.DesktopOnly(Component.PageTitle()),
    Component.DesktopOnly(Component.Darkmode()),
    Component.Search(),
    Component.DesktopOnly(Component.Explorer({
      filterFn: (node) => node.slugSegment !== "explorerexclude",
    })),
  ],
}