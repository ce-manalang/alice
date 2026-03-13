# Phase 6: Case Studies + Contact - Context

**Gathered:** 2026-03-12
**Status:** Ready for planning

<domain>
## Phase Boundary

Deliver a complete case-study reading and contact conversion flow: case studies index page, individual case study pages with structured technical narrative and measurable outcomes, plus a production-ready contact form that sends notification email to the site owner.

</domain>

<decisions>
## Implementation Decisions

### Case Study Structure
- Every case study follows: Context -> Challenges -> Decisions -> Outcomes -> Reflection.
- Each study must include at least one concrete measurable outcome.
- Technical depth should present key engineering decisions with explicit tradeoffs.
- Tone must stay evidence-first and professional (no promotional/emotional framing).

### Case Study Indexing Model
- `/case-studies` cards show: title, problem summary, and one measurable outcome.
- Individual case-study URLs use stable semantic slugs (not numeric/date-only slugs).
- Default ordering is most relevant first for hiring signal.
- Each full case study ends with one clear CTA to `/contact`.

### Contact Form Behavior
- Success path uses inline success state with clear expected response window (no required redirect).
- Validation UX uses field-level errors plus a top-level error summary.
- Spam baseline for Phase 6 is honeypot + lightweight rate limit (no CAPTCHA by default).
- Email/send failures show clear retryable error while preserving user-entered values.

### Claude's Discretion
- Exact copy wording of case-study and form messages as long as tone/rules above are preserved.
- Exact card visual density and spacing using existing portfolio design primitives.
- Specific rate-limit thresholds and technical implementation details for anti-spam.

</decisions>

<specifics>
## Specific Ideas

- Case studies should read as concrete delivery evidence for Tokyo hiring managers, not personal essays.
- Index cards should provide enough proof signal to earn click-through without overwhelming detail.
- Contact UX should remain low-friction for real recruiters while adding basic bot resistance.

</specifics>

<code_context>
## Existing Code Insights

### Reusable Assets
- `app/(portfolio)/case-studies/page.tsx`: existing placeholder route ready to become index page.
- `app/(portfolio)/contact/page.tsx`: existing placeholder route ready for full form implementation.
- `app/lib/portfolio-data.ts`: established shared data model pattern already used by homepage/engineering/resume.
- `app/(shop)/checkout/actions.ts`: proven Server Action + Resend email pattern reusable for contact submission.
- `app/lib/emails/order-notification.tsx`: existing email template conventions for formatting outbound notifications.

### Established Patterns
- Portfolio pages use `portfolio-*` CSS naming and route-group layout isolation.
- Content is hardcoded in TypeScript and rendered via typed data structures (no CMS).
- Server Actions are already part of production flow and environment setup.

### Integration Points
- Add case-study data structures and slug mapping in `app/lib/portfolio-data.ts` (or adjacent typed module).
- Implement case-study index at `/case-studies` and slug route under portfolio group.
- Implement contact form submission via Server Action and Resend with error/success states on `/contact`.

</code_context>

<deferred>
## Deferred Ideas

None - discussion stayed within Phase 6 scope.

</deferred>

---

*Phase: 06-case-studies-contact*
*Context gathered: 2026-03-12*
