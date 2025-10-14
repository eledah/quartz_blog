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
      {content}
    </article>
  )
}

export default (() => IndexPage) satisfies QuartzComponentConstructor