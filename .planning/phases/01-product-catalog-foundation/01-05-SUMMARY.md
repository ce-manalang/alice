---
phase: 01-product-catalog-foundation
plan: 05
subsystem: ui
tags: [nextjs, react, typescript, datocms, accordion, faq, homepage, hero]

# Dependency graph
requires:
  - phase: 01-02
    provides: Navigation and Footer in root layout (all pages get nav/footer automatically)
  - phase: 01-03
    provides: ProductCard component and datocms-queries.ts with FEATURED_PRODUCTS_QUERY

provides:
  - Shop homepage with hero section and featured products row
  - About page with mission-focused third-person brand story
  - FAQ page with 4 topic sections and accordion Q&A
  - Accordion component using HTML details/summary (zero-JS)

affects:
  - phase 2 (cart) — homepage is the primary entry point customers land on
  - phase 3 (checkout) — FAQ covers ordering flow; reduces support questions

# Tech tracking
tech-stack:
  added: []
  patterns:
    - HTML details/summary for accessible accordion (no JS required)
    - Graceful DatoCMS fallback (try featured query, fall back to first N products)
    - Static content pages hardcoded (FAQ/About change rarely, CMS overhead not justified)
    - shop-page/shop-container CSS class pattern for all content pages

key-files:
  created:
    - app/components/Accordion.tsx
    - app/faq/page.tsx
  modified:
    - app/page.tsx
    - app/about/page.tsx

key-decisions:
  - "Homepage hero uses 'CS education, made with care.' headline — direct, brand-true, educational mission"
  - "FAQ and About content hardcoded (not from CMS) — content rarely changes, no CMS overhead justified"
  - "Accordion uses HTML details/summary — zero-JS, accessible by default, no library needed"
  - "Featured products fallback: FEATURED_PRODUCTS_QUERY first, then first N from PRODUCTS_QUERY if empty"
  - "Old comics listing homepage fully replaced — comics remain accessible at /[slug] routes"

patterns-established:
  - "Static content pages (About, FAQ): hardcoded content with shop-page CSS wrapper"
  - "Accordion: details/summary HTML elements, no client-side JS"
  - "Homepage data fetching: try/catch with graceful fallback for DatoCMS schema gaps"

requirements-completed: [CAT-03, CONT-01, CONT-02]

# Metrics
duration: 2min
completed: 2026-02-26
---

# Phase 1 Plan 05: Homepage, About, FAQ, and Accordion Summary

**Shop homepage with hero + featured products row, accessible FAQ accordion (details/summary), and mission-focused About page — replacing the old comics listing homepage**

## Performance

- **Duration:** 2 min
- **Started:** 2026-02-26T07:20:29Z
- **Completed:** 2026-02-26T07:22:14Z
- **Tasks:** 2
- **Files modified:** 4

## Accomplishments

- Rebuilt homepage from comics listing to shop experience: hero section + featured products row using DatoCMS data
- Created Accordion component using native HTML details/summary elements — fully accessible, zero JavaScript
- Created FAQ page with 4 topic sections (Ordering, Fulfillment & Meetups, Products, Pre-Orders & Availability)
- Rebuilt About page with mission-focused third-person brand story (replacing old first-person artist bio)

## Task Commits

Each task was committed atomically:

1. **Task 1: Accordion component, About page, FAQ page** - `4c0f86e` (feat)
2. **Task 2: Rebuild homepage with hero and featured products** - `e770418` (feat)

## Files Created/Modified

- `app/components/Accordion.tsx` — Zero-JS accordion using HTML details/summary, styled to match shop design system
- `app/about/page.tsx` — Static About page with mission-focused third-person content, brand story, and contact info
- `app/faq/page.tsx` — Static FAQ page with 4 topic sections rendered using Accordion component
- `app/page.tsx` — Fully replaced: shop homepage with hero section and featured products row from DatoCMS

## Decisions Made

**Hero content:** "CS education, made with care." chosen as the headline — direct, true to the educational mission, and distinct from the old "some comics about art and internet" brand positioning.

**Featured products fallback strategy:** `FEATURED_PRODUCTS_QUERY` is attempted first (currently returns most-recent products since the `featured` field isn't in DatoCMS schema yet). If it returns an empty array or throws, the homepage falls back to `PRODUCTS_QUERY` sliced to `FEATURED_PRODUCT_COUNT` (4). This means the homepage always shows products and degrades gracefully as the DatoCMS schema evolves.

**Accordion implementation:** HTML `<details>/<summary>` elements chosen over a JS-driven component. This provides browser-native expand/collapse with full accessibility (keyboard navigation, screen reader support) and no client-side JavaScript bundle cost.

**Static content for About/FAQ:** Content is hardcoded rather than fetched from DatoCMS. About and FAQ content changes infrequently — adding CMS overhead for pages that might be edited once or twice a year is not justified. The brand story, FAQ answers, and topic groupings are authored directly in the source files.

**Comics homepage replacement:** The old `app/page.tsx` (comics listing with pagination) has been fully replaced. Existing comic routes at `/[slug]` are unaffected and remain functional. Comics are no longer linked from the main navigation — the homepage is now the shop entry point.

## Deviations from Plan

None — plan executed exactly as written.

## Issues Encountered

None — TypeScript compiled cleanly on first pass for both tasks.

## User Setup Required

None — no external service configuration required. The FEATURED_PRODUCTS_QUERY gracefully handles the missing `featured` field in DatoCMS by falling back to most-recent products.

## Next Phase Readiness

Phase 1 is now complete. All 5 plans delivered:
- Root layout with Navigation and Footer (Plan 02)
- ProductCard, ProductGrid, /shop page, /shop/[slug] unified route (Plan 03)
- Product detail page (Plan 04)
- Homepage, About, FAQ, Accordion (Plan 05)

Phase 2 (Shopping Cart) can begin. The homepage's "Browse the shop" CTA and featured products row are the primary entry points — Phase 2 adds cart functionality to ProductCard and the detail page.

## Self-Check: PASSED

- app/components/Accordion.tsx: FOUND
- app/about/page.tsx: FOUND
- app/faq/page.tsx: FOUND
- app/page.tsx: FOUND
- Commit 4c0f86e: FOUND
- Commit e770418: FOUND

---
*Phase: 01-product-catalog-foundation*
*Completed: 2026-02-26*
