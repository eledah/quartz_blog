import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "../types"

const NotFound: QuartzComponent = ({ cfg, ctx }: QuartzComponentProps) => {
  const url = new URL(`https://${cfg.baseUrl ?? "example.com"}`)
  const baseDir = ctx.argv.serve ? "/" : url.pathname

  return (
    <article class="popover-hint">
      <h1>ول‌چرخیدن</h1>
      <img src="https://blog.eledah.ir/attachment/404.png" alt="" />
      <p>
        خوش به حال ما که هنوز که هنوز است به جایی نرسیده‌ایم که رسیدن، کیف جستجو را از سر
        می‌پرانَد. کسی که در قدم‌های اول راهش را پیدا کرده، یا خیالباف است یا راه دیگران را
        می‌رود. حیف. من هم جزو خیالباف‌ها بودم. حالا از خیالات دست کشیدم. اوایلش گم شده بودم؛
        اما الان مشغول ول‌چرخیدنم.
      </p>
      <a href={baseDir}>بازگشت به خانه</a>
      <script
        dangerouslySetInnerHTML={{
          __html: `
          if (typeof fetchData !== "undefined") {
            fetchData.then(function(index) {
              var basePath = document.body.dataset.basepath || "";
              if (basePath.length > 1 && basePath.endsWith("/")) {
                basePath = basePath.slice(0, -1);
              }
              var pathname = window.location.pathname;
              var hasBasePrefix = basePath.length > 1 && pathname.startsWith(basePath);
              if (hasBasePrefix) {
                pathname = pathname.slice(basePath.length);
              }
              if (pathname.startsWith("/")) {
                pathname = pathname.slice(1);
              }
              if (pathname.endsWith("/")) {
                pathname = pathname.slice(0, -1);
              }
              if (pathname.endsWith(".html")) {
                pathname = pathname.slice(0, -5);
              }
              if (pathname.endsWith("/index")) {
                pathname = pathname.slice(0, -6);
              }
              var lowered = pathname.toLowerCase();
              if (lowered !== pathname && index[lowered] != null) {
                var prefix = hasBasePrefix ? basePath : "";
                var target = prefix + (prefix.endsWith("/") ? "" : "/") + lowered;
                window.location.replace(target);
              }
            });
          }
          `,
        }}
      />
    </article>
  )
}

export default (() => NotFound) satisfies QuartzComponentConstructor
