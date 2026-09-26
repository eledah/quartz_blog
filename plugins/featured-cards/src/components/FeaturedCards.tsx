import type {
  QuartzComponent,
  QuartzComponentConstructor,
  QuartzComponentProps,
} from "@quartz-community/types"
import { resolveRelative } from "../util/path"
import styles from "./styles/featuredCards.scss"

const FeaturedCards: QuartzComponent = ({ allFiles, fileData }: QuartzComponentProps) => {
  if (fileData.slug !== "index") {
    return null
  }

  const featuredPages = allFiles
    .filter((file) => file.frontmatter?.featured)
    .sort((a, b) => {
      const orderA = (a.frontmatter?.order as number | undefined) ?? Infinity
      const orderB = (b.frontmatter?.order as number | undefined) ?? Infinity

      if (orderA !== orderB) {
        return orderA - orderB
      }

      const dateA = new Date((a.frontmatter?.date as string | number | Date) ?? 0).getTime()
      const dateB = new Date((b.frontmatter?.date as string | number | Date) ?? 0).getTime()
      return dateB - dateA
    })
    .slice(0, 4)

  return (
    <>
      <h2 class="featured-cards-title">🎁 یادداشت‌های انتخابی</h2>
      <div class="card-grid-container">
        <div class="card-grid">
          {featuredPages.map((page) => {
            const { title, description, image } = page.frontmatter!
            const cardStyle = image ? { "--card-bg": `url(${image})` } : {}

            return (
              <a
                href={resolveRelative(fileData.slug!, page.slug!)}
                class={`card-container ${image ? "has-image" : "no-image"}`}
                style={cardStyle}
              >
                <div class="card-bg"></div>
                <div class="card-content">
                  <h3>{title}</h3>
                  <p>{description as string}</p>
                </div>
              </a>
            )
          })}
        </div>
      </div>
    </>
  )
}

FeaturedCards.css = styles

export default (() => FeaturedCards) satisfies QuartzComponentConstructor
