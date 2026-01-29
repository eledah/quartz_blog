import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"

const FeaturedImage: QuartzComponent = ({ fileData }: QuartzComponentProps) => {
  const image = fileData.frontmatter?.image as string | undefined

  if (!image) {
    return null
  }

  return (
    <div class="featured-image-container">
      <img src={image} alt={fileData.frontmatter?.title as string ?? "Featured image"} />
    </div>
  )
}

FeaturedImage.css = `
  .featured-image-container {
    width: 100%;
    height: 300px;
    margin-bottom: 2rem;
    overflow: hidden;
    border-radius: 12px;
  }

  .featured-image-container img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center;
    display: block;
  }
`

export default (() => FeaturedImage) satisfies QuartzComponentConstructor
