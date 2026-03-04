---
phase: 02-shopping-cart
plan: 01
subsystem: ui
tags: [zustand, localStorage, cart, state-management, persist-middleware]

# Dependency graph
requires:
  - phase: 01-product-catalog-foundation
    provides: CartItem type foundation via types.ts; Product type and slug established

provides:
  - useCartStore Zustand hook with 7 actions and localStorage persistence
  - CartItem interface in types.ts (productId: string, quantity: number)
  - centimentalcomics-cart localStorage key for cart state
  - hasHydrated SSR guard pattern for client-side hydration

affects: [02-02-add-to-cart, 02-03-cart-page, 03-checkout]

# Tech tracking
tech-stack:
  added: [zustand@5.0.11]
  patterns: [zustand-persist-middleware, ssr-hydration-guard-pattern]

key-files:
  created:
    - app/lib/store/cartStore.ts
  modified:
    - app/lib/types.ts
    - package.json
    - pnpm-lock.yaml

key-decisions:
  - "addToCart silently increments quantity when item already exists (no duplicates, no error)"
  - "clearCart explicitly removes localStorage key 'centimentalcomics-cart' to prevent re-hydration on next load"
  - "updateQuantity treats quantity <= 0 as item removal (defensive coding, stepper enforces min=1 normally)"
  - "hasHydrated flag initialized to false; set to true in onRehydrateStorage callback to prevent SSR mismatch"
  - "No cart expiration — persists indefinitely per user decision"
  - "localStorage key namespaced as 'centimentalcomics-cart' to avoid collision with other apps on same domain"

patterns-established:
  - "SSR hydration guard: check hasHydrated before rendering cart-dependent UI (prevents Next.js SSR mismatch)"
  - "Defensive quantity: remove item when quantity <= 0 rather than allowing invalid state"
  - "Explicit localStorage cleanup in clearCart rather than relying on Zustand persist to overwrite"

requirements-completed: [CART-01, CART-04]

# Metrics
duration: 1min
completed: 2026-03-01
---

# Phase 2 Plan 01: Zustand Cart Store with localStorage Persistence Summary

**Zustand 5 cart store with persist middleware, 7 typed actions, and SSR hydration guard using hasHydrated flag**

## Performance

- **Duration:** ~1 min
- **Started:** 2026-03-01T09:41:47Z
- **Completed:** 2026-03-01T09:43:00Z
- **Tasks:** 2
- **Files modified:** 4

## Accomplishments

- Installed zustand 5.0.11 and added CartItem interface to types.ts
- Created useCartStore with full cart lifecycle (add, remove, update, clear, total)
- Persist middleware writes/reads from localStorage key 'centimentalcomics-cart'
- hasHydrated flag prevents SSR hydration mismatch in cart-aware components
- clearCart explicitly removes localStorage key so stale items cannot re-hydrate

## Task Commits

Each task was committed atomically:

1. **Task 1: Install Zustand and add CartItem to types.ts** - `3930c6c` (feat)
2. **Task 2: Create Zustand cart store with localStorage persistence** - `2f91954` (feat)

## Files Created/Modified

- `app/lib/store/cartStore.ts` - useCartStore Zustand hook with persist middleware and all 7 cart actions
- `app/lib/types.ts` - Added CartItem interface (productId: string, quantity: number)
- `package.json` - Added zustand@^5.0.11 to dependencies
- `pnpm-lock.yaml` - Lockfile updated with zustand and peer deps

## CartStore Actions Reference

| Action | Signature | Behavior |
|--------|-----------|----------|
| `addToCart` | `(productId: string, quantity?: number) => void` | Adds new item or increments existing silently |
| `removeFromCart` | `(productId: string) => void` | Filters item from array by productId |
| `updateQuantity` | `(productId: string, quantity: number) => void` | Sets quantity; removes item if quantity <= 0 |
| `clearCart` | `() => void` | Empties items[] AND removes localStorage key |
| `getTotalItems` | `() => number` | Reduces items to sum of all quantities |
| `setHasHydrated` | `(value: boolean) => void` | Called by onRehydrateStorage callback |
| `hasHydrated` | `boolean` | Guards SSR-sensitive cart UI from mismatching |

## Decisions Made

- **addToCart increments silently**: No duplicate line items; cleaner cart UX. User-decided in CONTEXT.md.
- **clearCart removes localStorage key**: `localStorage.removeItem('centimentalcomics-cart')` ensures items don't re-hydrate on next page load even if Zustand persist has a race condition.
- **hasHydrated guard**: CartIcon badge and cart page quantity displays should check `hasHydrated` before rendering to prevent Next.js hydration mismatch (server renders 0 items, client hydrates with stored items).
- **No TTL**: Cart persists indefinitely. Simple, predictable, no user frustration from unexpected expirations.

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None.

## User Setup Required

None - no external service configuration required. Cart state uses browser localStorage only.

## Next Phase Readiness

- **Wave 2 unblocked**: Both 02-02 (Add-to-Cart buttons) and 02-03 (Cart page) can now import `useCartStore` from `@/app/lib/store/cartStore`
- **Import pattern**: `import { useCartStore } from '@/app/lib/store/cartStore'`
- **SSR guard pattern**: Components should gate cart-count display on `useCartStore((s) => s.hasHydrated)` to prevent hydration mismatch

## Self-Check: PASSED

- app/lib/store/cartStore.ts: FOUND
- app/lib/types.ts: FOUND
- 02-01-SUMMARY.md: FOUND
- Commit 3930c6c (Task 1): FOUND
- Commit 2f91954 (Task 2): FOUND

---
*Phase: 02-shopping-cart*
*Completed: 2026-03-01*
