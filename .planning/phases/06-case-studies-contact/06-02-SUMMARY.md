---
phase: 06-case-studies-contact
plan: "02"
subsystem: ui
tags: [nextjs, typescript, portfolio, case-studies, navigation]
requires:
  - phase: 06-case-studies-contact
    provides: canonical typed case-study data and dynamic slug detail routes from 06-01
provides:
  - Canonical `/case-studies` index cards with problem and measurable outcome signals
  - Deterministic published ordering for index and homepage featured selection
  - Homepage featured links derived from canonical slug data to prevent route drift
affects: [06-03-PLAN, CASE-01, CASE-03]
tech-stack:
  added: []
  patterns: [single-source content mapping, slug-derived link generation, portfolio-scoped styling]
key-files:
  created: []
  modified:
    - app/(portfolio)/case-studies/page.tsx
    - app/(portfolio)/portfolio/page.tsx
    - app/lib/portfolio-data.ts
    - app/globals.css
key-decisions:
  - "Case-study index ordering is encoded in shared data via `getPublishedCaseStudies` so all surfaces render the same sequence."
  - "Homepage featured cards generate hrefs from canonical slugs at render time instead of relying on hardcoded routes."
patterns-established:
  - "All portfolio case-study browsing cards include problem summary and measurable outcome before linking to detail pages."
  - "Cross-page case-study links are always composed as `/case-studies/${slug}` from canonical data."
requirements-completed: [CASE-01, CASE-03]
duration: 11min
completed: 2026-03-13
---

# Phase 6 Plan 02: Case Studies Discovery and Link Integrity Summary

**Published case studies now render as a full portfolio index with measurable outcomes, and homepage featured cards link to canonical slug routes without drift.**

## Performance

- **Duration:** 11 min
- **Started:** 2026-03-13T08:55:47Z
- **Completed:** 2026-03-13T09:06:23Z
- **Tasks:** 2
- **Files modified:** 4

## Accomplishments
- Replaced the `/case-studies` placeholder page with cards sourced from canonical typed case-study data.
- Added required index-card fields (title, problem summary, measurable outcome) and valid slug detail links for each study.
- Aligned homepage featured cards to canonical slug-derived links and constrained selection to the top three published studies.

## Task Commits

1. **Task 1: Replace case-studies placeholder with canonical index list** - `4a1b531` (feat)
2. **Task 2: Align homepage featured links with canonical case-study slugs** - `ef674fc` (feat)

## Files Created/Modified
- `app/(portfolio)/case-studies/page.tsx` - Implements full canonical index render with required card fields and slug links.
- `app/lib/portfolio-data.ts` - Adds deterministic published ordering helper and canonical featured derivation from shared data.
- `app/globals.css` - Adds minimal `portfolio-case-study-*` classes for card hierarchy and readable mobile layout.
- `app/(portfolio)/portfolio/page.tsx` - Derives featured links directly from canonical case-study slugs in homepage render.

## Decisions Made
- Kept case-study sequencing centralized in `getPublishedCaseStudies()` so index and featured sections stay consistent.
- Kept style changes strictly under `portfolio-*` namespace to avoid spillover to comics/shop surfaces.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Corrected planned homepage target file to actual portfolio homepage route**
- **Found during:** Task 2
- **Issue:** Plan listed `app/page.tsx`, but featured case-study cards are actually rendered in `app/(portfolio)/portfolio/page.tsx`.
- **Fix:** Applied featured-link canonicalization in the true render owner file while preserving plan objective.
- **Files modified:** `app/(portfolio)/portfolio/page.tsx`
- **Verification:** `pnpm exec tsc --noEmit` passed and links are generated as `/case-studies/${slug}`.
- **Committed in:** `ef674fc`

---

**Total deviations:** 1 auto-fixed (1 bug)
**Impact on plan:** Deviation was required to implement the intended behavior on the correct route owner file with no scope expansion.

## Issues Encountered

None.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- CASE-01 and CASE-03 discovery/linking requirements are implemented for case-study browsing and homepage featured navigation.
- Contact delivery work in subsequent plans can proceed without case-study link drift risk.

---
*Phase: 06-case-studies-contact*
*Completed: 2026-03-13*

## Self-Check: PASSED
