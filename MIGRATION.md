# Quartz v4 → v5 Migration — Implementation Plan

## Context & assumptions

- **Blog repo:** `eledah/quartz_blog`, currently on `v4`, pushed and up to date. No backup needed (v4 branch is the safety net).
- **v5 reference clone:** `C:\Users\Tetra-AI1\Documents\GitHub\quartz` (contains the v5 codebase + your own `plugins/bidi-text/` plugin).
- **`bidi-text`** is your own v5 plugin — copy it over; no upstream diff needed.
- **No code will be written in this phase.** This is the plan only. Each phase ends with a verification gate before moving on.
- **Two tracks**, but executed sequentially here: (1) get the blog on v5, (2) publish stable plugins later.

---

## Phase 0 — Pre-flight checks (≈15 min)

**Goal:** Confirm the environment is ready before touching the blog repo.

1. Verify Node ≥ 22 is installed (`node -v`). v5 requires it.
2. Confirm the v5 reference clone is on the latest `v5` branch and builds cleanly on its own: `npm i && npx quartz plugin install --from-config && npx quartz build` inside `C:\Users\Tetra-AI1\Documents\GitHub\quartz`. This proves your `bidi-text` plugin compiles in v5 before we rely on it.
3. Confirm `upstream` remote exists in the blog repo pointing at `https://github.com/jackyzha0/quartz.git`; if not, add it.
4. Snapshot the current v4 customization inventory (the table from the audit) into a markdown file in the repo root, e.g. `MIGRATION-NOTES.md`, so you can check items off. This is documentation, not feature code.

**Gate:** v5 reference clone builds green; Node ≥ 22; inventory file committed on v4.

---

## Phase 1 — Branch switch & vanilla v5 scaffold (≈30 min)

**Goal:** A working vanilla v5 site on a new `v5` branch, content not yet imported.

1. In the blog repo: `git fetch upstream v5`.
2. `git checkout -b v5 upstream/v5` (creates a clean v5 working tree; `v4` branch is untouched).
3. `npm i`.
4. Run `npx quartz create`:
   - Template: **`blog`** (closest to your setup).
   - Content strategy: start with **`new`** (empty) for now — we import content deliberately in Phase 2 to avoid carrying v4 cruft.
   - `baseUrl`: `blog.eledah.ir`.
   - Link resolution: `shortest` (matches your Obsidian-style notes).
5. Push the branch: `git push -u origin v5`.

**Gate:** `npx quartz build` succeeds on an empty v5 site. Site renders at the default template.

---

## Phase 2 — Content import (≈20 min)

**Goal:** Your notes live under `content/` on v5, building without errors.

1. Copy content from the v4 branch into the v5 working tree. Two clean options:
   - `git checkout v4 -- content` (brings the folder + its git history forward onto v5), or
   - File-copy from a fresh `git worktree` of v4.
2. Run `npx quartz build` and fix any v5-incompatible markdown (e.g. frontmatter keys, broken wikilinks from URL casing).
3. Commit as `content: import v4 posts`.

**Gate:** Full content builds green; spot-check a few posts in the local serve output.

---

## Phase 3 — Config & i18n translation (≈30 min)

**Goal:** Persian locale, site settings, and assets ported to v5 config format.

1. Translate `quartz.config.ts` settings into `quartz.config.yaml`:
   - `locale: fa-IR`, Persian site title, custom color palette, `baseUrl`, Plausible analytics.
2. Port `quartz/i18n/locales/fa-IR.ts` into the v5 i18n structure (verify the v5 locale file shape — it may have changed keys). Keep `direction: rtl`.
3. Copy static assets into v5 `quartz/static/`: `icon-header.png`, `icon.png`, `og-image.png`, `fonts/Ray-ExtraBold.ttf`, `giscus-light.css`, `giscus-dark.css`.
4. Recreate the `Head.tsx` additions (Vazirmatn/Amiri CDN, Telegram channel meta, OG tweaks) — in v5 this is either an in-tree edit of the internal `Head` component or a small plugin; decide based on how much v5's `Head` exposes. Start with the in-tree edit since `Head` is internal.

**Gate:** Site builds with Persian UI, correct fonts loading, favicon/OG assets present.

---

## Phase 4 — Theme & global styles (≈2–3 hrs, highest effort)

**Goal:** Visual parity with the v4 blog without forking v5's layout internals.

