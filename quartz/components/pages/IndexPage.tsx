import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "../types"
import { htmlToJsx } from "../../util/jsx"
import FeaturedCards from "../custom/FeaturedCards"

const IndexPage: QuartzComponent = ({ fileData, tree, ...props }: QuartzComponentProps) => {
  const content = htmlToJsx(fileData.filePath!, tree)
  const classes: string[] = fileData.frontmatter?.cssclasses ?? []
  const classString = ["popover-hint", ...classes].join(" ")
  
  const FeaturedCardsComponent = FeaturedCards()
  
  return (
    <article class={classString}>
      <h1 className="featured-cards-title">🎁 یادداشت‌های انتخابی</h1>
      <FeaturedCardsComponent {...props} fileData={fileData} tree={tree} />
      
      {/* Section Divider (Feature G) */}
      <div className="section-divider">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 100" preserveAspectRatio="none">
          <path fill="currentColor" fill-opacity="0.05" d="M0,32L48,37.3C96,43,192,53,288,58.7C384,64,480,64,576,53.3C672,43,768,21,864,16C960,11,1056,21,1152,32C1248,43,1344,53,1392,58.7L1440,64L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z"></path>
        </svg>
      </div>

      {content}
    </article>
  )
}

export default (() => IndexPage) satisfies QuartzComponentConstructor