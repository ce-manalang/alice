---
quick: 2
type: execute
wave: 1
depends_on: []
autonomous: true
files_modified: []
---

<objective>
Close GitHub issues #31 and #32 for Phase 3: Checkout & Order Form with completion comments summarising what was built in each plan.

Purpose: Record that Phase 3 is complete and the v1.0 milestone is done.
Output: Both issues closed with completion comments on GitHub.
</objective>

<execution_context>
@/Users/august/.claude/get-shit-done/workflows/execute-plan.md
</execution_context>

<context>
@.planning/STATE.md
@.planning/phases/03-checkout-order-form/03-01-SUMMARY.md
@.planning/phases/03-checkout-order-form/03-02-SUMMARY.md
</context>

<tasks>

<task type="auto">
  <name>Task 1: Close issue #31 — Order Submission Backend</name>
  <files>none</files>
  <action>
Run the following command to add a completion comment and close issue #31:

```bash
gh issue close 31 --comment "$(cat <<'EOF'
## Phase 3 Plan 01 Complete — Order Submission Backend

**Completed:** 2026-03-03

### What was built

- **TypeScript types** — `OrderItem`, `OrderInsert`, `SubmitOrderResult` interfaces added to `app/lib/types.ts`
- **`submitOrder` Server Action** (`app/checkout/actions.ts`) — Zod-validated, with:
  - Server-side DatoCMS price re-fetch (client totals never trusted)
  - Two-step Supabase insert: INSERT with `TEMP` reference, then UPDATE with real `CC-XXXX` reference after UUID is returned
  - Fire-and-forget Resend seller email notification (email failure never blocks order)
  - Redirect to `/checkout/success?orderId=...` on success
- **`OrderNotificationEmail` React template** (`app/lib/emails/order-notification.tsx`) — plain JSX with inline styles, no react-email dependency needed at this stage
- **Resend 6.9.3** installed

### Requirements addressed

- CHKT-01 (order form collects customer details)
- CHKT-03 (seller receives email notification)

### Key patterns established

- `(prevState, formData)` Server Action signature compatible with `useActionState`
- Hidden `cartItems` JSON field pattern: checkout form serialises Zustand cart items into a single hidden input
- `CC-XXXX` order reference: first 4 hex chars of Supabase-generated UUID, uppercased

Part of the v1.0 milestone — all phases complete.
EOF
)"
```
  </action>
  <verify>gh issue view 31 --json state,comments --jq '{state: .state, last_comment: .comments[-1].body[0:80]}'</verify>
  <done>Issue #31 is in CLOSED state with a completion comment visible on GitHub.</done>
</task>

<task type="auto">
  <name>Task 2: Close issue #32 — Checkout Form UI and Order Confirmation Page</name>
  <files>none</files>
  <action>
Run the following command to add a completion comment and close issue #32:

```bash
gh issue close 32 --comment "$(cat <<'EOF'
## Phase 3 Plan 02 Complete — Checkout Form UI and Order Confirmation Page

**Completed:** 2026-03-03

### What was built

- **`app/checkout/page.tsx`** (226 lines) — Client Component checkout form:
  - Read-only cart summary fetched client-side from `/api/cart-products`
  - Order form: name, email, phone (optional), notes (optional)
  - Hidden `cartItems` JSON field passes cart to `submitOrder` via `useActionState`
  - Inline error banner (`role="alert"`), "Placing order…" loading state, empty-cart guard

- **`app/checkout/success/page.tsx`** (199 lines) — Server Component confirmation page:
  - Reads `orderId` from `searchParams`, fetches full order from Supabase (service role key)
  - Displays: green checkmark, CC-XXXX reference, customer info, items with prices/quantities, total, meetup pickup instructions

- **`app/globals.css`** — Added `shop-checkout-*` and `shop-confirmation-*` design system classes

- **Post-verification auto-fixes:**
  - Removed `available` field from DatoCMS checkout query (not yet in schema)
  - Switched to `SUPABASE_SERVICE_ROLE_KEY` for server-side Supabase insert (anon key blocked by RLS)
  - Installed `@react-email/components` required by Resend for HTML email rendering

### Requirements addressed

- CHKT-01 (checkout form collects customer details)
- CHKT-02 (order confirmation page with reference number)
- CHKT-03 (seller email notification on order submit)

### End-to-end flow verified

Browse -> Add to cart -> Checkout form -> Submit order -> Confirmation page (CC-XXXX) -> Seller email notification

**v1.0 milestone complete.** All 10 plans across 3 phases are done. Ready for production deployment to Vercel.
EOF
)"
```
  </action>
  <verify>gh issue view 32 --json state,comments --jq '{state: .state, last_comment: .comments[-1].body[0:80]}'</verify>
  <done>Issue #32 is in CLOSED state with a completion comment visible on GitHub.</done>
</task>

</tasks>

<success_criteria>
- `gh issue view 31 --json state` returns `"CLOSED"`
- `gh issue view 32 --json state` returns `"CLOSED"`
- Both issues have a completion comment summarising what was built
</success_criteria>

<output>
No summary file required for quick tasks. Update STATE.md `### Quick Tasks Completed` table:

| # | Description | Date | Commit | Directory |
|---|-------------|------|--------|-----------|
| 2 | Close GitHub issues #31 and #32 for Phase 3 complete | 2026-03-03 | — | [2-update-github-issues-phase-3-complete](./quick/2-update-github-issues-phase-3-complete/) |
</output>
