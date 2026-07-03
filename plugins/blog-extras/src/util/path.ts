import { joinSegments } from "@quartz-community/utils"

export function pathToRoot(slug: string): string {
  let rootPath = slug
    .split("/")
    .filter((x) => x !== "")
    .slice(0, -1)
    .map(() => "..")
    .join("/")

  if (rootPath.length === 0) {
    rootPath = "."
  }

  return rootPath
}

export function iconPath(slug: string): string {
  return joinSegments(pathToRoot(slug), "static/icon-header.png")
}
