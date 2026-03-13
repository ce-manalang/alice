# Phase 5 Research: Core Portfolio Pages

**Phase:** 05-core-portfolio-pages  
**Date:** 2026-03-06  
**Sources:** Repository files only (`.planning/*`, `app/(portfolio)/*`, `app/components/portfolio-*`, `app/page.tsx`, `app/globals.css`, `app/layout.tsx`, `app/(shop)/layout.tsx`)

## Executive Findings

Phase 5 is structurally ready after Phase 4, but there is one critical architecture mismatch: the required portfolio homepage content (HOME-01..04) is expected at `/`, while `app/page.tsx` is still the comics homepage. The portfolio navigation currently points `home` to `/`, so requirements and live route behavior are not aligned yet.

Aside from that route decision, the codebase already has a strong reusable foundation:
- Portfolio layout shell and metadata baseline in `app/(portfolio)/layout.tsx`
- Portfolio navigation/footer components already mounted for portfolio routes
- Portfolio-specific design tokens and primitives in `app/globals.css` (`portfolio-*`)
- Placeholder engineering/resume pages already using portfolio page primitives

## Current Architecture Fit

## What Already Fits Phase 5

- Route group split is in place (`(portfolio)` vs `(shop)`), matching Phase 4 decisions and SITE requirements.
- `app/(portfolio)/layout.tsx` wraps children with `PortfolioNavigation` and `PortfolioFooter`; this enables consistent shell behavior across engineering/resume/case/contact routes.
- `app/globals.css` already defines a scoped portfolio style system (`--portfolio-*` variables and utility classes like `portfolio-page`, `portfolio-section`, `portfolio-heading-1`, `portfolio-text-muted`).
- Metadata exports already exist on `engineering`, `resume`, and portfolio layout.

## Architecture Gap to Resolve First

- `app/page.tsx` is still comics content.
- `app/components/portfolio-navigation.tsx` links `home` to `/`.
- Phase 5 requirements and roadmap success criteria explicitly treat homepage as portfolio entry point with hero/strengths/case cards/timeline.

**Implication:** Planner must decide and implement homepage route ownership before or at start of HOME work.

## Requirement Coverage Analysis

## HOME-01 (hero + CTAs)

**Status now:** Not implemented.

**Needed implementation:**
- Build portfolio hero section with explicit Rails engineer positioning and two CTAs (`/case-studies`, `/resume`).
- Keep above-the-fold concise per context doc.

**Best fit location:**
- Target route `/` (preferred by roadmap/requirements), which implies replacing current `app/page.tsx` behavior or moving comics homepage elsewhere.

## HOME-02 (core strengths)

**Status now:** Not implemented.

**Needed implementation:**
- Add strengths section covering Rails, system design, performance, deployment, maintenance.
- Use short outcome-oriented statements (not tool-only bullets).

**Reusable styling:** `portfolio-section`, `portfolio-container`, heading and muted text primitives.

## HOME-03 (2-3 featured case cards)

**Status now:** Not implemented.

**Needed implementation:**
- Add 2-3 featured cards with title, short description, and links to full case studies.
- Since Phase 6 owns case study content, Phase 5 can ship cards with stable placeholders/teasers pointing to `/case-studies` or planned slugs, but should avoid broken links.

## HOME-04 (condensed timeline)

**Status now:** Not implemented.

**Needed implementation:**
- Add condensed progression timeline section on homepage.
- Should align with resume chronology to avoid contradictory narratives.

## ENG-01 (categorized stack)

**Status now:** Placeholder only in `app/(portfolio)/engineering/page.tsx`.

**Needed implementation:**
- Replace placeholder with category blocks: backend, frontend, infrastructure, tools.
- Include practical usage context (from phase context: curated depth, not exhaustive inventory).

## ENG-02 (testing + code quality emphasis)

**Status now:** Not implemented.

**Needed implementation:**
- Add dedicated section that pairs practice with outcome (e.g., test practices -> reliability/delivery impact).
- Keep claims operational and production-grounded.

## RESM-01 (clean structured resume page)

**Status now:** Placeholder only in `app/(portfolio)/resume/page.tsx`.

**Needed implementation:**
- Single-page structure with clear sections: summary, experience, skills, selected outcomes.
- Role entries should be consistently formatted and scannable.

## RESM-02 (stability, collaboration, production systems)

**Status now:** Not implemented.

