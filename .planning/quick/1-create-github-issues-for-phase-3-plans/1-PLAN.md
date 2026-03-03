---
phase: quick
plan: 1
type: execute
wave: 1
depends_on: []
files_modified: []
autonomous: true
requirements: []

must_haves:
  truths:
    - "Two GitHub issues exist on ce-manalang/alice for Phase 3 plans"
    - "Issue for 03-01 describes the order submission backend (types, Server Action, email template)"
    - "Issue for 03-02 describes the checkout form UI and confirmation page"
    - "Each issue lists its tasks and acceptance criteria from must_haves"
  artifacts: []
  key_links: []
---

<objective>
Create two GitHub issues on ce-manalang/alice for Phase 3: Checkout & Order Form plans.

Purpose: Track the remaining Phase 3 work as GitHub issues so progress is visible and each plan is actionable from the repo.

Output: Two GitHub issues created — one per plan file (03-01 and 03-02).
</objective>

<tasks>

<task type="auto">
  <name>Task 1: Create GitHub issue for 03-01 (Order Submission Backend)</name>
  <files></files>
  <action>
Run the following `gh issue create` command to create the issue for Plan 03-01:

```bash
gh issue create \
  --repo ce-manalang/alice \
  --title "Phase 3 Plan 01: Order Submission Backend (types, Server Action, email)" \
  --label "phase-3" \
  --body "## Objective

Build the order submission backend: types, Zod validation schema, Server Action, and seller email template.

This plan establishes all server-side infrastructure needed to accept and store orders. The checkout form (Plan 02) depends entirely on the \`submitOrder\` Server Action defined here.

**Wave:** 1 (no dependencies)
**Requirements:** CHKT-01, CHKT-03

---

## Files

- \`app/lib/types.ts\` — Add \`OrderItem\`, \`OrderInsert\`, \`SubmitOrderResult\` interfaces
- \`app/checkout/actions.ts\` — New file: \`submitOrder\` Server Action
- \`app/lib/emails/order-notification.tsx\` — New file: seller email template

---

## Tasks

### Task 1: Add order types to types.ts and install Resend

Append \`OrderItem\`, \`OrderInsert\`, and \`SubmitOrderResult\` to \`app/lib/types.ts\` without modifying existing types. Install the \`resend\` package via \`pnpm add resend\`.

### Task 2: Create seller email template and Server Action

Create \`app/lib/emails/order-notification.tsx\` — a plain React component (no react-email library) that renders a customer details table and order items table for the seller notification email.

Create \`app/checkout/actions.ts\` with the \`submitOrder\` Server Action:
- Validates form fields with Zod (name required, email required + format, phone/notes optional)
- Parses cart items from a hidden \`cartItems\` JSON field (product IDs + quantities only)
- Re-fetches current prices from DatoCMS server-side to prevent stale-price fraud
- Inserts order into Supabase \`orders\` table with RLS anon-insert policy
- Generates reference number as \`CC-XXXX\` (first 4 chars of UUID, uppercased)
- Sends seller email via Resend fire-and-forget (email failure does NOT fail the order)
- Calls \`redirect('/checkout/success?orderId=...')\` on success to prevent resubmission

---

## Acceptance Criteria

- \`app/lib/types.ts\` exports \`OrderItem\`, \`OrderInsert\`, \`SubmitOrderResult\`
- Zod schema validates name (required), email (required, format-checked), phone (optional), notes (optional)
- \`submitOrder\` accepts \`(prevState, formData)\` — compatible with \`useActionState\`
- Prices are re-fetched from DatoCMS server-side; client-sent totals are never trusted
- Supabase insert uses anon key client with RLS policy allowing anonymous inserts
- Reference number formatted as \`CC-XXXX\` (first 4 chars of UUID uppercased)
- Resend email is fire-and-forget (non-blocking); failure is caught and logged
- \`redirect()\` called on success — prevents back-button resubmission
- \`pnpm tsc --noEmit\` passes with no new errors

---

## User Setup Required

Before executing this plan, the following external services must be configured:

**Supabase:** Run the \`orders\` table SQL migration in Supabase SQL Editor (creates table, indexes, RLS policies for anon insert + service-role-only select).

**Resend:** Create an API key and add to \`.env.local\`:
- \`RESEND_API_KEY\` — from Resend Dashboard -> API Keys
- \`SELLER_EMAIL\` — your email address for order notifications
- \`RESEND_FROM_EMAIL\` — verified sender email (or use \`onboarding@resend.dev\` for testing)"
```

