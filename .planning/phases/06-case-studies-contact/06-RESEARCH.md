# Phase 06 Research: Case Studies + Contact

**Phase:** 06-case-studies-contact  
**Date:** 2026-03-13  
**Purpose:** Implementation research to maximize planning quality for CASE-01/02/03 and CTCT-01/02.

## Scope and Requirement Mapping

- `CASE-01` requires `/case-studies` index listing all case studies.
- `CASE-02` requires per-case pages with structured sections (minimum: context, technical challenges, reflection).
- `CASE-03` requires 2-3 production-grade studies with concrete technical outcomes.
- `CTCT-01` requires a working contact form with `name`, `email`, `message`.
- `CTCT-02` requires that contact submission sends an email notification via Resend.

Phase 06 context adds stricter implementation constraints:
- Case study structure should follow `Context -> Challenges -> Decisions -> Outcomes -> Reflection`.
- Index cards should include title, short problem summary, and one measurable outcome.
- Contact flow should use inline success state (no forced redirect), field-level validation, top-level summary, honeypot + lightweight rate limiting, and retryable error state preserving values.

## Reusable Patterns and Assets in Current Code

## Content/Data Modeling Reuse

Primary reusable source:
- `app/lib/portfolio-data.ts`

Existing pattern:
- Typed export-first content model used by home, engineering, resume pages.
- Flat exported arrays/objects consumed by route pages directly.

Recommended reuse for Phase 06:
- Add a typed `CaseStudy` model in `app/lib/portfolio-data.ts` (or a colocated `app/lib/portfolio-case-studies.ts` if file size becomes unwieldy).
- Keep featured home cards and full case studies connected by slug/href to prevent content drift.

Suggested structure:
- `CaseStudy` fields: `slug`, `title`, `problemSummary`, `challengeSummary`, `measurableOutcome`, `context`, `challenges[]`, `decisions[]`, `outcomes[]`, `reflection`, `ctaLabel`.
- `decisions[]` entries should include explicit tradeoff text (supports Phase 06 tone requirement).

## Portfolio UI Pattern Reuse

Reusable route and layout contract:
- Portfolio shell is already consistent via `app/(portfolio)/layout.tsx` with `PortfolioNavigation` and `PortfolioFooter`.
- Existing pages use `portfolio-page`, `portfolio-section`, `portfolio-container`, `portfolio-grid`, `portfolio-card`, `portfolio-link`, button classes.

Reusable styles already available in `app/globals.css`:
- Card/list grid primitives: `.portfolio-grid`, `.portfolio-card`
- Typography primitives: `.portfolio-heading-*`, `.portfolio-text-muted`
- CTA primitives: `.portfolio-button-primary`, `.portfolio-button-secondary`

Phase 06 should stay on this style system and only add narrowly scoped classes:
- Case-study detail section wrappers and metric chips.
- Contact form layout/field/error/success classes prefixed `portfolio-contact-*`.

## Server Action + Email Pattern Reuse (from Checkout)

Primary reusable flow:
- `app/(shop)/checkout/actions.ts` (`'use server'`, Zod validation, Resend delivery, non-fatal email error handling in async branch, preserved form values on validation failure).
- `app/lib/emails/order-notification.tsx` (plain React template for Resend without extra email framework complexity).

What to reuse for contact:
- Server Action in portfolio context with same return-state contract used by `useActionState` on client.
- `zod.safeParse` with clear user-facing error messages.
- Preserve entered values on validation failure and retryable send failure.
- `RESEND_API_KEY` + configurable recipient email env vars.

What to adapt (do not copy directly):
- No redirect on success; return structured success state for inline confirmation.
- Do not reuse order email template; create dedicated contact notification template.
- Add bot controls (honeypot + rate limit) before Resend call.

## Implementation Approach to Satisfy CASE-01/02/03

## CASE-01: Case studies index page

Route target:
- `app/(portfolio)/case-studies/page.tsx` (currently placeholder)

Implementation shape:
- Read `caseStudies` array from shared data module.
- Render one card per study in `.portfolio-grid`.
- Card minimum fields:
  - title
  - problem summary
  - measurable outcome (short, numeric or specific operational result)
  - link to `/case-studies/[slug]`

Additional recommendation:
- Keep ordering deterministic in data source (already decided as relevance-first).

## CASE-02: Individual structured case pages

