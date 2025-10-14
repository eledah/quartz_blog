import { i18n } from "../../i18n"
import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "../types"

const NotFound: QuartzComponent = ({ cfg }: QuartzComponentProps) => {
  // If baseUrl contains a pathname after the domain, use this as the home link
  const url = new URL(`https://${cfg.baseUrl ?? "example.com"}`)
  const baseDir = url.pathname

  return (
    <article class="popover-hint">
      <h1>ول‌چرخیدن</h1>
      <img src="https://blog.eledah.ir/attachment/404.png"></img>
      <p>خوش به حال ما که هنوز که هنوز است به جایی نرسیده‌ایم که رسیدن، کیف جستجو را از سر می‌پرانَد. کسی که در قدم‌های اول راهش را پیدا کرده، یا خیالباف است یا راه دیگران ر ا می‌رود. حیف. من هم جزو خیالباف‌ها بودم. حالا از خیالات دست کشیدم. اوایلش گم شده بودم؛ اما الان مشغول ول‌چرخیدنم.</p>
    </article>
  )
}

export default (() => NotFound) satisfies QuartzComponentConstructor
