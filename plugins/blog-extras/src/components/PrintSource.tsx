import type { QuartzComponent, QuartzComponentConstructor } from "@quartz-community/types"
import { simplifySlug } from "@quartz-community/utils"

const PrintSource: QuartzComponent = ({ cfg, fileData }) => {
  if (!cfg.baseUrl || !fileData.slug) return null

  const base = cfg.baseUrl.replace(/^https?:\/\//, "").replace(/\/+$/, "")
  const slug = simplifySlug(fileData.slug)
  const url = `https://${base}/${slug}`

  return (
    <div class="print-source" dir="rtl">
      <span>منبع: {cfg.pageTitle}</span>
      <a href={url} dir="ltr">
        {url}
      </a>
    </div>
  )
}

PrintSource.css = `.print-source { display: none; }`

export default (() => PrintSource) satisfies QuartzComponentConstructor
