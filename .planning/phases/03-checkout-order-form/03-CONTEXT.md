# Phase 3: Checkout & Order Form - Context

**Gathered:** 2026-03-02
**Status:** Ready for planning

<domain>
## Phase Boundary

Users can submit orders with their contact information and selected items, receive order confirmation, and orders are stored for the seller to arrange meetup fulfillment. No payment processing. Includes checkout form, order submission, confirmation page, Supabase storage, and seller email notification.

</domain>

<decisions>
## Implementation Decisions

### Order form fields & layout
- Fields: name (required), email (required), phone (optional), notes/message (optional)
- Cart items shown as read-only summary on checkout page — names, quantities, prices, total
- No editing of cart on checkout page — prominent "Edit cart" link to go back to /cart
- Form accessible from cart page via existing "Proceed to Checkout" link pointing to /checkout

### Confirmation experience
- Confirmation page shows full order summary: items ordered, total, contact info provided
- Clear meetup instructions: "You'll be contacted at your email/phone to arrange pickup"
- Simple order reference number generated (e.g., CC-1234) shown on confirmation
- Cart cleared after successful order submission (clearCart from Zustand store)

### Order storage & seller access
- Orders stored in Supabase database (already configured in project)
- Email notification sent to seller on each new order (via Resend, SendGrid, or similar)
- Seller views/manages orders through Supabase dashboard — no custom admin panel needed
- Order record includes: reference number, customer name, email, phone, notes, items (product IDs + quantities + prices), total, timestamp

### Form validation & error handling
- Name and email are required; phone and notes are optional
- Email validated for format
- If submission fails: inline error message at top of form ("Something went wrong, please try again"), form stays filled
- Submission button shows loading state while processing

### Claude's Discretion
- Email service provider choice (Resend, SendGrid, etc.)
- Supabase table schema design
- Reference number format and generation method
- Form styling consistent with existing shop aesthetic
- Confirmation page layout details
- Loading/submitting states

</decisions>

<code_context>
## Existing Code Insights

### Reusable Assets
- `useCartStore` (Zustand): clearCart action for post-order cleanup, items array for order data
- `/api/cart-products` route: Pattern for API routes with DatoCMS fetch — reuse for order submission API
- `formatPrice()`: Price formatting utility used across shop pages

### Established Patterns
- Client Components with 'use client' for interactive pages
- API routes in app/api/ for server-side operations (DatoCMS token, Supabase)
- Monochrome + pink accent (#ec4899) design system, Inter font, shop-* CSS classes

### Integration Points
- Cart "Proceed to Checkout" link already points to /checkout
- Existing app/checkout/page.tsx (old placeholder — will be replaced)
- Supabase configured but minimally used (connection exists)
- Cart store clearCart() wired for post-order cleanup

</code_context>

<specifics>
## Specific Ideas

- Meetup-based fulfillment — no shipping, no payment gateway
- Under 20 products, low order volume expected — simple is better
- Seller accesses orders via Supabase dashboard, not a custom admin

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 03-checkout-order-form*
*Context gathered: 2026-03-02*
