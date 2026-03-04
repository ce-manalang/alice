---
phase: 01-product-catalog-foundation
plan: 03
subsystem: product-browsing-ui
tags: [nextjs, typescript, datocms, components, ssg, category-pages]
dependency_graph:
  requires: [01-01]
  provides: [ProductCard, ProductGrid, /shop page, /shop/[category] pages]
  affects: [Phase 2 cart integration, Phase 1 Plan 04 homepage featured products]
tech_stack:
  added: []
  patterns: [reusable-card-component, unified-dynamic-route, slug-based-routing, ssg-static-params]
key_files:
  created:
    - app/components/ProductCard.tsx
    - app/components/ProductGrid.tsx
    - app/shop/[slug]/page.tsx
  modified:
    - app/shop/page.tsx
    - app/lib/types.ts
    - app/lib/datocms-queries.ts
    - app/globals.css
decisions:
  - "Unified [slug] route handles both category pages (/shop/zines) and product detail (/shop/love-letters-to-ruby) to avoid Next.js dynamic segment conflict"
  - "Product routing uses DatoCMS slug field (not id) for clean human-readable URLs"
  - "price is numeric (DatoCMS Float); formatPrice() converts to PHP display string"
  - "available and category fields not yet in DatoCMS schema — ProductCard treats undefined available as true (available)"
  - "PRODUCTS_BY_CATEGORY_QUERY currently returns all products until category field is added to DatoCMS"
metrics:
  duration: 6m
  completed_date: 2026-02-26
  tasks_completed: 2
  files_changed: 7
---

# Phase 1 Plan 03: Product Browsing UI Summary

**One-liner:** ProductCard and ProductGrid components with shop CSS design system, /shop all-products page, and unified /shop/[slug] routing for both category pages and product detail pages via DatoCMS slug field.

---

## What Was Built

### app/components/ProductCard.tsx (new)

Reusable product card component:

- Props: `product: Product`, `priority?: boolean`
- Renders: product image (next/image with proper `sizes` attribute), name, price (formatted via `formatPrice()`), availability badge
- Sold-out dimming: applies `.sold-out` CSS class (`opacity: 0.55`) when `product.available === false`
- URL routing: uses `product.slug ?? product.id` for `/shop/{slug}` links
- Image fallback: renders a placeholder div when no images available

**ProductCard props interface:**
```typescript
interface ProductCardProps {
  product: Product
  priority?: boolean  // true for first 3 cards (LCP optimization)
}
```

### app/components/ProductGrid.tsx (new)

Grid wrapper for ProductCards:

- Props: `products: Product[]`, `emptyMessage?: string`
- Renders responsive `.products-grid` CSS grid (1 col mobile, 2 col tablet, 3 col desktop)
- Sets `priority={index < 3}` on first 3 cards for LCP optimization
- Empty state: centered message when no products

### app/globals.css (modified)

Shop design system CSS added:

| Class | Purpose |
|-------|---------|
| `.shop-page` | Page container, white background |
| `.shop-container` | Max-width 1200px centered container |
| `.products-grid` | Responsive 1/2/3 column CSS grid |
| `.shop-product-card` | Card link with hover lift effect |
| `.shop-product-card.sold-out` | `opacity: 0.55` for sold-out products |
| `.shop-product-card__image` | Square aspect-ratio image container |
| `.shop-product-card__body` | Name, price, badge area |
| `.shop-product-card__name` | Inter 15px 600 weight heading |
| `.shop-product-card__price` | Inter 14px gray price |
| `.shop-product-card__badge` | Pill-shaped availability badge |
| `.shop-product-card__badge--sold-out` | Gray sold-out badge |
| `.shop-product-card__badge--pre-order` | Blue pre-order badge |

### app/shop/page.tsx (rebuilt)

Clean SSG shop index page:
- `export const revalidate = 3600` — hourly ISR
- Full SEO metadata with OpenGraph tags
- Category navigation pills (All active, categories link to `/shop/{category}`)
- Fetches all products via `PRODUCTS_QUERY` from DatoCMS
- Renders `<ProductGrid>` with empty state message
- `export default async function ShopPage()`

### app/shop/[slug]/page.tsx (new, replaces [id]/page.tsx)

Unified dynamic route handling two cases:

**Case 1 — Category page** (when slug is in CATEGORIES):
- Matches `/shop/zines`, `/shop/apparel`, `/shop/stationery`, `/shop/pins`
- Fetches products via `PRODUCTS_BY_CATEGORY_QUERY`
- Shows category label as h1, product count
- Category nav with active state highlighting current category
- Renders `<ProductGrid>`

**Case 2 — Product detail page** (all other slugs):
- Fetches product via `PRODUCT_BY_SLUG_QUERY` (filter by slug field)
- Renders product images, name, formatted price, description
- Shows "Sold Out" badge when `available === false`
- Add to Cart link (connects to checkout flow in Phase 3)
- `notFound()` for unknown slugs

