---
phase: 04-portfolio-foundation
plan: "01"
subsystem: ui
tags: [nextjs, app-router, route-groups, layouts]
requires:
  - phase: 03-shop-ux
    provides: Existing shop/cart/checkout/faq routes and UI components
provides:
  - Isolated `(shop)` route-group layout for shop chrome
  - Minimal root layout without shop-specific navigation/footer
  - Shop routes moved under route group with unchanged public URLs
affects: [04-02-portfolio-pages, layout-architecture, routing]
tech-stack:
  added: []
  patterns: [Next.js App Router route-group layout isolation]
key-files:
  created: [app/(shop)/layout.tsx]
  modified: [app/layout.tsx, app/components/Navigation.tsx, app/components/Footer.tsx, app/(shop)/checkout/page.tsx]
key-decisions:
  - "Use `(shop)` layout as exclusive owner of Navigation/Footer so components render unconditionally."
  - "Keep root layout minimal (html/body/analytics/main only) to unblock portfolio route groups."
patterns-established:
  - "Section-specific chrome lives in route-group layouts, not root layout conditionals."
  - "Shared components avoid pathname detection when layout boundaries already define scope."
requirements-completed: [SITE-03]
duration: 18min
completed: 2026-03-05
---

# Phase 04 Plan 01: Portfolio Foundation Summary

**Route-group based layout isolation for shop pages with root layout stripped to analytics/body shell**

## Performance

- **Duration:** 18 min
- **Started:** 2026-03-04T19:05:00Z
- **Completed:** 2026-03-04T19:23:00Z
- **Tasks:** 2
- **Files modified:** 12

## Accomplishments
- Created `app/(shop)/layout.tsx` that wraps shop routes with `Navigation` and `Footer`.
- Removed shop chrome ownership from `app/layout.tsx`, keeping it as root shell only.
- Moved shop/cart/checkout/faq routes under `app/(shop)/...` while keeping external URLs unchanged.
- Simplified `Navigation` and `Footer` by removing `SHOP_ROUTES` and `usePathname` route checks.

## Task Commits

Each task was committed atomically:

1. **Task 1: Minimize root layout and create (shop) route group with layout** - `4b2ca1f` (feat)
2. **Task 2: Move shop pages into (shop) route group and simplify components** - `62ff91e` (feat)

## Files Created/Modified
- `app/(shop)/layout.tsx` - New shop route-group layout with navigation/footer.
- `app/layout.tsx` - Root layout now excludes shop navigation/footer.
- `app/(shop)/shop/page.tsx` - Shop index moved into route group.
- `app/(shop)/shop/about/page.tsx` - Shop about moved into route group.
- `app/(shop)/shop/[slug]/page.tsx` - Shop detail route moved into route group.
- `app/(shop)/cart/page.tsx` - Cart route moved into route group.
- `app/(shop)/checkout/page.tsx` - Checkout route moved + action import path updated.
- `app/(shop)/checkout/actions.ts` - Checkout actions moved with checkout route.
- `app/(shop)/checkout/success/page.tsx` - Checkout success route moved.
- `app/(shop)/faq/page.tsx` - FAQ route moved into route group.
- `app/components/Navigation.tsx` - Removed pathname-based route gating.
- `app/components/Footer.tsx` - Removed pathname-based route gating; now always renders when included.

## Decisions Made
- Route ownership was shifted from component-level conditionals to layout boundaries to reduce complexity and future coupling.
- `Footer` was converted to server-safe rendering by removing unnecessary `'use client'` once `usePathname` logic was removed.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Fixed checkout action import after route move**
- **Found during:** Task 2 (route move and verification)
- **Issue:** `app/(shop)/checkout/page.tsx` still imported `@/app/checkout/actions` after move.
- **Fix:** Updated import to `@/app/(shop)/checkout/actions`.
- **Files modified:** `app/(shop)/checkout/page.tsx`
- **Verification:** `npx tsc --noEmit` passed.
- **Committed in:** `62ff91e` (part of Task 2 commit)

---

**Total deviations:** 1 auto-fixed (1 blocking)
**Impact on plan:** Required for correctness after file relocation; no scope creep.

## Issues Encountered
- Stale `.next/types` route artifacts referenced old file paths during intermediate verification. Resolved by regenerating route types and rerunning TypeScript checks.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness
- Layout architecture prerequisite is complete for portfolio route-group work in subsequent plans.
- Shop URLs remain stable and now inherit chrome from route-group layout only.

## Self-Check: PASSED
- FOUND: `.planning/phases/04-portfolio-foundation/04-01-SUMMARY.md`
- FOUND: `4b2ca1f`
- FOUND: `62ff91e`

---
*Phase: 04-portfolio-foundation*
*Completed: 2026-03-05*
