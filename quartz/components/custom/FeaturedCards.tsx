import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "../types"
import { resolveRelative } from "../../util/path"

const FeaturedCards: QuartzComponent = ({ allFiles }: QuartzComponentProps) => {
  const featuredPages = allFiles
    .filter((file) => file.frontmatter?.featured)
    .sort((a, b) => {
      const orderA = (a.frontmatter?.order as number | undefined) ?? Infinity
      const orderB = (b.frontmatter?.order as number | undefined) ?? Infinity

      if (orderA !== orderB) {
        return orderA - orderB
      }

      // Fallback: sort by date (newest first) if order is same or missing
      const dateA = new Date((a.frontmatter?.date as string | number | Date) ?? 0).getTime()
      const dateB = new Date((b.frontmatter?.date as string | number | Date) ?? 0).getTime()
      return dateB - dateA
    })
    .slice(0, 4)

  return (
    <div className="card-grid">
      {featuredPages.map((page) => {
        const { title, description, image } = page.frontmatter!
        const cardStyle = image ? { "--card-bg": `url(${image})` } : {}

        return (
          <a href={resolveRelative(page.slug!, page.slug!)} className={`card-container ${image ? "has-image" : "no-image"}`} style={cardStyle}>
            <div className="card-bg"></div>
            <div className="card-content">
              <h3>{title}</h3>
              <p>{description as string}</p>
            </div>
          </a>
        )
      })}
    </div>
  )
}

export default (() => FeaturedCards) satisfies QuartzComponentConstructor