import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "../types"
import { resolveRelative } from "../../util/path"

const FeaturedCards: QuartzComponent = ({ allFiles }: QuartzComponentProps) => {
  const featuredPages = allFiles.filter((file) => file.frontmatter?.featured)

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