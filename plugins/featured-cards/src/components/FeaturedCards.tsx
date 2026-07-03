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

  const handleMouseMove = (e: MouseEvent) => {
    const card = e.currentTarget as HTMLAnchorElement
    card.classList.remove("card-tilt-reset")
    const rect = card.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const centerX = rect.width / 2
    const centerY = rect.height / 2
    const rotateX = (y - centerY) / 10
    const rotateY = (centerX - x) / 10

    card.style.setProperty("transform", `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`, "important")
  }

  const handleMouseLeave = (e: MouseEvent) => {
    const card = e.currentTarget as HTMLAnchorElement
    card.classList.add("card-tilt-reset")
    card.style.setProperty("transform", "rotateX(0deg) rotateY(0deg)", "important")
  }

  return (
    <>
      <h2 class="featured-cards-title">🎁 یادداشت‌های انتخابی</h2>
      <div class="card-grid">
        {featuredPages.map((page) => {
          const { title, description, image } = page.frontmatter!
          const cardStyle = image ? { "--card-bg": `url(${image})` } : {}

          return (
            <a
              href={resolveRelative(fileData.slug!, page.slug!)}
              class={`card-container ${image ? "has-image" : "no-image"}`}
              style={cardStyle}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
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
    </>
  )
}

FeaturedCards.css = styles

export default (() => FeaturedCards) satisfies QuartzComponentConstructor
