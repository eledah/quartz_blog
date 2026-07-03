import { describe, it, expect } from "vitest";
import { resolveImageSrc, type ResolveImageOpts } from "../src/components/views/cards";

describe("resolveImageSrc", () => {
  const slug = "plugins/index";
  const defaultOpts: ResolveImageOpts = { slug, allSlugs: [], linkResolution: "shortest" };

  describe("empty / falsy input", () => {
    it("returns empty src for empty string", () => {
      expect(resolveImageSrc("", defaultOpts)).toEqual({ src: "", isColor: false });
    });
  });

  describe("hex color detection", () => {
    it("detects 6-digit hex color", () => {
      expect(resolveImageSrc("#ff0000", defaultOpts)).toEqual({ src: "#ff0000", isColor: true });
    });

    it("detects 3-digit hex color", () => {
      expect(resolveImageSrc("#abc", defaultOpts)).toEqual({ src: "#abc", isColor: true });
    });

    it("is case-insensitive", () => {
      expect(resolveImageSrc("#AABBCC", defaultOpts)).toEqual({ src: "#AABBCC", isColor: true });
    });

    it("rejects invalid hex (too many digits)", () => {
      const result = resolveImageSrc("#1234567", defaultOpts);
      expect(result.isColor).toBe(false);
    });

    it("rejects non-hex strings starting with #", () => {
      const result = resolveImageSrc("#xyz", defaultOpts);
      expect(result.isColor).toBe(false);
    });
  });

  describe("wikilink resolution", () => {
    it("resolves simple wikilink", () => {
      const result = resolveImageSrc("[[giscus-results.png]]", defaultOpts);
      expect(result.isColor).toBe(false);
      expect(result.src).not.toContain("[[");
      expect(result.src).not.toContain("]]");
      expect(result.src).toContain("giscus-results.png");
    });

    it("resolves wikilink with path", () => {
      const result = resolveImageSrc("[[images/photo.png]]", defaultOpts);
      expect(result.isColor).toBe(false);
      expect(result.src).not.toContain("[[");
      expect(result.src).toContain("photo.png");
    });

    it("strips alias from wikilink", () => {
      const result = resolveImageSrc("[[my-image.png|My Image]]", defaultOpts);
      expect(result.isColor).toBe(false);
      expect(result.src).not.toContain("My Image");
      expect(result.src).toContain("my-image.png");
    });

    it("handles wikilink with spaces in path", () => {
      const result = resolveImageSrc("[[social image preview.png]]", defaultOpts);
      expect(result.isColor).toBe(false);
      expect(result.src).not.toContain("[[");
      expect(result.src).toContain("social-image-preview.png");
    });

    it("resolves wikilink via shortest-path with allSlugs", () => {
      const opts: ResolveImageOpts = {
        slug: "Base",
        allSlugs: ["images/giscus-results.png"],
        linkResolution: "shortest",
      };
      const result = resolveImageSrc("[[giscus-results.png]]", opts);
      expect(result.isColor).toBe(false);
      expect(result.src).toContain("images/giscus-results");
    });

    it("resolves wikilink via shortest-path with nested allSlugs", () => {
      const opts: ResolveImageOpts = {
        slug: "docs/plugins/index",
        allSlugs: ["assets/photos/vacation.jpg", "other/file"],
        linkResolution: "shortest",
      };
      const result = resolveImageSrc("[[vacation.jpg]]", opts);
      expect(result.isColor).toBe(false);
      expect(result.src).toContain("vacation");
    });
  });

  describe("external URLs", () => {
    it("passes through https URLs unchanged", () => {
      const url = "https://images.unsplash.com/photo-123?w=400";
      const result = resolveImageSrc(url, defaultOpts);
      expect(result).toEqual({ src: url, isColor: false });
    });

    it("passes through http URLs unchanged", () => {
      const url = "http://example.com/image.jpg";
      const result = resolveImageSrc(url, defaultOpts);
      expect(result).toEqual({ src: url, isColor: false });
    });

    it("passes through data URIs unchanged", () => {
      const dataUri = "data:image/png;base64,iVBORw0KGgo=";
      const result = resolveImageSrc(dataUri, defaultOpts);
      expect(result).toEqual({ src: dataUri, isColor: false });
    });
  });

  describe("plain relative paths", () => {
    it("passes through relative path as-is", () => {
      const result = resolveImageSrc("images/photo.png", defaultOpts);
      expect(result).toEqual({ src: "images/photo.png", isColor: false });
    });
  });
});
