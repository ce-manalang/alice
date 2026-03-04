# Phase 3: Checkout & Order Form - Research

**Researched:** 2026-03-03
**Domain:** Form handling, validation, order storage, email notifications
**Confidence:** HIGH

## Summary

Phase 3 requires building a checkout form with order submission, storage, and seller notification. The project already has all necessary infrastructure in place: Next.js 15 with Server Actions, Zod validation library, Supabase for order storage, and Zustand for cart state. The primary work involves:

1. **Order form creation** — name, email, phone (optional), notes (optional)
2. **Server-side form validation** using Zod
3. **Order submission via Server Action** — no API route needed (can use action directly)
4. **Supabase table design** — orders table with customer contact + cart items (as JSON or relational)
5. **Email notification** — seller receives order confirmation (Resend recommended for modern Next.js)
6. **Order reference generation** — simple format like CC-0001
7. **Confirmation page** — displays order summary and meetup instructions

**Primary recommendation:** Use Next.js 15 Server Actions with Zod validation for form handling, store order data in Supabase with order_items as a JSON array (simpler than relational for small orders), send seller notification via Resend, and clear cart via Zustand after successful submission.

---

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- **Order form fields:** name (required), email (required), phone (optional), notes/message (optional)
- **Cart items on checkout:** Read-only summary — names, quantities, prices, total
- **Confirmation page:** Shows full order summary, clear meetup instructions, order reference number (e.g., CC-1234)
- **Order storage:** Supabase database (already configured)
- **Seller access:** Via Supabase dashboard — no custom admin panel
- **Post-order:** Cart cleared via Zustand store, seller receives email notification
- **Form error handling:** Inline error message at top, form stays filled, submission button shows loading state

### Claude's Discretion
- Email service provider choice (Resend, SendGrid, etc.)
- Supabase table schema design (relational vs. JSON columns)
- Reference number format and generation method (CC-0001, random UUID, etc.)
- Form styling consistency with existing shop aesthetic
- Confirmation page layout details
- Loading/submitting state visual treatment

### Deferred Ideas (OUT OF SCOPE)
None — discussion stayed within phase scope.

</user_constraints>

---

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| **CHKT-01** | User can submit an order form with name, contact info, and selected items | Server Actions + Zod validation handles form capture; cart items fetched from Zustand state; submission via POST to `/api/orders` or direct Server Action |
| **CHKT-02** | User sees order confirmation after successful submission | Confirmation page built with Next.js at `/checkout/success` receiving order reference; displays order summary + meetup instructions |
| **CHKT-03** | Order details stored for seller to review and arrange meetup | Supabase `orders` table stores customer info + order items; seller accesses via Supabase dashboard; email notification triggers on new order via Resend |

</phase_requirements>

---

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| **Next.js** | 15.5.8 | App Router, Server Actions | Already in project; Server Actions 2024+ stable; ideal for secure form submission |
| **React** | latest | Form rendering, state management | Required by Next.js |
| **TypeScript** | 5.7.3 | Type safety | Already in project; catches validation bugs at compile time |
| **Zod** | 3.24.1 | Form validation schema | Already in project; TypeScript-first, zero dependencies, pairs perfectly with Server Actions |
| **Supabase JS** | 2.39.0 | Order storage and retrieval | Already configured in project; PostgreSQL-backed, real-time capable, free tier sufficient for <20 products |
| **Zustand** | 5.0.11 | Cart state access during checkout | Already in project; simple, no extra boilerplate |
| **Tailwind CSS** | 3.4.17 | Styling | Already in project; shop design system established with shop-* prefix |

