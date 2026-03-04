---
phase: quick-4
plan: 4
subsystem: routing
tags: [routing, homepage, shop, comics, navigation]
dependency_graph:
  requires: []
  provides: [comics-homepage, shop-hero-landing, corrected-nav-links]
  affects: [app/page.tsx, app/shop/page.tsx, app/[slug]/page.tsx]
tech_stack:
  added: []
  patterns: [restore-from-git-history, route-responsibility-swap]
key_files:
  created: []
  modified:
    - app/page.tsx
    - app/shop/page.tsx
    - app/[slug]/page.tsx
decisions:
  - "Removed dead share-section commented block from original homepage — not restored"
  - "Hero p margin set to 0 on /shop (no Browse button needed — user already on /shop)"
  - "Fixed indentation of shop li in [slug]/page.tsx while correcting href"
metrics:
  duration_minutes: 8
  completed_date: "2026-03-03"
  tasks_completed: 3
  files_modified: 3
---

# Quick Task 4: Restore Comics Homepage and Move Shop Hero to /shop Summary

Restored route responsibilities: `/` now shows the paginated comics listing, `/shop` now shows the brand hero above the product catalog, and the comics detail page nav link for "shop" correctly points to `/shop` instead of Instagram.

---

## Tasks Completed

| Task | Name | Commit | Files |
|------|------|--------|-------|
| 1 | Restore comics homepage at / | 6f38db5 | app/page.tsx |
| 2 | Add hero to shop page at /shop | 6ed404f | app/shop/page.tsx |
| 3 | Fix shop nav link in comics detail page | 1b7b1db | app/[slug]/page.tsx |

---

## What Was Built

**Task 1 — Comics homepage (app/page.tsx)**
- Replaced shop hero + featured products with original comics listing
- Paginated via `getPosts(page)` + `<Pagination>` component
- Nav links: home `/`, shop `/shop`, about `about`
- `<ComicsList>` async sub-component with `<Suspense>` wrapper

**Task 2 — Shop landing hero (app/shop/page.tsx)**
- Added hero section at top: `h1` "CS education, made with care." + tagline `p`
- No "Browse the shop" CTA button — user is already on `/shop`
- Old `<h1>Shop</h1>` heading removed; hero h1 serves same purpose
- Product count, category nav, and `<ProductGrid>` unchanged below hero

**Task 3 — Comics detail page nav fix (app/[slug]/page.tsx)**
- Changed shop nav `href` from `https://www.instagram.com/centimentalcomics?utm_source=shop` to `/shop`
- Fixed indentation of the corrected `<li>` to match surrounding code

---

## Verification

- `pnpm build` passes — 0 TypeScript errors, 0 build errors
- All routes present in build output: `/`, `/[slug]`, `/shop`, `/shop/[slug]`, `/about`, `/faq`, `/cart`, `/checkout`
- `/` is now dynamic (ƒ) — server-rendered comics listing with pagination
- `/shop` remains SSG (○) with 1h revalidate

---

## Deviations from Plan

None — plan executed exactly as written.

---

## Self-Check: PASSED

Files confirmed:
- app/page.tsx: FOUND (comics listing with getPosts, Pagination, ComicsList)
- app/shop/page.tsx: FOUND (hero section + product catalog)
- app/[slug]/page.tsx: FOUND (shop link = /shop, no instagram.com)

Commits confirmed:
- 6f38db5: feat(quick-4): restore comics homepage at /
- 6ed404f: feat(quick-4): add hero section to shop landing page at /shop
- 1b7b1db: fix(quick-4): fix shop nav link in comics detail page
