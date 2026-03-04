---
phase: 02-shopping-cart
plan: 03
subsystem: ui
tags: [zustand, react, next.js, cart, client-component]

# Dependency graph
requires:
  - phase: 02-01
    provides: useCartStore Zustand hook with addToCart, localStorage persistence, hasHydrated SSR guard
provides:
  - QuickAdd button in ProductCard — add 1 unit from shop grid without navigating away
  - AddToCartSection component — quantity stepper (1-99) + Add to Cart on product detail page
  - Both surfaces wired to useCartStore.addToCart using product.id as stable identifier
affects:
  - 02-02 (cart badge in Navigation reads same store)
  - phase-03 (checkout reads cart items populated here)

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Client Component extraction: Server Component page imports 'use client' sub-component for interactivity (AddToCartSection in [slug]/page.tsx)"
    - "QuickAdd inside Link: e.preventDefault() + e.stopPropagation() to block parent Link navigation on button click"
    - "Feedback state pattern: 'idle' | 'added' useState, setTimeout 1500ms to revert, green (#16a34a) for confirmation"
    - "productId strategy: use product.id (stable DatoCMS ID), not slug, as cart key"

key-files:
  created:
    - app/components/AddToCartSection.tsx
  modified:
    - app/components/ProductCard.tsx
    - app/shop/[slug]/page.tsx

key-decisions:
  - "AddToCartSection extracted to separate file (not inline in [slug]/page.tsx) because Next.js 15 cannot mix 'use client' and async server functions in same file"
  - "ProductCard converted to Client Component — QuickAdd needs useState; the whole card becomes 'use client'"
  - "product.id used as cart productId (not slug) — id is the stable DatoCMS identifier; slug can change"
  - "Quantity stepper bounds: min=1, max=99 — defensive cap, no stock validation needed for Phase 2"
  - "1500ms feedback window — long enough to read, short enough to feel responsive"

patterns-established:
  - "Feedback state: use 'idle' | 'added' union type, green color #16a34a, 1500ms timeout via setTimeout"
  - "Sold-out: disabled attribute + cursor:not-allowed + gray #9ca3af/#e5e7eb background"
  - "Client sub-component in Server page: define in separate file, import into Server Component page"

requirements-completed:
  - CART-01
  - CART-03

# Metrics
duration: 2min
completed: 2026-03-01
---

# Phase 2 Plan 03: Add-to-Cart Component Wiring Summary

**QuickAdd button on ProductCard grid + AddToCartSection quantity stepper on product detail page, both wired to Zustand cart store via product.id**

## Performance

- **Duration:** ~2 min
- **Started:** 2026-03-01T09:46:01Z
- **Completed:** 2026-03-01T09:47:32Z
- **Tasks:** 2 of 3 (Task 3 is human-verify checkpoint — awaiting)
- **Files modified:** 3 (2 modified, 1 created)

## Accomplishments
- ProductCard is now a Client Component with QuickAdd sub-component; clicking "Add to Cart" adds 1 unit without navigating to the product detail page
- AddToCartSection extracted as standalone Client Component with quantity stepper (min=1, max=99) and Add to Cart button wired to useCartStore
- Product detail page ([slug]/page.tsx) remains a Server Component — AddToCartSection is imported as a client sub-component, following Next.js 15 patterns
- Both surfaces use product.id as the cart key (consistent with cartStore's addToCart contract)
- TypeScript compiles clean with no errors after both changes

## Task Commits

Each task was committed atomically:

1. **Task 1: Add QuickAdd button to ProductCard** - `e5f2f7f` (feat)
2. **Task 2: Wire product detail page to cart (AddToCartSection)** - `324b95e` (feat)
3. **Task 3: End-to-end verification** - awaiting human-verify checkpoint

## Files Created/Modified
- `app/components/ProductCard.tsx` - Converted to 'use client'; QuickAdd sub-component with e.preventDefault/stopPropagation, feedback state, sold-out handling
- `app/components/AddToCartSection.tsx` - NEW: Client Component with quantity stepper ([-] qty [+], min=1, max=99) and Add to Cart button; handles sold-out, feedback state
- `app/shop/[slug]/page.tsx` - Imports AddToCartSection; placeholder button block replaced with `<AddToCartSection productId={product.id} ... />`

## Decisions Made

**AddToCartSection as separate file (not inline):** Next.js 15 cannot mix `'use client'` and `async` server functions in the same file. Since `[slug]/page.tsx` uses `async` for server-side data fetching, the interactive component must live in a separate file.

**ProductCard becomes 'use client' entirely:** The QuickAdd sub-component needs `useState` for feedback. In Next.js 15 with the App Router, all components in a 'use client' file are client-rendered. Since ProductCard is a leaf component (not a layout), this is appropriate.

**product.id as cart key:** The plan specified using `product.id` (DatoCMS stable ID) rather than `product.slug`. Slugs can change for SEO reasons; IDs are immutable. Both QuickAdd and AddToCartSection use `product.id`.

**Quantity bounds min=1, max=99:** Min enforced by disabling the decrement button at 1. Max=99 is a defensive cap; actual stock validation deferred to Phase 3 checkout.

## Deviations from Plan

None — plan executed exactly as written. The correct architecture (separate file for AddToCartSection) was clearly specified in the plan after the planner worked through the Next.js 15 constraint inline.

## Issues Encountered

None. TypeScript compiled cleanly after both tasks with no errors.

## User Setup Required

None — no external service configuration required.

## Next Phase Readiness
- Task 3 (human-verify checkpoint) is pending: user needs to run dev server and verify the full add-to-cart flow end-to-end
- After Task 3 approval, Phase 2 Plan 03 is fully complete
- Phase 2 Plan 02 (cart badge in Navigation) is running in parallel — no file conflicts
- Phase 3 (Checkout & Order Form) can proceed once Phase 2 plans 02 and 03 are verified

---
*Phase: 02-shopping-cart*
*Completed: 2026-03-01*

## Self-Check: PASSED

- FOUND: app/components/ProductCard.tsx
- FOUND: app/components/AddToCartSection.tsx
- FOUND: app/shop/[slug]/page.tsx
- FOUND: .planning/phases/02-shopping-cart/02-03-SUMMARY.md
- FOUND: commit e5f2f7f (Task 1 — QuickAdd button)
- FOUND: commit 324b95e (Task 2 — AddToCartSection)
