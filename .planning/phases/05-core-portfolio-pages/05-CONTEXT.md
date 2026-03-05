# Phase 5: Core Portfolio Pages - Context

**Gathered:** 2026-03-05
**Status:** Ready for planning

<domain>
## Phase Boundary

Build the core portfolio content pages so hiring managers can evaluate Rails engineering competence quickly: homepage content blocks (hero, strengths, featured case studies, timeline), deeper engineering page content, and a clean resume page. This phase clarifies content structure and presentation within existing route/layout architecture.

</domain>

<decisions>
## Implementation Decisions

### Homepage Structure
- Hero emphasizes production Rails outcomes first (shipped systems, reliability, measurable results).
- CTA style is direct and proof-first (e.g., View Case Studies, View Resume), without marketing-heavy wording.
- Section order after hero: Strengths -> Case Studies -> Timeline.
- Above-the-fold should remain concise and scannable: one headline, one short supporting line, two CTAs.

### Engineering Page Depth
- Use curated depth per category: core tools with short practical usage notes, not exhaustive lists.
- Present testing/code quality as practice-and-outcome pairs (what was done and what reliability/delivery result it produced).
- Layout style should be section blocks by category (backend, frontend, infra, tools), not a monolithic table.
- Primary credibility signal is production maintenance reliability and long-term ownership.

### Resume Framing
- Resume emphasizes stability and ownership arc first.
- Keep a single-page structure with clear sections (summary, experience timeline, skills, selected outcomes).
- Each role uses 3-5 impact bullets focused on measurable outcomes.
- Team collaboration should be embedded within each role's bullets (PM/design/QA collaboration as delivery context).

### Claude's Discretion
- Exact final copy wording per section, as long as it remains outcome-oriented and professional.
- Exact visual spacing and typography choices within existing portfolio style foundation.
- How to balance short supporting descriptions vs bullet density inside each section.

</decisions>

<specifics>
## Specific Ideas

- The homepage should help a Tokyo engineering manager understand capability in under 30 seconds.
- Engineering content should read as operationally grounded (maintenance, reliability, testing), not trend-driven.
- Resume entries should read as evidence of consistent production ownership, not only role titles.

</specifics>

<code_context>
## Existing Code Insights

### Reusable Assets
- `app/(portfolio)/layout.tsx`: Existing portfolio shell and metadata template for Phase 5 page content.
- `app/components/portfolio-navigation.tsx`: Existing nav links and route structure to keep consistent.
- `app/components/portfolio-footer.tsx`: Existing footer with demoted shop link.
- `app/(portfolio)/engineering/page.tsx` and `app/(portfolio)/resume/page.tsx`: Existing placeholders to replace with full content.

### Established Patterns
- Portfolio pages already use `portfolio-*` class patterns in `app/globals.css`.
- Portfolio architecture and route boundaries are already complete from Phase 4.
- Metadata exports per page are already in place and should remain first-class.

### Integration Points
- Homepage content implementation will likely center on `app/page.tsx` while preserving comics/site constraints from earlier phases.
- Engineering and resume content should be implemented inside existing portfolio route files.
- New content blocks should align with established portfolio CSS naming and avoid leaking into shop/comics styles.

</code_context>

<deferred>
## Deferred Ideas

None - discussion stayed within phase scope.

</deferred>

---

*Phase: 05-core-portfolio-pages*
*Context gathered: 2026-03-05*