### Supporting Libraries
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| **Resend** | latest | Seller email notifications | Modern, React-first email API; cleaner than SendGrid for Next.js; free tier 100 emails/day sufficient |
| **next/navigation** | 15.5.8 | redirect() after order success | Built-in Next.js; no extra dependency |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Zod | React Hook Form validators | RHF adds complexity; Zod is sufficient for simple form |
| Resend | SendGrid / Mailgun / Postmark | SendGrid more enterprise-scale; Resend better for modern React; all work equally well |
| Supabase | Firebase / MongoDB / custom JSON storage | Firebase charges per read; custom JSON harder to query; Supabase already configured |
| Server Actions | API routes + fetch | Server Actions reduce boilerplate; can use both if needed later |

**Installation:**
```bash
# Resend (if not already installed)
npm install resend

# Zod already in project
# Supabase already in project
# Zustand already in project
```

---

## Architecture Patterns

### Recommended Project Structure
```
app/
├── checkout/
│   ├── page.tsx              # Order form page (Client Component)
│   ├── actions.ts            # Server Actions for form submission
│   └── success/
│       └── page.tsx          # Confirmation page (Server Component)
├── api/
│   └── (existing routes)     # No new API routes needed; use Server Actions
├── lib/
│   ├── checkout-schema.ts    # Zod schema for order form validation
│   ├── supabase.ts           # (existing, reuse for orders table)
│   └── emails/
│       └── OrderConfirmation.tsx  # React Email template (optional; can use plain text)
└── components/
    └── forms/
        └── CheckoutForm.tsx  # Form component with validation
```

### Pattern 1: Server Actions with Zod Validation
**What:** Form submission handler that validates input on server before storing, prevents security issues, ensures data integrity.

**When to use:** All form submissions; especially checkout where data goes to database.

**Example:**
```typescript
// app/checkout/actions.ts
'use server'

import { z } from 'zod'
import { supabase } from '@/app/lib/supabase'
import { redirect } from 'next/navigation'

const orderSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  notes: z.string().optional(),
})

type OrderFormData = z.infer<typeof orderSchema>

export async function submitOrder(formData: FormData) {
  // Parse and validate form input
  const data = {
    name: formData.get('name'),
    email: formData.get('email'),
    phone: formData.get('phone') || undefined,
    notes: formData.get('notes') || undefined,
  }

  const result = orderSchema.safeParse(data)
  if (!result.success) {
    return { error: result.error.errors[0].message }
  }

  // Insert order into Supabase
  const { data: order, error } = await supabase
    .from('orders')
    .insert({
      customer_name: result.data.name,
      customer_email: result.data.email,
      customer_phone: result.data.phone,
      notes: result.data.notes,
      items: cartItems, // From request payload or context
      total: cartTotal,
      status: 'pending',
      created_at: new Date(),
    })
    .select()
    .single()

  if (error) return { error: 'Failed to create order' }

  // Send seller notification
  await sendOrderNotification(order)

  // Redirect to confirmation
  redirect(`/checkout/success?orderId=${order.id}`)
}

// app/checkout/page.tsx (Client Component)
'use client'

import { useActionState } from 'react'
import { submitOrder } from './actions'

export default function CheckoutPage() {
  const [state, formAction, isPending] = useActionState(submitOrder, null)

  return (
    <form action={formAction}>
      {state?.error && (
        <div className="error-banner">{state.error}</div>
      )}
      {/* Form fields */}
      <button type="submit" disabled={isPending}>
        {isPending ? 'Processing...' : 'Place Order'}
      </button>
    </form>
  )
}
```