Route target:
- Add `app/(portfolio)/case-studies/[slug]/page.tsx`

Implementation shape:
- Resolve case study by slug from shared typed data.
- Handle unknown slug with `notFound()`.
- Render sections in this strict sequence:
  - Context
  - Technical Challenges
  - Key Decisions and Tradeoffs
  - Outcomes (must include measurable outcome)
  - Reflection
  - Final CTA to `/contact`

Metadata:
- Add `generateMetadata` per slug for SEO and OG consistency with existing portfolio pages.

Static generation:
- `generateStaticParams` from case-study slugs (content is hardcoded and finite).

## CASE-03: 2-3 production-ready studies with concrete outcomes

Content gate (planning-level requirement):
- At least 2, at most 3 launch studies.
- Each study includes at least one measurable outcome sentence (latency reduction, delivery reliability, incident reduction, throughput, defect trend, etc.).
- Decisions must describe tradeoffs (not only “what was done”).
- Reflection should be technical and evidence-first.

Recommended data quality checks during implementation:
- Type-level non-empty arrays for `challenges`, `decisions`, `outcomes`.
- Lightweight runtime assertion in dev/test that each case has `measurableOutcome` text and a valid slug.

## Implementation Approach to Satisfy CTCT-01/02

## CTCT-01: Contact form fields + submission UX

Route target:
- `app/(portfolio)/contact/page.tsx` (currently placeholder)

Implementation shape:
- Client component form using `useActionState` against a portfolio-specific server action.
- Required visible fields: `name`, `email`, `message`.
- Add hidden honeypot field (e.g. `company`) and reject when populated.
- Validation UX:
  - top-level error summary block
  - field-level messages per invalid input
- Success UX:
  - inline success state message including expected response window
  - form reset optional; if retained, keep success banner visible

## CTCT-02: Resend notification delivery

Server action target:
- New file recommended: `app/(portfolio)/contact/actions.ts` (or `app/lib/contact/actions.ts` with clear portfolio namespace)

Email template target:
- New file recommended: `app/lib/emails/contact-notification.tsx`

Implementation shape:
- Validate with Zod.
- Apply honeypot and rate-limit checks before sending email.
- Send notification email via Resend using dedicated subject/body for contact inquiries.
- Return success state on successful send.
- Return retryable error on send failure while preserving user inputs.

Environment reuse and additions:
- Reuse `RESEND_API_KEY` and `RESEND_FROM_EMAIL` pattern.
- Add recipient variable explicitly for contact flow (e.g. `CONTACT_NOTIFICATION_EMAIL`) instead of reusing `SELLER_EMAIL` to keep domain boundaries clear.

## Risk Register and Mitigations

1. Risk: Case study quality fails “evidence-first” bar (`CASE-03`)
- Mitigation: add pre-merge checklist requiring measurable outcome + tradeoff statement per study.
- Verification hook: reviewer confirms each published slug contains Outcomes and Reflection sections with concrete language.

2. Risk: Slug/content drift between homepage featured cards and case-study detail pages
- Mitigation: derive featured case-study hrefs from shared slug source; avoid duplicated hardcoded links.
- Verification hook: test that each featured case href resolves to an existing case-study slug.

3. Risk: Contact spam/noise despite open form
- Mitigation: implement honeypot + lightweight rate limiting in server action (IP+time window or fallback fingerprint strategy).
- Verification hook: automated test for honeypot rejection and repeated submit throttle.

4. Risk: Contact delivery silently fails (`CTCT-02` regression)
- Mitigation: handle Resend errors explicitly and return retryable UI message; log structured errors server-side.
- Verification hook: mocked Resend failure test verifies preserved form data and non-destructive error state.

5. Risk: Styling fragmentation from introducing shop-style form classes
- Mitigation: stay within `portfolio-*` namespace; reuse existing typography/card/button classes.
- Verification hook: CSS grep for non-prefixed new classes in portfolio files.

6. Risk: Dynamic route edge cases (`/case-studies/[slug]`) produce 500 instead of 404
- Mitigation: strict slug lookup + `notFound()` fallback.
- Verification hook: route test for unknown slug returns 404 page.

## Recommended Plan Slicing and Dependency Wave Strategy

## Wave 1 (Data + Routing Foundation)

