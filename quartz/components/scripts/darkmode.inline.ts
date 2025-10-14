const initDarkmode = () => {
  const userPref = window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark"
  const currentTheme = localStorage.getItem("theme") ?? userPref
  document.documentElement.setAttribute("saved-theme", currentTheme)

  const switchTheme = () => {
    const newTheme =
      document.documentElement.getAttribute("saved-theme") === "dark" ? "light" : "dark"
    document.documentElement.setAttribute("saved-theme", newTheme)
    localStorage.setItem("theme", newTheme)
  }

  // Add event listeners to darkmode buttons
  const darkmodeButtons = document.getElementsByClassName("darkmode")
  if (darkmodeButtons.length > 0) {
    for (const button of darkmodeButtons) {
      button.addEventListener("click", switchTheme)
    }
  }

  // Listen for system theme changes
  const colorSchemeMediaQuery = window.matchMedia("(prefers-color-scheme: dark)")
  colorSchemeMediaQuery.addEventListener("change", (e) => {
    const newTheme = e.matches ? "dark" : "light"
    document.documentElement.setAttribute("saved-theme", newTheme)
    localStorage.setItem("theme", newTheme)
  })
}

// Initialize when DOM is ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initDarkmode)
} else {
  initDarkmode()
}
