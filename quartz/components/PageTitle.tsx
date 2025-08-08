import { pathToRoot } from "../util/path"
import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { classNames } from "../util/lang"
import { i18n } from "../i18n"

const PageTitle: QuartzComponent = ({ fileData, cfg, displayClass }: QuartzComponentProps) => {
  const title = cfg?.pageTitle ?? i18n(cfg.locale).propertyDefaults.title
  const baseDir = pathToRoot(fileData.slug!)
  return (
    <h1 class={classNames(displayClass, "page-title")}>
      <div class="title-logo">
        <a href={baseDir}><img id='icon-header' src={"https://blog.eledah.ir/static/icon-header.png"} alt="" /></a>
        <a href={baseDir} class={displayClass} id="header-text">
          {title}
        </a>
      </div>
    </h1>
  )
}

PageTitle.css = `
.page-title {
  font-size: 1.75rem;
  margin: 0;
  font-family: var(--titleFont);
}
.title-logo {
  display: flex;
  align-items: center;
  gap: 1rem;
}
`

export default (() => PageTitle) satisfies QuartzComponentConstructor