Goals:
- Define canonical case-study data model and content set.
- Create dynamic case-study slug route with static params + metadata.

Tasks:
- Add `CaseStudy` typed model and 2-3 actual case entries.
- Implement `/case-studies/[slug]` page with structured sections and 404 handling.

Dependency notes:
- Required before index page finalization and before linking CTAs to stable slugs.

## Wave 2 (Case Study UX Surfaces)

Goals:
- Complete `/case-studies` index and cross-linking from homepage featured cards.

Tasks:
- Replace placeholder index with card grid from shared case-study data.
- Ensure each card exposes measurable outcome and links to detail page.
- Align `featuredCaseStudies` links to real slugs.

Dependency notes:
- Depends on Wave 1 slugs/data.
- Can run in parallel with Wave 3 (contact backend) if team capacity allows.

## Wave 3 (Contact Backend + Email)

Goals:
- Build reliable submission action and notification template.

Tasks:
- Create contact server action (validation, honeypot, rate limit, Resend send).
- Create dedicated contact notification email component.
- Define env-variable contract and failure behavior.

Dependency notes:
- Independent of case-study pages; can run parallel with Wave 2.

## Wave 4 (Contact UI + Integration + Hardening)

Goals:
- Replace contact placeholder with full UX and wire server action.

Tasks:
- Implement form fields, field errors, summary errors, inline success state.
- Preserve user values on failure and show retryable errors.
- Add test coverage for critical success/failure/spam paths.

Dependency notes:
- Depends on Wave 3 action contract.

## Suggested execution graph

- Sequential core: Wave 1 -> Wave 2
- Parallel branch: Wave 3 in parallel with Wave 2
- Final convergence: Wave 4 after Wave 3 completion

This gives early proof for CASE requirements while de-risking CTCT delivery integration in parallel.

## Checker-Oriented Acceptance Checklist

Use this as a plan checker and verification gate list.

## CASE gates

- [ ] `CASE-01`: `/case-studies` renders all published case studies from shared typed data (no placeholders).
- [ ] `CASE-01`: each index card shows title, problem summary, and one measurable outcome.
- [ ] `CASE-02`: `/case-studies/[slug]` route exists and unknown slug returns 404.
- [ ] `CASE-02`: each case page contains sections for Context, Technical Challenges, Reflection (plus Decisions and Outcomes as Phase 06 context requires).
- [ ] `CASE-02`: each case page ends with a clear CTA link to `/contact`.
- [ ] `CASE-03`: exactly 2-3 production case studies are published.
- [ ] `CASE-03`: each published study includes at least one concrete measurable outcome and explicit tradeoff language.

## CTCT gates

- [ ] `CTCT-01`: `/contact` includes required fields `name`, `email`, `message` and submit action.
- [ ] `CTCT-01`: invalid submission shows field-level errors + top-level summary.
- [ ] `CTCT-01`: successful submission shows inline success state with response window text.
- [ ] `CTCT-01`: send/validation failure preserves user-entered values and displays retryable error.
- [ ] Spam baseline: honeypot and rate limiting are active and tested.
- [ ] `CTCT-02`: successful submission triggers Resend notification to configured site-owner inbox.
- [ ] `CTCT-02`: contact flow uses dedicated email template and dedicated recipient env variable.

## Integration/quality gates

- [ ] Portfolio styling remains under `portfolio-*` class namespace.
- [ ] Metadata exists for case-studies index and dynamic detail pages (title + description + OG).
- [ ] No shop checkout behavior regressed by contact-flow additions.
- [ ] Test suite includes at least: slug resolution, case data integrity, contact validation, honeypot/rate-limit behavior, Resend success/failure handling.

## Planning Notes for Next Step

For `06-PLAN.md`, prefer 4-plan decomposition aligned to waves:
1. Case-study data model + slug route foundation.
2. Case-studies index + homepage link alignment.
3. Contact server action + email template + anti-spam baseline.
4. Contact UI integration + verification hardening.

This sequence minimizes blocked work and keeps verification incremental.

## RESEARCH COMPLETE

Phase 06 can be implemented cleanly by extending the existing typed portfolio-data pattern and reusing the proven checkout Server Action + Resend architecture, with focused adaptations for inline contact UX and anti-spam controls. The recommended wave strategy is: case data/slug foundation first, index and contact backend in parallel, then contact UI integration and checker-driven hardening.
