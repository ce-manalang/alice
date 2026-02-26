# Project State: Centimentalcomics Shop

**Project:** Centimentalcomics Indie E-Commerce Shop Rebuild
**Updated:** 2026-02-26
**Status:** Phase 1 Execution In Progress — Plan 02 Complete (awaiting human-verify)

---

## Project Reference

**Core Value:** Customers can browse the product catalog and submit orders for educational CS products — if nothing else works, browsing and ordering must.

**Stack:** Next.js 15 + TypeScript + Tailwind CSS + DatoCMS (GraphQL) + Zustand (cart) + Server Actions (checkout) + Resend (emails)

**Fulfillment Model:** Meetup-based (no payment processing, orders collected via form, arranged in-person)

**Current Focus:** Establish product catalog foundation and DatoCMS integration patterns

---

## Current Position

**Milestone:** Centimentalcomics Shop v1
**Phase:** 01 — Product Catalog & Foundation (Plan 2/5 complete)
**Roadmap:** ROADMAP.md (3 phases, 19 v1 requirements)
**Next:** Phase 1 Plan 03 (Wave 2 parallel plans)

**Progress:**
```
Phase 1:    [████░░░░░░] 40% (2/5 plans)
Execution:  [████░░░░░░░░░░░░░░░░] In Progress
```

---

## Phases Overview

| Phase | Goal | Requirements | Status |
|-------|------|--------------|--------|
| 1 | Product Catalog & Foundation | 12 reqs | Pending → Planning |
| 2 | Shopping Cart | 4 reqs | Pending |
| 3 | Checkout & Order Form | 3 reqs | Pending |

---

## Performance Metrics

**Roadmap Quality:**
- Coverage: 19/19 requirements mapped ✓
- Orphaned requirements: 0 ✓
- Phases coherent: Yes ✓
- Success criteria observable: Yes ✓

**Research Integration:**
- Stack validated: Next.js 15 + DatoCMS ✓
- Critical pitfalls identified: 5 ✓
- Phase ordering research-backed: Yes ✓

---

## Accumulated Context

### Key Decisions

| Decision | Status | Notes |
|----------|--------|-------|
| Rebuild from scratch | Committed | Current codebase doesn't match vision |
| Keep Next.js/TS/Tailwind stack | Committed | Familiar, good for SSG shop |
| DatoCMS for product data | Committed | Existing integration, webhook revalidation |
| Order form + meetup checkout | Committed | No payment gateway, simple fulfillment |
| 3-phase roadmap | Committed | Quick depth, clear dependencies |
| ProductCategory as union type | Committed | Simpler than enum, compatible with DatoCMS string fields |
| Cache tags at datocmsRequest level | Committed | All fetches tagged 'products' for on-demand revalidation |
| Product.available as boolean | Committed | DatoCMS boolean field; UI derives label from value |
| Accent color #ec4899 (pink-500) | Committed | Matches existing .pay-now-btn brand color for indie/zine aesthetic |
| shop-* CSS prefix convention | Committed | All design system classes use this prefix to avoid collision with comic page CSS |
| Inter via next/font/google | Committed | Font optimization (subsetting, no layout shift); existing page.tsx nav duplication resolved in Plan 05 |

### Critical Pitfalls to Avoid

1. **Silent fetch caching = stale product data**
   - Use `cache: "no-store"` for product fetches
   - Set `useCdn: false` in DatoCMS client
   - Test in production-like deployment

2. **Cart state lost on page refresh**
   - Implement localStorage persistence upfront
   - Use Zustand with persist middleware
   - Test with hard-refresh, multiple tabs

3. **SEO ranking loss from URL structure changes**
   - Finalize product URL slugs NOW (Phase 1)
   - Implement 301 redirects in `next.config.js`
   - Preserve category structure and internal links

4. **DatoCMS schema drift**
   - Store schema.graphql in Git
   - Run `pnpm datocms:generate` after schema changes
   - Use `gql.tada` for query validation

5. **Over-engineering for <20 products**
   - Use static site generation (build once, cache forever)
   - Simple localStorage cart
   - Defer Supabase/payment/admin until needed

### Technical Constraints

- Tech stack: Next.js 15 + TypeScript + Tailwind CSS (locked)
- Content source: DatoCMS (existing integration)
- Hosting: Vercel (existing setup)
- Package manager: pnpm
- No payment processing (meetup-based fulfillment)
- Under 20 products

### Outstanding Questions

- [ ] Order storage decision: JSON file + email, Supabase, or external service?
- [ ] Product URL finalization: Confirm slug strategy before Phase 1 ships
- [ ] DatoCMS data bulk import: Need custom script for Notion/spreadsheet migration?
- [ ] Cart persistence edge cases: Fallback strategy for Safari Private mode / localStorage unavailable?

---

## Session Continuity

**Last Action:** Completed Phase 1 Plan 02 — design system, Navigation/Footer components, root layout with Inter font

**Stopped At:** Completed 01-02-PLAN.md — awaiting human-verify checkpoint

**Context Preserved:** All execution artifacts written to disk
- `.planning/phases/01-product-catalog-foundation/01-01-SUMMARY.md` — Plan 01 summary
- `.planning/phases/01-product-catalog-foundation/01-02-SUMMARY.md` — Plan 02 summary
- `app/lib/types.ts` — Product interface and category/availability types
- `app/lib/constants.ts` — Shared constants (includes SOCIAL_LINKS)
- `app/lib/datocms-queries.ts` — 5 product queries + existing comics query
- `app/lib/datocms.ts` — Cache tags enabled
- `app/components/Navigation.tsx` — Sticky header with shop/about/faq links
- `app/components/Footer.tsx` — Footer with Instagram/Twitter social links
- `app/layout.tsx` — Root layout with Inter font, Navigation + Footer
- `tailwind.config.ts` — Accent color (#ec4899) and Inter font family
- `app/globals.css` — Shop design system CSS classes appended

---

## Quick Reference

**To review roadmap:**
```
cat .planning/ROADMAP.md
```

**To start Phase 1 planning:**
```
/gsd:plan-phase 1
```

**To see current requirements:**
```
cat .planning/REQUIREMENTS.md
```

**Key research insights:**
- Phase 1 forces upfront decisions on fetch caching, URL structure, DatoCMS schema (expensive to change later)
- Phase 2 tests cart UX with localStorage persistence (Zustand or Context)
- Phase 3 completes flow with Server Actions and order storage
- Pre-launch (Phase 4 in research) deferred to v1.x — focus on core flow first

---

*State snapshot: 2026-02-26 — Phase 1 Plan 01 complete, Wave 2 unblocked*