If the label \`phase-3\` does not exist, omit the \`--label\` flag and run without it.
  </action>
  <verify>gh issue list --repo ce-manalang/alice --state open --search "Phase 3 Plan 01" --json number,title | head -5</verify>
  <done>GitHub issue exists for Plan 03-01 with objective, task list, and acceptance criteria in the body</done>
</task>

<task type="auto">
  <name>Task 2: Create GitHub issue for 03-02 (Checkout Form UI and Confirmation Page)</name>
  <files></files>
  <action>
Run the following `gh issue create` command to create the issue for Plan 03-02:

```bash
gh issue create \
  --repo ce-manalang/alice \
  --title "Phase 3 Plan 02: Checkout Form UI and Order Confirmation Page" \
  --label "phase-3" \
  --body "## Objective

Build the checkout form page and order confirmation page — the two UI surfaces that complete the purchase flow.

With the \`submitOrder\` Server Action from Plan 01, this plan delivers the user-facing checkout experience: a contact details form with a read-only cart summary, and a confirmation page that shows order details and meetup instructions after submission.

**Wave:** 2 (depends on 03-01)
**Requirements:** CHKT-01, CHKT-02, CHKT-03

---

## Files

- \`app/checkout/page.tsx\` — Replace placeholder with full checkout form
- \`app/checkout/success/page.tsx\` — New file: order confirmation page
- \`app/globals.css\` — Add \`shop-checkout-*\` CSS classes

---

## Tasks

### Task 1: Build checkout page with order summary and form

Replace \`app/checkout/page.tsx\` with a \`'use client'\` component that:
- Reads cart items from \`useCartStore\` (Zustand) to render a read-only order summary with product names, quantities, unit prices (PHP), and total
- Shows an 'Edit cart' link back to \`/cart\`
- Serializes cart items as \`JSON.stringify(items)\` into a hidden input named \`cartItems\`
- Renders a contact form wired to \`submitOrder\` via \`useActionState\`
- Shows an inline error banner when \`actionState.error\` is present (form pre-filled from \`actionState.formData\`)
- Submit button shows 'Placing order...' text while \`isPending\` (via \`useFormStatus\`)
- Calls \`clearCart()\` after redirect lands on success page (handled in success page, not here)

### Task 2: Build order confirmation page and add checkout CSS

Create \`app/checkout/success/page.tsx\` that:
- Reads \`orderId\` from \`searchParams\`
- Fetches the order record from Supabase using the service-role key (or anon key with the existing RLS policy)
- Displays the order reference number (\`CC-XXXX\` format), full order summary (items, quantities, prices, total), customer contact info, and meetup instructions
- Calls \`clearCart()\` from \`useCartStore\` on mount to wipe the Zustand cart after successful order
- Shows a fallback if the order is not found (invalid or expired link)

Add \`shop-checkout-*\` CSS classes to \`app/globals.css\` for the checkout layout, form fields, error banner, and confirmation page sections. Follow the existing \`shop-*\` prefix convention.

---

## Acceptance Criteria

- Navigating to \`/checkout\` from the cart page shows the checkout form (not the old placeholder)
- Checkout page shows a read-only order summary: items with names, quantities, unit prices, and total
- Checkout page has an 'Edit cart' link that navigates back to \`/cart\`
- Form fields: Full Name (required), Email (required), Phone (optional), Notes/message (optional)
- Submitting with invalid/missing required fields shows an inline error banner (form stays filled)
- Submit button shows 'Placing order...' loading text while the Server Action is processing
- After successful submission, user is redirected to \`/checkout/success?orderId=...\`
- Confirmation page shows the order reference number in \`CC-XXXX\` format
- Confirmation page shows the full order summary: items ordered with quantities, prices, and total
- Confirmation page shows the customer's name and contact info they submitted
- Confirmation page shows meetup instructions: customer will be contacted to arrange pickup
- Cart is cleared (\`clearCart()\`) after successful order submission"
```

If the label \`phase-3\` does not exist, omit the \`--label\` flag and run without it.
  </action>
  <verify>gh issue list --repo ce-manalang/alice --state open --search "Phase 3 Plan 02" --json number,title | head -5</verify>
  <done>GitHub issue exists for Plan 03-02 with objective, task list, and acceptance criteria in the body</done>
</task>

</tasks>

<verification>
- `gh issue list --repo ce-manalang/alice --state open --search "Phase 3"` returns two issues
- Issue 1 title contains "Plan 01" and covers order submission backend
- Issue 2 title contains "Plan 02" and covers checkout form UI and confirmation page
</verification>

<success_criteria>
Two GitHub issues created on ce-manalang/alice, one per Phase 3 plan, each with objective, task breakdown, and measurable acceptance criteria.
</success_criteria>

<output>
No summary file needed for this quick task.
</output>
