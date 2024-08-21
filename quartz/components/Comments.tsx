import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"

type Options = {
  provider: "giscus"
  options: {
    repo: `${string}/${string}`
    repoId: string
    category: string
    categoryId: string
    mapping?: "url" | "title" | "og:title" | "specific" | "number" | "pathname"
    strict?: boolean
    reactionsEnabled?: boolean
    inputPosition?: "top" | "bottom"
  }
}

function boolToStringBool(b: boolean): string {
  return b ? "1" : "0"
}

export default ((opts: Options) => {
  const Comments: QuartzComponent = ({ fileData }: QuartzComponentProps) => {
    if (fileData.slug === "index") {
      return <></>
    }
    return <div class="giscus"></div>
  }

  Comments.afterDOMLoaded = `
    function getThemeUrl(theme) {
      return \`https://cdn.jsdelivr.net/gh/eledah/quartz_blog/quartz/static/giscus-\${theme}.css\`
    }

    function getCurrentTheme() {
      return document.documentElement.getAttribute("saved-theme") || "light"
    }

    const changeTheme = (theme) => {
      const iframe = document.querySelector('iframe.giscus-frame')
      if (!iframe) return

      iframe.contentWindow.postMessage({
        giscus: {
          setConfig: {
            theme: getThemeUrl(theme)
          }
        }
      }, 'https://giscus.app')
    }

    function loadComments() {
      const giscusContainer = document.querySelector(".giscus")
      if (giscusContainer.hasChildNodes()) return

      const giscusScript = document.createElement("script")
      giscusScript.src = "https://giscus.app/client.js"
      giscusScript.async = true
      giscusScript.crossOrigin = "anonymous"
      giscusScript.setAttribute("data-loading", "lazy")
      giscusScript.setAttribute("data-emit-metadata", "0")
      giscusScript.setAttribute("data-repo", "${opts.options.repo}")
      giscusScript.setAttribute("data-repo-id", "${opts.options.repoId}")
      giscusScript.setAttribute("data-category", "${opts.options.category}")
      giscusScript.setAttribute("data-category-id", "${opts.options.categoryId}")
      giscusScript.setAttribute("data-mapping", "${opts.options.mapping ?? "url"}")
      giscusScript.setAttribute("data-strict", "${boolToStringBool(opts.options.strict ?? true)}")
      giscusScript.setAttribute("data-reactions-enabled", "${boolToStringBool(opts.options.reactionsEnabled ?? true)}")
      giscusScript.setAttribute("data-input-position", "${opts.options.inputPosition ?? "bottom"}")

      const currentTheme = getCurrentTheme()
      giscusScript.setAttribute("data-theme", getThemeUrl(currentTheme))
      giscusScript.setAttribute("data-lang", "fa")
      giscusContainer.appendChild(giscusScript)
    }

    document.addEventListener("nav", loadComments)
    
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === "attributes" && mutation.attributeName === "saved-theme") {
          const newTheme = getCurrentTheme()
          changeTheme(newTheme)
        }
      })
    })

    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["saved-theme"] })

    window.addCleanup(() => {
      document.removeEventListener("nav", loadComments)
      observer.disconnect()
    })
  `

  return Comments
}) satisfies QuartzComponentConstructor<Options>