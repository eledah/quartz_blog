import type {
  QuartzComponent,
  QuartzComponentConstructor,
  QuartzComponentProps,
} from "@quartz-community/types"
import { iconPath, pathToRoot } from "../util/path"

function classNames(...parts: (string | undefined)[]): string {
  return parts.filter(Boolean).join(" ")
}

const PageTitle: QuartzComponent = ({ fileData, cfg, displayClass }: QuartzComponentProps) => {
  const title = cfg?.pageTitle ?? "کریستالین"
  const slug = fileData.slug === "404" ? "index" : fileData.slug!
  const baseDir = pathToRoot(slug)
  const homeHref = baseDir === "." ? "/" : baseDir

  return (
    <div class="page-title-container">
      <h1 class={classNames(displayClass, "page-title")}>
        <div class="title-logo">
          <a href={homeHref}>
            <img id="icon-header" src={iconPath(slug)} alt="" />
          </a>
          <a href={homeHref} class={displayClass} id="header-text">
            {title}
          </a>
        </div>
      </h1>
    </div>
  )
}

PageTitle.css = `
.page-title-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  width: 100%;
}

.page-title {
  font-size: 1.75rem;
  margin: 0;
  font-family: var(--titleFont);
  width: 100%;
}

.title-logo {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
}

#header-text {
  text-decoration: none;
  color: var(--secondary);
  transition: color 0.2s ease;

  &:hover {
    color: var(--tertiary);
  }
}
`

export default (() => PageTitle) satisfies QuartzComponentConstructor