**Needed implementation:**
- Resume bullets must foreground ownership arc and production system responsibility.
- Collaboration context should be embedded in role bullets (PM/design/QA, etc.), not isolated in a separate generic section.

## Reusable Assets and Patterns

## Directly Reusable Files

- `app/(portfolio)/layout.tsx`
  - Keep as shell owner for portfolio nav/footer and metadata template.
- `app/components/portfolio-navigation.tsx`
  - Existing IA links already match SITE-01; may need home link adjustment depending on route decision.
- `app/components/portfolio-footer.tsx`
  - Already satisfies shop-link demotion pattern.
- `app/(portfolio)/engineering/page.tsx`, `app/(portfolio)/resume/page.tsx`
  - Correct route/files exist; replace placeholders instead of creating new routes.

## CSS Reuse Baseline

From `app/globals.css` portfolio block:
- Tokens: `--portfolio-color-*`, `--portfolio-font`
- Layout primitives: `.portfolio-page`, `.portfolio-container`, `.portfolio-section`
- Type primitives: `.portfolio-heading-1`, `.portfolio-text-muted`

These are enough for Phase 5 baseline implementation; add only minimal new `portfolio-*` classes for cards/grids/timeline where needed.

## Risks and Mitigations

1. **Route ownership risk (critical):** portfolio homepage requirements target `/`, but comics currently occupies `/`.
- Mitigation: make this the first planning decision and first implementation step (move comics route or repurpose root).

2. **Broken credibility risk:** placeholders or vague copy can pass visual checks but fail requirement intent.
- Mitigation: checker must verify each section includes concrete outcomes, not generic claims.

3. **Cross-phase dependency risk (HOME-03 vs Phase 6 case studies):** featured cards may link to not-yet-built detail pages.
- Mitigation: in Phase 5, link cards to `/case-studies` index or use explicit temporary behavior; avoid dead links.

4. **Style leakage risk:** adding non-prefixed classes in `globals.css` can affect shop/comics.
- Mitigation: enforce `portfolio-*` prefix for all new Phase 5 styles.

5. **Narrative mismatch risk:** homepage timeline and resume chronology can diverge.
- Mitigation: define a single source chronology during planning and apply to both HOME-04 and resume experience order.

## Recommended Plan Slicing (for next planner)

1. **Plan 05-01: Homepage Route Decision + Scaffold**
- Resolve `/` ownership and navigation home target.
- Implement HOME-01 hero + CTA structure.
- Add base homepage sections stubs for strengths/case/timeline so checker can validate layout integrity early.

2. **Plan 05-02: Homepage Content Completion**
- Complete HOME-02, HOME-03, HOME-04 with production-ready copy and section styling.
- Ensure featured case cards avoid dead-end links.

3. **Plan 05-03: Engineering Page Completion**
- Implement ENG-01 categorized stack blocks.
- Implement ENG-02 testing/code-quality practice-and-outcome section.

4. **Plan 05-04: Resume Page Completion + Consistency Pass**
- Implement RESM-01 structured single-page resume layout.
- Implement RESM-02 stability/collaboration/production emphasis.
- Run cross-page consistency pass (homepage timeline vs resume chronology).

5. **Plan 05-05: Verification Checkpoint**
- Requirement-based QA for HOME-01..04, ENG-01..02, RESM-01..02.
- Metadata/path/link sanity check and mobile responsiveness check.

## Checker-Oriented Acceptance Checklist

- HOME-01: `/` shows Rails-positioned hero and exactly two prominent CTAs (`View Case Studies`, `View Resume`).
- HOME-02: strengths section includes all five required competency areas with outcome-oriented language.
- HOME-03: 2-3 featured cards render with title, description, and working links.
- HOME-04: condensed timeline is visible and coherent.
- ENG-01: `/engineering` has four categories (backend, frontend, infrastructure, tools).
- ENG-02: `/engineering` includes explicit testing + code quality section with practice->outcome framing.
- RESM-01: `/resume` contains clear summary/experience/skills/progression structure in one page.
- RESM-02: resume content emphasizes stability, collaboration, production systems.
- No shop/comics style regressions from new CSS additions (portfolio prefix discipline).

## Guidance for Next Step

For planning (`05-PLAN.md`), treat homepage route ownership as a blocking architectural decision at the top of the first plan. Without that, HOME-01..04 can be partially implemented but not validated against roadmap success criteria.
