# Migration checklist — eledah/quartz_blog v4 → v5

## Phase status

- [x] Phase 0–9 complete
- [x] Phase 8 — blog-extras plugin, Persian 404, slug CSS audit
- [ ] Phase 10 — Publish plugins (optional)

## Local plugins

| Plugin | Path | Components |
|--------|------|------------|
| bidi-text | `./plugins/bidi-text` | transformer |
| featured-cards | `./plugins/featured-cards` | FeaturedCards, FeaturedImage |
| blog-extras | `./plugins/blog-extras` | PageTitle, Footer |

## In-tree customizations

- `quartz/styles/custom.scss` — theme
- `quartz/styles/variables.scss` — v4 breakpoints in v5 format
- `quartz/components/Head.tsx` — fonts, Telegram meta
- `quartz/components/pages/404.tsx` — Persian 404

## Next steps

1. `npx quartz build --serve` — visual QA
2. `git push -u origin v5` when ready
3. Set GitHub default branch to `v5` after deploy succeeds