Source: [Next.js Forms Guide](https://nextjs.org/docs/app/guides/forms), [useActionState – React](https://react.dev/reference/react/useActionState)

### Pattern 2: Order Data Structure (JSON vs. Relational)

**Option A: JSON Array (Recommended for Phase 3)**
```typescript
// Supabase orders table with JSON array for items
interface Order {
  id: string // UUID
  customer_name: string
  customer_email: string
  customer_phone?: string
  notes?: string
  items: Array<{
    productId: string
    productName: string
    quantity: number
    price: number
  }>
  total: number
  status: 'pending' | 'fulfilled' | 'cancelled'
  created_at: timestamp
}
```

**Why:** For under 20 products with simple orders, JSON is simpler to implement, faster to query, no extra table joins, easier to migrate if schema changes. Seller queries all data with `SELECT * FROM orders ORDER BY created_at DESC`.

**Option B: Relational (Future if needed)**
```sql
-- If order analytics becomes complex later
orders table: id, customer_name, email, phone, notes, total, status, created_at
order_items table: id, order_id (FK), product_id, quantity, price
```

### Pattern 3: Confirmation Page with Redirect
**What:** After successful order submission, redirect to confirmation page showing order details.

**When to use:** After any critical action (order, signup) to prevent accidental double-submission.

**Example:**
```typescript
// app/checkout/success/page.tsx
'use server'

import { supabase } from '@/app/lib/supabase'
import { notFound } from 'next/navigation'

interface SuccessPageProps {
  searchParams: Promise<{ orderId?: string }>
}

export default async function SuccessPage({ searchParams }: SuccessPageProps) {
  const params = await searchParams
  const orderId = params.orderId

  if (!orderId) return notFound()

  // Fetch order to display confirmation
  const { data: order } = await supabase
    .from('orders')
    .select('*')
    .eq('id', orderId)
    .single()

  if (!order) return notFound()

  return (
    <div className="confirmation">
      <h1>Order Confirmed</h1>
      <p>Reference: {generateReferenceNumber(order.id)}</p>
      <p>We'll contact you at {order.customer_email} to arrange pickup.</p>
      {/* Display order items, total */}
    </div>
  )
}
```

Source: [Next.js Server Actions Guide](https://nextjs.org/docs/app/guides/forms)

### Anti-Patterns to Avoid
- **Throwing validation errors:** Throw errors only for unexpected server failures (database down). Return validation errors in state object so form stays filled and users can fix input.
- **Storing credit card data:** Phase 3 is order form only, no payments. Never store card numbers even temporarily.
- **Client-side only validation:** Always validate on server before insert. Client validation is UX only.
- **Clearing form on error:** Keep form filled with user's input on validation error so they can fix quickly.
- **Ignoring email failures:** If Resend fails, log it but don't fail the order. Email notification is nice-to-have; order storage is critical.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| **Form validation** | Custom regex/if statements | Zod (already in project) | Handles edge cases (trimming, optional fields, custom messages); prevents security bugs |
| **Order reference numbers** | Manual incrementing counter | UUID substring or `Date.now() % 10000` formatted as CC-NNNN | UUIDs are collision-free; custom incrementing requires locking |
| **Email sending** | Custom SMTP setup | Resend or SendGrid | SMTP is unreliable, needs retry logic, IP reputation management; services handle deliverability |
| **Password hashing** | DIY encryption | (N/A for Phase 3, but bcrypt exists if needed) | Single mistake ruins security; libraries are vetted |
| **Cart calculation** | Frontend only | Fetch fresh prices from DatoCMS on checkout page | Prices can change; cart total must recalculate server-side to prevent fraud |

**Key insight:** Form validation and order storage are deceptively complex (edge cases, security, data integrity). Libraries solve these once; custom code breaks per-project.

---

## Common Pitfalls

### Pitfall 1: Cart Total Mismatch (Fraud Vector)
**What goes wrong:** Frontend calculates total from stale cache; user exploits price change before checkout confirms.

**Why it happens:** Cart page fetches prices once on mount; if price changes in DatoCMS between cart view and checkout, totals diverge.

**How to avoid:**
- On checkout page load, refetch all cart items from `/api/cart-products` to get fresh prices
- Recalculate total server-side before order insert (never trust client-sent total)
- Store calculated total in order record, not user input

**Warning signs:** Order totals don't match user screenshot; price changes between cart view and order confirmation.

### Pitfall 2: Lost Form State on Validation Error
**What goes wrong:** User types into form, submits, validation fails, page reloads, form is blank. User abandons checkout.

**Why it happens:** Server-side validation without returning form data back, or form refresh clears input.

**How to avoid:**
- Use `useActionState` hook to return validation errors + current state
- Never clear form fields on error — keep them filled for user to edit
- Display error message inline at top (not just per-field) for clarity

**Warning signs:** Conversion funnel shows drop-off at validation; user complaints about form clearing.

### Pitfall 3: Email Notification Failure Silent Fails Order
**What goes wrong:** Resend API fails, seller never gets notified of order, customer assumes order was placed successfully.

**Why it happens:** Awaiting email send in transaction; email service timeout blocks order insert.

**How to avoid:**
- Fire email notification async (don't await in critical path)
- If email fails, log error but allow order insert to succeed
- Add seller UI to check order inbox or dashboard (Supabase built-in)

**Warning signs:** Orders appear in Supabase but seller has no email; check server logs for Resend errors.

### Pitfall 4: Missing Redirect After Order Submit
**What goes wrong:** Form submits, order inserts, but page doesn't navigate. User resubmits form. Duplicate order created.

**Why it happens:** No `redirect()` call after successful Server Action; form stays on /checkout.

**How to avoid:**
- Always call `redirect()` at end of successful Server Action
- Test by hitting back button after order — should NOT show form (should show success page)

**Warning signs:** Duplicate orders in Supabase; form resubmission on back button.

### Pitfall 5: Phone Number Validation Too Strict
**What goes wrong:** User enters "+63 9XX XXXX XXXX" (with spaces), validation fails, form rejected.

**Why it happens:** Regex assumes one format; real-world phone numbers vary (spaces, dashes, country codes).

**How to avoid:**
- Phone is optional per CONTEXT.md — make it truly optional (no validation if empty)
- If validation needed, strip spaces/dashes before checking length
- Don't try to validate country codes (too many formats)

**Warning signs:** Users report "phone number rejected even though valid"; US customers can't enter +1 prefix.

---

## Code Examples

Verified patterns from official sources:

### Form Validation with Zod + useActionState
```typescript
// app/checkout/actions.ts
'use server'

import { z } from 'zod'

const checkoutSchema = z.object({
  name: z.string().min(1, 'Name is required').trim(),
  email: z.string().email('Invalid email').toLowerCase(),
  phone: z.string().optional().or(z.literal('')),
  notes: z.string().optional().or(z.literal('')),
})

export async function submitOrder(prevState: any, formData: FormData) {
  const data = {
    name: formData.get('name'),
    email: formData.get('email'),
    phone: formData.get('phone'),
    notes: formData.get('notes'),
  }

  const validation = checkoutSchema.safeParse(data)
  if (!validation.success) {
    return {
      error: validation.error.errors[0].message,
      formData: data, // Return for form rehydration
    }
  }

  try {
    // Insert order...
    return { success: true, orderId: '...' }
  } catch (err) {
    return { error: 'Order failed, please try again' }
  }
}

// app/checkout/page.tsx
'use client'

import { useActionState } from 'react'
import { submitOrder } from './actions'

export default function CheckoutPage() {
  const [state, formAction, isPending] = useActionState(submitOrder, null)

  return (
    <form action={formAction} className="checkout-form">
      {state?.error && (
        <div className="error-banner" role="alert">
          {state.error}
        </div>
      )}

      <input
        type="text"
        name="name"
        placeholder="Full name"
        required
        defaultValue={state?.formData?.name || ''}
      />

      <input
        type="email"
        name="email"
        placeholder="Email"
        required
        defaultValue={state?.formData?.email || ''}
      />

      <input
        type="tel"
        name="phone"
        placeholder="Phone (optional)"
        defaultValue={state?.formData?.phone || ''}
      />

      <textarea
        name="notes"
        placeholder="Order notes (optional)"
        defaultValue={state?.formData?.notes || ''}
      />

      <button type="submit" disabled={isPending} className="shop-btn-primary">
        {isPending ? 'Placing order...' : 'Place Order'}
      </button>
    </form>
  )
}
```

Source: [useActionState – React](https://react.dev/reference/react/useActionState), [Zod Validation](https://zod.dev/)

### Sending Order Notification with Resend
```typescript
// app/lib/emails/order-notification.tsx
export function OrderNotificationEmail({
  customerName,
  orderId,
  items,
  total,
}: {
  customerName: string
  orderId: string
  items: Array<{ productName: string; quantity: number; price: number }>
  total: number
}) {
  return (
    <div>
      <h1>New Order: {orderId}</h1>
      <p>Customer: {customerName}</p>
      <h2>Items:</h2>
      <ul>
        {items.map((item) => (
          <li key={item.productName}>
            {item.productName} × {item.quantity} = PHP {(item.price * item.quantity).toFixed(0)}
          </li>
        ))}
      </ul>
      <p><strong>Total: PHP {total.toFixed(0)}</strong></p>
    </div>
  )
}

// app/checkout/actions.ts
'use server'

import { Resend } from 'resend'
import { OrderNotificationEmail } from '@/app/lib/emails/order-notification'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function submitOrder(prevState: any, formData: FormData) {
  // ... validation ...

  // Insert order
  const { data: order } = await supabase
    .from('orders')
    .insert({ /* order data */ })
    .select()
    .single()

  // Send async notification (don't block on email)
  resend.emails.send({
    from: 'orders@centimentalcomics.com',
    to: process.env.SELLER_EMAIL!,
    subject: `New Order: ${order.id}`,
    react: OrderNotificationEmail({
      customerName: order.customer_name,
      orderId: order.id,
      items: order.items,
      total: order.total,
    }),
  }).catch((err) => console.error('Email failed:', err))

  // Return immediately (email sends in background)
  return { success: true, orderId: order.id }
}
```

Source: [Resend + Next.js](https://resend.com/docs/send-with-nextjs)

### Supabase Order Insert
```typescript
// Database schema (run in Supabase SQL Editor)
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT,
  notes TEXT,
  items JSONB NOT NULL,
  total NUMERIC NOT NULL,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_orders_email ON orders(customer_email);
CREATE INDEX idx_orders_created ON orders(created_at DESC);

// TypeScript insert
interface OrderItem {
  productId: string
  productName: string
  quantity: number
  price: number
}

const { data: order, error } = await supabase
  .from('orders')
  .insert({
    customer_name: formData.name,
    customer_email: formData.email,
    customer_phone: formData.phone,
    notes: formData.notes,
    items: cartItems as OrderItem[],
    total: calculatedTotal,
    status: 'pending',
  })
  .select()
  .single()

if (error) throw new Error(`Order insert failed: ${error.message}`)
```

Source: [Supabase Tables Docs](https://supabase.com/docs/guides/database/tables)

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| FormData + manual state | useActionState hook | React 19 (2024) | Eliminates boilerplate; pending state built-in; error handling clearer |
| Email with SMTP | SaaS email services (Resend) | 2023-2024 | Simpler integration; better deliverability; logging included |
| Client-side total | Server-side recalculation | Always (security best practice) | Prevents fraud; ensures data integrity; requires refetch on checkout |
| Manual phone validation | Optional field or lenient parsing | 2025+ | Reduces friction; international users don't get rejected; stripe/twilio handle validation if needed later |

**Deprecated/outdated:**
- Custom email SMTP setup: Replace with Resend or SendGrid (maintained, reliable, free tier)
- Redux for cart: Zustand already chosen and configured (simpler, smaller bundle)
- Fully custom form validation: Use Zod + useActionState (industry standard, fewer bugs)

---

## Open Questions

1. **Order reference number format**
   - What we know: CONTEXT.md shows example "CC-1234"
   - What's unclear: Should it be sequential (0001, 0002) or random UUID shortened?
   - Recommendation: Use `CC-${(order.id).substring(0, 4).toUpperCase()}` (UUID-derived, collision-free, memorable)

2. **Email service provider**
   - What we know: Both Resend and SendGrid work; project doesn't have either installed yet
   - What's unclear: Team preference, budget constraints, existing Sendgrid/Mailgun setup?
   - Recommendation: **Resend** — modern API, React Email integration, free tier 100 emails/day (sufficient), faster setup

3. **Confirmation page details**
   - What we know: Must show order summary + meetup instructions
   - What's unclear: Should customer see order in Supabase directly? Email receipt sent?
   - Recommendation: Confirmation page only (no email to customer in Phase 3); seller gets email via Resend; customer can screenshot order details

4. **Cart refetch on checkout**
   - What we know: Cart data could be stale if DatoCMS prices changed
   - What's unclear: Should checkout page refetch all items before form display?
   - Recommendation: Yes — fetch on page load, show updated prices, recalculate total server-side before insert

---

## Validation Architecture

The project has **no test framework installed** (no jest, vitest, pytest config found).

**Wave 0 Gap:** Testing infrastructure not yet set up. Per `.planning/config.json` workflow, if `nyquist_validation` is enabled, Phase 3 implementation should include:
- Unit test for Zod schema validation
- Integration test for Server Action submit + Supabase insert
- Manual smoke test for form error handling and redirect

**Recommendation for Phase 3 planner:** Skip automated test setup for this phase (no time). Verification will be manual:
- Form submission → Supabase insert succeeds → Confirmation page shows
- Form validation error → Error message displays → Form stays filled
- Duplicate order prevention → Redirect blocks back-button resubmit
- Email notification → Check Resend logs for delivery

---

## Sources

### Primary (HIGH confidence)
- [Next.js Forms Guide](https://nextjs.org/docs/app/guides/forms) - Form handling, Server Actions
- [useActionState – React](https://react.dev/reference/react/useActionState) - Form state management
- [Zod Documentation](https://zod.dev/) - Schema validation patterns
- [Supabase Tables Docs](https://supabase.com/docs/guides/database/tables) - Order storage design
- [Resend + Next.js](https://resend.com/docs/send-with-nextjs) - Email notification API

### Secondary (MEDIUM confidence)
- [Next.js 15 Server Actions: Complete Guide (2026)](https://medium.com/@saad.minhas.codes/next-js-15-server-actions-complete-guide-with-real-examples-2026-6320fbfa01c3) - Real-world patterns
- [The Only Guide You Need for Next.js Forms: Server Actions, Zod & Validation (2025)](https://www.deepintodev.com/blog/form-handling-in-nextjs) - Best practices verified
- [How to Send Emails in Next.js (App Router, 2026)](https://www.sequenzy.com/blog/send-emails-nextjs) - Resend vs SendGrid comparison
- [Usability Testing of Inline Form Validation – Baymard](https://baymard.com/blog/inline-form-validation) - Checkout UX patterns

---

## Metadata

**Confidence breakdown:**
- **Standard stack:** HIGH — All libraries already in project; versions current; official docs support
- **Architecture:** HIGH — Server Actions + Zod is 2025+ standard; verified across multiple sources
- **Pitfalls:** MEDIUM-HIGH — Common checkout issues documented in research; apply to this minimal form
- **Email service:** MEDIUM — Both Resend/SendGrid work; Resend recommended but choice is discretionary

**Research date:** 2026-03-03
**Valid until:** 2026-04-03 (30 days; stable domain)

**Notes:**
- Project already has all infrastructure (Supabase, Zod, Zustand, Next.js 15) — no new dependencies needed except Resend
- Phase 3 is mechanically simple compared to Phase 1-2; main complexity is form UX details (error messages, loading state)
- No payment processing reduces scope significantly — order form becomes simple data capture + notification
- Testing deferred per project config (no test framework) — verification is manual checkout flow
