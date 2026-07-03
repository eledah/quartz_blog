import { simplifySlug as utilSimplifySlug, joinSegments } from "@quartz-community/utils"

export function simplifySlug(fp: string): string {
  return utilSimplifySlug(fp)
}

export function resolveRelative(current: string, target: string): string {
  const simplified = simplifySlug(target)
  const rootPath = pathToRoot(current)
  return joinSegments(rootPath, simplified)
}

function pathToRoot(slug: string): string {
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