1. Copy `quartz/styles/custom.scss` into v5 `quartz/styles/custom.scss`. This file is still user-editable in-tree.
2. **Do NOT copy `base.scss`'s grid→flex / fixed-sidebar rewrite.** Instead, recreate the fixed-sidebar behavior using v5's layout system:
   - Map your v4 `quartz.layout.ts` structure (left sidebar, right sidebar, index vs content splits) into `quartz.config.yaml`'s per-plugin `layout.position`/`priority` and top-level `layout.byPageType`.
   - Use v5 **frames** (`quartz/components/frames/`) for the fixed-sidebar geometry rather than a `base.scss` fork. If no built-in frame fits, add a custom frame in-tree (frames are an intended extension point).
3. Port the smaller component SCSS files (`backlinks.scss`, `popover.scss`, `toc.scss`, `graph.scss`, `recentNotes.scss`, `explorer.scss`, `darkmode.scss`, `footer.scss`, `contentMeta.scss`, `sidenotes.scss`) — verify each selector still matches v5's component markup, since community plugins may have changed class names.
4. **Slug-specific CSS audit:** find every `body[data-slug="..."]` or slug-keyed selector in `custom.scss`. v5 lowercases/hyphenates URLs, so update each slug to the new lowercase form. Build a mapping table (old slug → new slug) and update both CSS and any hardcoded internal links in content.
5. Verify AliasRedirects is enabled (default) so old uppercase URLs redirect for SEO.

**Gate:** Local site visually matches v4 on at least 3 representative pages (home, a Farsi article, an English/code-heavy article). Fixed sidebars behave on scroll.

---

## Phase 5 — Layout: index vs content pages (≈2 hrs, high risk)

**Goal:** Home page shows featured cards above index markdown; content pages use the article layout — without forking the emitter.

1. Study v5's `pageType` + `layout.byPageType` mechanism (in the v5 repo: `quartz/plugins/pageTypes/` and `docs/advanced/making plugins.md`).
2. Recreate your v4 `contentPage.tsx` index/content split using:
   - A **custom pageType** (or the community content/folder page types) with `byPageType` layout overrides, and/or
   - A `FeaturedCards` component placed via `layout.position: beforeBody` scoped to the index page.
3. Recreate the index-sidebar composition (RecentNotes limit 3, Graph, Backlinks; no TOC/breadcrumbs/FeaturedImage on index) as a `byPageType` override.
4. Re-apply the small "hide on index" guards (ArticleTitle, ContentMeta, Backlinks, TOC) — prefer `byPageType` layout exclusion over per-component `if (slug === "index")` checks where possible.

**Gate:** Home page renders featured cards + index markdown + correct sidebar; article pages render the full content layout.

---

## Phase 6 — Portable features as local plugins (≈3–4 hrs)

**Goal:** Self-contained customizations live under `./plugins/` as local v5 plugins (fast iteration, no publishing yet).

