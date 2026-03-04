---
phase: 01-product-catalog-foundation
plan: 01
subsystem: data-foundation
tags: [typescript, datocms, graphql, cache-tags, types]
dependency_graph:
  requires: []
  provides: [Product type, DatoCMS queries, shared constants, cache strategy]
  affects: [all Phase 1 Wave 2 plans]
tech_stack:
  added: []
  patterns: [cache-tags-revalidation, typed-graphql-queries, shared-type-exports]
key_files:
  created:
    - app/lib/types.ts
    - app/lib/constants.ts
  modified:
    - app/lib/datocms-queries.ts
    - app/lib/datocms.ts
decisions:
  - "Use ProductCategory union type (not enum) for simplicity and compatibility with DatoCMS string fields"
  - "Cache tags set at datocmsRequest level (all fetches get 'products' tag) — simplest approach for <20 products"
  - "ProductAvailability type defined but available field on Product is boolean — maps to DatoCMS boolean field, availability label derived from boolean in UI"
metrics:
  duration: 4m
  completed_date: 2026-02-26
  tasks_completed: 2
  files_changed: 4
---

# Phase 1 Plan 01: Data Foundation Summary

**One-liner:** TypeScript Product type, 5 GraphQL queries with `available`/`category` fields, and on-demand cache tag revalidation via `tags: ['products']`

---

## What Was Built

### app/lib/types.ts (new)

Canonical TypeScript types used across all Phase 1 components:

- `ProductCategory` — union type: `'zines' | 'apparel' | 'stationery' | 'pins'`
- `ProductAvailability` — union type: `'available' | 'pre-order' | 'sold-out'`
- `ProductImage` — `{ url: string, alt: string }`
- `Product` — full interface with id, name, price, images, alt, description, available, category

### app/lib/constants.ts (new)

Shared constants for consistent values across the codebase:

- `CATEGORIES` — typed array of all 4 ProductCategory values
- `CATEGORY_LABELS` — display labels mapped from ProductCategory
- `SOCIAL_LINKS` — Instagram and Twitter URLs (as const)
- `FEATURED_PRODUCT_COUNT` — 4
- `SITE_URL` — canonical production URL
- `PRODUCTS_CACHE_TAG` — `'products'` (used for cache invalidation)

### app/lib/datocms-queries.ts (updated)

5 product queries added (all include `available` and `category` fields):

| Query | Purpose |
|-------|---------|
| `PRODUCTS_QUERY` | All products for shop page, ordered by created date |
| `PRODUCTS_BY_CATEGORY_QUERY` | Filtered by category for /shop/[category] pages |
| `ALL_PRODUCT_IDS_QUERY` | Returns only IDs for `generateStaticParams` |
| `SINGLE_PRODUCT_QUERY` | Full product detail including `description(markdown: true)` |
| `FEATURED_PRODUCTS_QUERY` | Featured products for homepage, filtered by `featured: true` |

`ALL_COMICS_QUERY` preserved for existing comic pages.

### app/lib/datocms.ts (updated)

Cache strategy updated from `next: { revalidate: 60 }` to:
```typescript
next: { revalidate: 3600, tags: ['products'] }
```
Enables Vercel's on-demand revalidation via webhook — DatoCMS can trigger `revalidateTag('products')` on content publish.

---

## DatoCMS Schema Fields to Verify

The following fields are referenced in queries but must exist in the DatoCMS schema. Verify in the DatoCMS dashboard before Wave 2 plans run:

| Field | Model | Type | Used In |
|-------|-------|------|---------|
| `available` | Product | Boolean | PRODUCTS_QUERY, PRODUCTS_BY_CATEGORY_QUERY, SINGLE_PRODUCT_QUERY, FEATURED_PRODUCTS_QUERY |
| `category` | Product | String (single-line) | All product queries |
| `featured` | Product | Boolean | FEATURED_PRODUCTS_QUERY filter |
| `images` | Product | Gallery (multiple images) | All product queries |
| `alt` | Product | Text (markdown: false) | All product queries |
| `description` | Product | Text (markdown: true) | SINGLE_PRODUCT_QUERY |

---

## Decisions Made

1. **ProductCategory as union type** — simpler than enum, compatible with DatoCMS string fields, no runtime overhead
2. **Cache tags at request level** — `tags: ['products']` applied globally in `datocmsRequest` for all fetches. Works for <20 products with low write frequency.
3. **available as boolean** — maps to DatoCMS boolean field directly; UI derives availability labels (Available / Sold Out / Pre-order) from the boolean combined with product state
4. **PRODUCTS_CACHE_TAG constant** — shared constant ensures tag strings don't drift between the fetch call and any future `revalidateTag()` calls

---

## Deviations from Plan

None — plan executed exactly as written.

---

## Self-Check: PASSED

All required files exist and both task commits are present in git history.

| Item | Status |
|------|--------|
| app/lib/types.ts | FOUND |
| app/lib/constants.ts | FOUND |
| app/lib/datocms-queries.ts | FOUND |
| app/lib/datocms.ts | FOUND |
| 01-01-SUMMARY.md | FOUND |
| Commit ef6cac2 | FOUND |
| Commit 1ed2dfb | FOUND |
