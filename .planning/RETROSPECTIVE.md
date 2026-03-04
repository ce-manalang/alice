# Project Retrospective

*A living document updated after each milestone. Lessons feed forward into future planning.*

## Milestone: v1.0 — MVP

**Shipped:** 2026-03-04
**Phases:** 3 | **Plans:** 10 | **Timeline:** 7 days

### What Was Built
- Complete product catalog with DatoCMS integration, category browsing, and SEO-optimized product detail pages
- Shopping cart with Zustand + localStorage persistence, quantity management, and sold-out auto-removal
- Meetup-based checkout flow with Server Actions, Supabase order storage, and Resend email notifications
- Design system with shop-* CSS prefix convention, Inter font, sticky navigation, and responsive layout
- Homepage hero with featured products, FAQ with zero-JS accordion, About page with brand story
- 5 post-milestone quick tasks for polish (empty states, route reorganization, GitHub issue tracking)

### What Worked
- Quick depth (3 phases) was right for a sub-20-product shop — clear dependencies, no over-engineering
- Unified [slug] route elegantly handled both categories and product detail without dynamic segment conflicts
- shop-* CSS prefix convention cleanly separated shop styles from existing comics page CSS
- Fire-and-forget email pattern kept checkout resilient — email failures never block orders
- Server-side price re-fetch in checkout prevents client-side price manipulation

### What Was Inefficient
- DatoCMS schema drift caused multiple workarounds (missing available/category fields)
- Phase 2 plan count mismatch in tooling (roadmap says 3 plans but disk had different structure)
- Some decisions recorded in STATE.md grew large — could benefit from periodic pruning
- Quick tasks after milestone needed route restructuring that could have been planned upfront

### Patterns Established
- shop-* CSS prefix for all shop design system classes
- Zustand with persist middleware for client-side state that survives refresh
- Server Actions with server-side data re-fetch for any form that touches money
- HTML details/summary for zero-JS interactive UI (accordion pattern)
- SSR hydration guards (isMounted, hasHydrated) for client-only UI

### Key Lessons
1. Finalize CMS schema before Phase 1 starts — schema drift causes cascading workarounds
2. Quick depth works well for small, well-understood projects with clear feature dependencies
3. Post-milestone polish tasks (quick tasks) are valuable for catching UX issues before deployment
4. Unified route patterns (one [slug] handling multiple content types) simplify Next.js routing

### Cost Observations
- Model mix: budget profile (primarily sonnet for planning/execution, haiku for checking)
- Sessions: ~10 across 7 days
- Notable: Quick depth + budget profile kept costs low for a complete e-commerce flow

---

## Cross-Milestone Trends

### Process Evolution

| Milestone | Timeline | Phases | Key Change |
|-----------|----------|--------|------------|
| v1.0 | 7 days | 3 | Initial milestone — established GSD patterns |

### Top Lessons (Verified Across Milestones)

1. (Pending — will populate after v1.1)
