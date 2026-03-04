---
phase: 02-shopping-cart
plan: 02
subsystem: ui
tags: [zustand, datocms, next.js, cart, ssr, react]

# Dependency graph
requires:
  - phase: 02-01
    provides: useCartStore with items, addToCart, removeFromCart, updateQuantity, clearCart, getTotalItems, hasHydrated

provides:
  - CartIcon component in Navigation with pink item-count badge and isMounted SSR guard
  - /cart page (app/cart/page.tsx) with empty state, item list, quantity stepper, remove, clear cart, subtotal, checkout link
  - DatoCMS live-fetch on cart page load with sold-out auto-removal and dismissable notice
  - shop-cart-* CSS classes in app/globals.css for cart page layout

affects:
  - 02-03 (add-to-cart wiring — this plan delivers the cart UX surface; 03 wires product detail buttons)
  - 03-checkout (cart page links to /checkout)

# Tech tracking
tech-stack:
  added: []
  patterns:
    - isMounted guard for SSR-safe client-only rendering (cart badge in Navigation)
    - Client Component with useEffect fetch on mount for cart product data from DatoCMS
    - Sold-out auto-removal pattern: fetch → compare → removeFromCart → show notice
    - QtyStepper inline component: decrement at 1 removes the item rather than disabling button

key-files:
  created:
    - app/cart/page.tsx
  modified:
    - app/components/Navigation.tsx
    - app/globals.css

key-decisions:
  - "isMounted guard in CartIcon prevents SSR hydration mismatch for badge"
  - "Cart page fetches fresh DatoCMS data on load (client-side useEffect) to catch price/availability changes"
  - "Quantity stepper: decrement at qty=1 removes item (not disabled button)"
  - "Sold-out items auto-removed on cart load with dismissable amber banner notice"

patterns-established:
  - "isMounted pattern: useState(false) + useEffect setIsMounted(true) for SSR-safe client renders"
  - "Cart page is a Client Component that fetches DatoCMS data via useEffect on mount"
  - "shop-cart-* CSS prefix for all cart-specific design system classes"

requirements-completed: [CART-02, CART-03, CART-04]

# Metrics
duration: 2min
completed: 2026-03-01
---

# Phase 02 Plan 02: Cart Page and Navigation Badge Summary

**Shopping bag icon with live count badge in Navigation header, plus full /cart page with item management, quantity stepper, sold-out auto-removal, and checkout link**

## Performance

- **Duration:** 2 min
- **Started:** 2026-03-01T09:46:01Z
- **Completed:** 2026-03-01T09:48:07Z
- **Tasks:** 2 auto tasks complete (Task 3 is human-verify checkpoint)
- **Files modified:** 3

## Accomplishments
- Navigation header now shows shopping bag SVG with pink (#ec4899) item-count badge, rendered only after client hydration using isMounted guard — no SSR mismatch
- Full /cart page built as Client Component: empty state with "Browse the shop" link, item list with thumbnail/name/price/stepper/subtotal, sold-out auto-removal with amber notice banner, clear cart, and "Proceed to Checkout" link to /checkout
- Cart CSS design system extended with shop-cart-* classes for all cart page layout (item rows, qty stepper, summary, buttons, notice banner, empty state)

## Task Commits

Each task was committed atomically:

1. **Task 1: Add CartIcon to Navigation header** - `4ca58d8` (feat)
2. **Task 2: Build /cart page with item management and add cart CSS** - `916c14f` (feat)

## Files Created/Modified
- `app/components/Navigation.tsx` - Converted to 'use client'; CartIcon with shopping bag SVG + isMounted-guarded pink badge; links to /cart
- `app/cart/page.tsx` - Full cart page: empty state, DatoCMS fetch, sold-out auto-removal notice, item list with QtyStepper, remove button, clear cart, subtotal, checkout link (305 lines)
- `app/globals.css` - Appended shop-cart-* CSS classes: item row, image, details, qty stepper, subtotal, remove button, summary, actions, primary/secondary buttons, notice banner, empty state; responsive summary alignment

## Decisions Made
- Used `isMounted` (local state) rather than `hasHydrated` (store flag) for the cart badge — simpler and sufficient for the single badge use case; hasHydrated is used by more complex consumers
- Cart page calls `datocmsRequest` from a client-side `useEffect` (runs in browser) — the `next: {}` cache options in datocmsRequest are silently ignored in browser context, which is acceptable; fresh data is fetched on each cart page load
- Auto-removal of sold-out products uses `available === false` strict check consistent with Plan 04 decisions
- Quantity stepper decrement at qty=1 removes the item (no disabled state at minimum) — follows CONTEXT.md locked decision

## Deviations from Plan
None - plan executed exactly as written.

## Issues Encountered
None.

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- CartIcon and /cart page are fully functional
- Task 3 (checkpoint:human-verify) requires visual verification in browser: navigation badge visible, /cart empty state renders correctly, no hydration errors in console
- After Task 3 verification, Plan 02-03 wires Add-to-Cart buttons on product detail page — at that point all three cart surfaces (badge, cart page, add-to-cart) will be connected

---
*Phase: 02-shopping-cart*
*Completed: 2026-03-01*
