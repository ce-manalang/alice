# Phase 2: Shopping Cart - Context

**Gathered:** 2026-02-27
**Status:** Ready for planning

<domain>
## Phase Boundary

Users can add products to a cart, view and manage their selections, and have the cart persist across browser sessions and page navigations. Includes Add to Cart functionality on product cards and detail pages, a dedicated cart page with quantity management, and localStorage persistence. Checkout and order submission are in Phase 3.

</domain>

<decisions>
## Implementation Decisions

### Cart UI & interaction
- Dedicated `/cart` page — no slide-out drawer
- Cart icon with item count badge on the right side of the Navigation header
- Each cart item shows: product thumbnail image, name, unit price, quantity selector, and line subtotal
- Cart page includes subtotal summary and a "Proceed to Checkout" button at the bottom

### Add-to-cart behavior
- "Add to Cart" button available on both product cards in the grid AND the product detail page
- Quantity picker (number stepper) on the product detail page — user picks how many before adding
- Grid card gets a simpler quick-add (adds 1 per click)
- Button feedback: brief "Added!" state change with checkmark, then returns to normal
- Re-adding an item already in cart silently increments the quantity (by 1 from grid, by picker amount from detail)
- Sold-out products cannot be added (button disabled, as implemented in Phase 1)

### Cart management
- Quantity changes via [-] [qty] [+] stepper buttons inline with each item
- Trash/X icon per item removes immediately — no confirmation dialog
- "Clear Cart" button available to remove all items at once
- Empty cart state: "Your cart is empty" message with a "Browse the shop" button linking to /shop
- Total price updates in real-time as quantities change

### Persistence strategy
- localStorage only — same browser, no cross-device sync (no user accounts)
- Stores product IDs and quantities only (not full product data)
- On cart page load, re-fetches current product data from DatoCMS — always shows accurate name, price, availability
- If a product becomes unavailable (sold out) while in cart, auto-remove it and show a notice explaining what was removed
- Cart never expires — persists indefinitely until user clears it or completes checkout

### Claude's Discretion
- State management approach (Zustand, React Context, or other)
- Cart icon design (shopping bag, cart, basket)
- Exact animation/transition for "Added!" feedback
- Stepper button styling and min/max quantity limits
- How the "items removed" notice is presented
- Cart page responsive layout details

</decisions>

<specifics>
## Specific Ideas

- Phase 1 already has a placeholder "Add to Cart" button on the product detail page (pink #ec4899 when available, gray + disabled when sold out) — this needs to be wired up to actual cart state
- Under 20 products in catalog — no need for complex cart optimization
- "Proceed to Checkout" button will link to the checkout page built in Phase 3 — can be a dead link or disabled until Phase 3

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 02-shopping-cart*
*Context gathered: 2026-02-27*