`generateStaticParams()` pre-generates:
- 4 category slugs
- All product slugs from DatoCMS (via `ALL_PRODUCT_IDS_QUERY`)

---

## DatoCMS Schema: Actual vs Expected

| Field | Expected | Actual | Status |
|-------|----------|--------|--------|
| `id` | string | string | OK |
| `name` | string | string | OK |
| `price` | string | **Float** | Fixed — `formatPrice()` converts to "PHP X" |
| `alt` | string | string | OK |
| `images` | array | array | OK |
| `description` | string | string | OK |
| `slug` | not expected | **string** | Used for URL routing |
| `available` | boolean | **not in schema** | Defaults to true until field is added |
| `category` | string enum | **not in schema** | Category pages show all products until field is added |
| `featured` | boolean | **not in schema** | FEATURED_PRODUCTS_QUERY returns recent products instead |

### DatoCMS Schema Actions Required

To fully implement category filtering and sold-out status:

1. **Add `available` boolean field** to ProductRecord model — enables sold-out dimming and badges
2. **Add `category` single-line text field** to ProductRecord model — must store values as uppercase (`ZINES`, `APPAREL`, `STATIONERY`, `PINS`) to match the query variable transform (`category.toUpperCase()`)
3. **Add `featured` boolean field** to ProductRecord model — enables FEATURED_PRODUCTS_QUERY filter for homepage

After adding fields, update `PRODUCTS_BY_CATEGORY_QUERY` in `datocms-queries.ts`:
```graphql
query ProductsByCategory($category: String!) {
  allProducts(filter: { category: { eq: $category } }, orderBy: _createdAt_DESC) {
    ...
    available
    category
  }
}
```
And update `Product` type to make `available` and `category` required (non-optional).

---

## DatoCMS Category Value Format

Category values are passed uppercase to DatoCMS: `category.toUpperCase()` converts `'zines'` → `'ZINES'`. When the `category` field is added to DatoCMS, values should be stored as uppercase strings.

---

## Build Results

Build output shows correct routing:
```
● /shop/[slug]  (SSG)
  ├ /shop/zines
  ├ /shop/apparel
  ├ /shop/stationery
  └ [+6 more paths]   ← 5 product slugs + 1 more category
```
18 total static pages generated. TypeScript compiles without errors.

---

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Resolved Next.js dynamic segment conflict**
- **Found during:** Task 2
- **Issue:** Next.js 15 prohibits two different dynamic segment names at the same path level — `[id]` and `[category]` both under `app/shop/` caused build error: "You cannot use different slug names for the same dynamic path ('category' !== 'id')"
- **Fix:** Replaced both `[id]` and `[category]` with a single unified `[slug]` route that detects category vs product by checking `CATEGORIES.includes(slug)`
- **Files modified:** Removed `app/shop/[id]/page.tsx`, created `app/shop/[slug]/page.tsx`
- **Commit:** 2dfb507

**2. [Rule 1 - Bug] Fixed DatoCMS schema mismatch — missing fields and wrong price type**
- **Found during:** Task 2 build
- **Issue:** `PRODUCTS_QUERY` referenced `available` and `category` fields that don't exist in DatoCMS `ProductRecord`. Also `price` is `FloatType` in DatoCMS (not string as typed).
- **Fix:** Removed `available`, `category`, `featured` from all queries. Updated `Product.price` type to `number`. Added `formatPrice()` helper. Made `available` and `category` optional on `Product` type. Added `slug` field (exists in DatoCMS) for URL routing.
- **Files modified:** `app/lib/types.ts`, `app/lib/datocms-queries.ts`, `app/components/ProductCard.tsx`, `app/shop/[slug]/page.tsx`
- **Commit:** 2dfb507

**3. [Rule 2 - Missing Critical] Added shop CSS design system to globals.css**
- **Found during:** Task 1
- **Issue:** Plan references CSS classes (`shop-product-card`, `shop-page`, `products-grid`, etc.) in component code, but these classes did not exist in `globals.css`
- **Fix:** Added full shop design system CSS block to `app/globals.css` with all referenced classes
- **Files modified:** `app/globals.css`
- **Commit:** c1ba4ea

---

## Self-Check: PASSED

| Item | Status |
|------|--------|
| app/components/ProductCard.tsx | FOUND |
| app/components/ProductGrid.tsx | FOUND |
| app/shop/page.tsx | FOUND |
| app/shop/[slug]/page.tsx | FOUND |
| app/globals.css (shop CSS) | FOUND |
| Commit c1ba4ea (Task 1) | FOUND |
| Commit 2dfb507 (Task 2) | FOUND |
| TypeScript: no errors | PASS |
| Next.js build: 18 pages | PASS |