1. **`bidi-text`** — copy your existing plugin from `C:\Users\Tetra-AI1\Documents\GitHub\quartz\plugins\bidi-text\` into the blog repo at `plugins/bidi-text/`. Add to `quartz.config.yaml` as `source: ./plugins/bidi-text`. Remove the `dir="rtl"` hardcode from `renderPage.tsx` if your plugin handles direction; otherwise re-apply that one-line edit on v5's `renderPage.tsx`.
2. **`featured-cards`** — new local plugin (`category: component`, manifest `components` map with `FeaturedCards` + `FeaturedImage`, `./components` export). Port `FeaturedCards.tsx`, `FeaturedImage.tsx`, and the bento CSS (move the relevant block out of `custom.scss` into the plugin's bundled CSS). Wire via `layout.position: beforeBody` on the index page.
3. **`blog-extras`** (or separate plugins) — port `PageTitle` (logo + title), `Footer` (Aparat/GitHub/Telegram SVGs + about link), and the custom Persian 404 page. Decide one combined plugin vs. three based on whether you want to publish them independently later.
4. **`sidenotes`** — port `Sidenotes.tsx` + `sidenotes.inline.ts` + `sidenotes.scss` as a component plugin using the `inlineScriptPlugin` pattern for the `.inline.ts`. (Currently unused in your v4 layout — only port if you plan to enable it.)
5. **`remark42`** — only if you want to switch off Giscus; otherwise skip.

For each: use the `quartz-community/plugin-template` structure, `tsup.config.ts` with `inlineScriptPlugin`, commit `dist/`, and add via `source: ./plugins/<name>`.

**Gate:** Each feature renders correctly; `npx quartz build` green; no in-tree `quartz/components/` patches remain for these features.

---

## Phase 7 — Giscus comments (≈1 hr)

**Goal:** Custom Giscus with your CDN themes, hidden on index, theme-sync on navigation.

1. Check whether a v5 community Giscus plugin exists; if so, configure it and override behavior via `quartz.ts` rather than forking.
2. If forking is needed: port your `Comments.tsx` logic onto v5's component, keeping the lazy script injection and MutationObserver on `saved-theme`.
3. Re-test the **SPA `nav` lifecycle** specifically — v5 navigation may re-init or tear down components differently than v4. Use `window.addCleanup` per the v5 docs. Your v4 `darkmode.inline.ts` change (removing `nav` re-bind) is a known regression risk; re-evaluate it against v5's nav events (`nav`, `prenav`, `render`).
4. Re-point the Giscus theme CSS URLs to the v5 `static/` asset paths (or keep the jsdelivr CDN refs to your repo).

**Gate:** Comments load on an article, hide on index, and survive a client-side navigation between two articles without losing theme sync.

---

## Phase 8 — Cleanup & drift fixes (≈30 min)

**Goal:** Remove accidental v4 drift that isn't a real feature.

1. Drop the removed i18n locale imports (8 locales) — don't carry that drift into v5.
2. Drop the Roam export removal — irrelevant on v5.
3. Remove the dead duplicate code at the top of `Backlinks.tsx` when porting.
4. Remove `remark42.ts` if unused, or port it in Phase 6.

**Gate:** `npm run check` (type + prettier) clean; no dead code.

---

## Phase 9 — CI/CD & deploy (≈30 min)

**Goal:** v5 builds and deploys on push.

1. Update `.github/workflows/deploy.yml`:
   - Trigger branch: `v5` (not `v4`).
   - Add cache for `~/.npm` on `package-lock.json`.
   - Add cache for `.quartz/plugins` on `quartz.lock.json`.
   - Steps: `npm ci` → `npx quartz plugin install` → `npx quartz build`.
   - `fetch-depth: 0` if you rely on git timestamps.
2. Keep `auto-merge-dependabot.yml` (update branch ref if needed).
3. After a successful deploy, set the GitHub repo default branch to `v5` (Settings → General → Default branch).

**Gate:** Green deploy to GitHub Pages on `v5`; old v4 URLs still resolve via AliasRedirects.

---

## Phase 10 — Publish community plugins (optional, later)

**Goal:** Share stable features with the Quartz community.

For each local plugin that's proven stable on your blog:

1. Create a standalone repo (`github.com/eledah/quartz-<feature>`), e.g. `quartz-bidi-text`, `quartz-featured-cards`, `quartz-blog-extras`.
2. Copy the local `plugins/<name>/` contents in, ensure `dist/` is committed, add a README.
3. From the blog repo: `npx quartz plugin remove <name>` then `npx quartz plugin add github:eledah/quartz-<feature>`; update `quartz.config.yaml` source.
4. Verify the blog still builds against the published plugin.
5. (Optional) list it in the Quartz community plugin directory.

**Gate:** Blog builds entirely from published community plugins + in-tree styles/config; no local `./plugins/` dependencies remain.

---

## Effort & risk summary

| Phase | Effort | Risk |
|---|---|---|
| 0–3 Pre-flight → config | Low | Low |
| 4 Theme + fixed-sidebar layout | **High** | **Critical** — do not fork `base.scss`; use v5 frames/layout |
| 5 Index vs content pages | **High** | High — avoid `contentPage.tsx` fork; use pageType/byPageType |
| 6 Local plugins | Medium | Low–Med (bidi-text already proven in your v5 clone) |
| 7 Giscus | Medium | Med — SPA nav lifecycle |
| 8–9 Cleanup + CI | Low | Low — but slug-CSS/URL casing audit is medium |
| 10 Publish | Low | Low |

**Total estimate:** ~1–2 focused days for phases 0–9; the layout/theme work (4–5) is the bulk.

## Top three things to get right

1. **Don't fork `base.scss` or `contentPage.tsx`.** Recreate both via v5's declarative layout, frames, and `pageType`/`byPageType`. This is where most migration time (and most merge pain later) comes from.
2. **URL casing audit.** v5 lowercases all URLs — your slug-specific CSS and any uppercase internal links will break. Build the old→new slug map early in Phase 4.
3. **Keep plugins local until stable.** Use `source: ./plugins/...` during migration; only publish to GitHub once a feature has run cleanly on your blog. This separates "ship my blog" from "share with community" and lets you iterate fast.

When you're ready to execute, point me at the phase you want to start with and I'll begin — beginning with the Phase 0 pre-flight checks against your v5 reference clone and the blog repo.