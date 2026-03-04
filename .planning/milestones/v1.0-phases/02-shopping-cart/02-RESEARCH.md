# Phase 2: Shopping Cart - Research

**Researched:** 2026-03-01
**Domain:** Client-side cart state management, localStorage persistence, ecommerce UI patterns
**Confidence:** HIGH

## Summary

Phase 2 implements a client-side shopping cart with localStorage persistence for the Centimentalcomics shop. The cart must support adding/removing items, quantity management, real-time total updates, and cross-session persistence. This phase bridges product browsing (Phase 1) with checkout (Phase 3).

Core challenges: managing client-side state durably without external services, handling product availability changes in persisted data, and maintaining accessible interactive UI patterns for quantity selection and cart updates.

**Primary recommendation:** Use Zustand with persist middleware for cart state management. Store only product IDs and quantities in localStorage, refetch product data on cart page load for accuracy. Implement accessible number steppers and real-time total calculations.

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- **Dedicated `/cart` page** (not slide-out drawer)
- **Cart icon with item count badge** in Navigation header, right side
- **Cart items display:** product thumbnail, name, unit price, quantity selector, line subtotal
- **Add-to-Cart buttons** on both product cards (grid) and product detail pages
- **Quantity picker on detail page** — stepper ([-] [qty] [+]) before adding
- **Grid card quick-add** — adds 1 unit per click
- **Button feedback:** "Added!" state with checkmark, returns to normal
- **Re-adding items** silently increments quantity (by 1 from grid, by picker amount from detail)
- **Sold-out products** cannot be added (button disabled, per Phase 1)
- **Cart quantity management:** inline stepper buttons ([-] [qty] [+])
- **Item removal:** trash/X icon per item, no confirmation dialog
- **"Clear Cart" button** removes all items at once
- **Empty cart state:** "Your cart is empty" message with "Browse the shop" link to /shop
- **Real-time total updates** as quantities change
- **localStorage only** — no cross-device sync (no user accounts)
- **Persistence strategy:** store product IDs and quantities only (not full product data)
- **On cart page load:** refetch current product data from DatoCMS
- **Sold-out in cart:** auto-remove unavailable products, show notice
- **Cart expiration:** never — persists indefinitely until user clears or completes checkout

### Claude's Discretion
- State management approach (Zustand, React Context, or other)
- Cart icon design (shopping bag, cart, basket)
- Exact animation/transition for "Added!" feedback
- Stepper button styling and min/max quantity limits
- How the "items removed" notice is presented
- Cart page responsive layout details

### Deferred Ideas
None — discussion stayed within phase scope

</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| CART-01 | User can add products to a shopping cart from product pages | Zustand store with add-to-cart action; separate handlers for grid (qty +1) vs detail (qty picker); button feedback with visual confirmation |
| CART-02 | User can view cart with item list, quantities, and running total | Dedicated /cart page; fetch product data from DatoCMS on load; real-time total calculation from cart state |
| CART-03 | User can update quantities or remove items from cart | Inline stepper component (accessible via react-aria or custom); trash icon per item; Clear Cart button; immediate state updates |
| CART-04 | Cart persists across page navigation and browser refresh | Zustand persist middleware with localStorage; store IDs+quantities only; refetch products on cart page for accuracy |

</phase_requirements>

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Zustand | ^4.4.0+ | Client-side cart state management | Lightweight, no Provider boilerplate, excellent localStorage integration via persist middleware; ecosystem standard for indie/small carts |
| React | Latest (19.0.7 in project) | UI framework | Already in project; supports Client Components for interactive cart features |
| localStorage API | Native | Client-side cart persistence | Built-in browser API; no external dependencies; sufficient for single-browser use case |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| React Aria (useNumberField) | ^3.x+ | Accessible number input stepper | WCAG 2.2 compliant, handles keyboard (arrow keys, scroll) and mouse interactions; manages aria-labels and roles |
| Next.js Cache Tags | ^15.x (project has 15.5.8) | Product data freshness on cart page | Refetch product data via datocmsRequest with cache tags to ensure current availability/price |
| next/font/google | Already configured | Typography (Inter) | Consistent with Phase 1 design system |
| Tailwind CSS | 3.4.17 (project) | Cart page styling | Consistent with existing design system; shop-* prefix pattern |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Zustand | React Context API | Context forces re-renders of all consumers on any state change; cart updates frequently (add, remove, quantity change). Zustand subscriptions avoid unnecessary renders. Context better for stable values (theme, auth). |
| Zustand | Redux | Redux adds significant boilerplate for a simple cart. Zustand is 1.2kB vs Redux 4.6kB; overkill for <20 products. |
| useNumberField | HTML `<input type="number">` | Native number input has inconsistent stepper appearance/behavior across browsers and poor accessibility support. React Aria provides consistent, WCAG-compliant component. |
| Dedicated /cart page | Cart drawer (slide-out sidebar) | Drawer is faster UX but user explicitly decided against it. Page allows more space for detailed line items, easier mobile layout. |
| localStorage | Supabase / database | Add complexity for cross-device sync (user accounts required). Simple indie shop doesn't need multi-device support. localStorage handles 5-10MB; cart is <100KB. |

**Installation:**
```bash
npm install zustand
# React Aria (for accessible number stepper)
npm install @react-aria/numberfield @react-stately/numberfield
```

## Architecture Patterns

### Recommended Project Structure
```
src/
├── app/
│   ├── lib/
│   │   ├── store/
│   │   │   └── cartStore.ts          # Zustand cart store with persist middleware
│   │   └── types.ts                   # CartItem interface (id, quantity)
│   ├── components/
│   │   ├── ProductCard.tsx            # Updated: add quick-add click handler
│   │   ├── AddToCartButton.tsx        # New: detail page button with feedback
│   │   ├── CartIcon.tsx               # New: header badge with item count
│   │   ├── Navigation.tsx             # Updated: include CartIcon + link to /cart
│   │   ├── QuantityStepper.tsx        # New: reusable [-] qty [+] component
│   │   ├── CartItem.tsx               # New: single cart line item with remove
│   │   └── CartSummary.tsx            # New: subtotal, total, Proceed button
│   └── cart/
│       └── page.tsx                    # New: /cart dedicated page
└── public/
    └── assets/
        └── icons/
            ├── shopping-bag.svg        # Cart icon (or shopping-cart.svg)
            └── trash.svg               # Remove item icon
```

### Pattern 1: Zustand Store with localStorage Persistence
**What:** Global state store using Zustand's persist middleware. Only stores product IDs and quantities; product names, prices, images fetched fresh from DatoCMS when cart page loads.
**When to use:** Any time you need client-only global state that survives page reloads and browser restarts, especially when data freshness is critical.
**Example:**
```typescript
// Source: https://github.com/pmndrs/zustand
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface CartItem {
  productId: string
  quantity: number
}

interface CartStore {
  items: CartItem[]
  addToCart: (productId: string, quantity?: number) => void
  removeFromCart: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
  getTotalItems: () => number
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      addToCart: (productId, quantity = 1) =>
        set((state) => {
          const existing = state.items.find((item) => item.productId === productId)
          if (existing) {
            return {
              items: state.items.map((item) =>
                item.productId === productId
                  ? { ...item, quantity: item.quantity + quantity }
                  : item,
              ),
            }
          }
          return { items: [...state.items, { productId, quantity }] }
        }),
      removeFromCart: (productId) =>
        set((state) => ({
          items: state.items.filter((item) => item.productId !== productId),
        })),
      updateQuantity: (productId, quantity) =>
        set((state) => ({
          items: state.items.map((item) =>
            item.productId === productId ? { ...item, quantity } : item,
          ),
        })),
      clearCart: () => set({ items: [] }),
      getTotalItems: () => get().items.reduce((sum, item) => sum + item.quantity, 0),
    }),
    {
      name: 'cart-storage', // localStorage key
      version: 1, // for future migrations
    },
  ),
)
```

### Pattern 2: Accessible Quantity Stepper Component
**What:** Reusable component for quantity input using React Aria's useNumberField hook. Provides keyboard navigation (arrow keys, Home/End), screen reader labels, and consistent cross-browser appearance.
**When to use:** Anywhere a user must input or adjust a numeric quantity (detail page picker, cart line items).
**Example:**
```typescript
// Source: https://react-spectrum.adobe.com/react-aria/useNumberField.html
'use client'

import { useNumberField } from '@react-aria/numberfield'
import { useNumberFieldState } from '@react-stately/numberfield'
import { useRef } from 'react'

interface QuantityStepperProps {
  value: number
  onChange: (value: number) => void
  minValue?: number
  maxValue?: number
  label?: string
}

export default function QuantityStepper({
  value,
  onChange,
  minValue = 1,
  maxValue = 999,
  label = 'Quantity',
}: QuantityStepperProps) {
  const state = useNumberFieldState({ value, onChange, minValue, maxValue })
  const inputRef = useRef(null)
  const { inputProps, incrementButtonProps, decrementButtonProps } = useNumberField(
    { label, minValue, maxValue },
    state,
    inputRef,
  )

  return (
    <div className="shop-quantity-stepper">
      <label htmlFor={inputProps.id} className="shop-quantity-stepper__label">
        {label}
      </label>
      <div className="shop-quantity-stepper__controls">
        <button {...decrementButtonProps} className="shop-quantity-stepper__btn shop-quantity-stepper__btn--minus">
          −
        </button>
        <input {...inputProps} ref={inputRef} className="shop-quantity-stepper__input" type="number" />
        <button {...incrementButtonProps} className="shop-quantity-stepper__btn shop-quantity-stepper__btn--plus">
          +
        </button>
      </div>
    </div>
  )
}
```

### Pattern 3: Add-to-Cart with Feedback
**What:** Button component that provides immediate visual feedback ("Added!") when user adds item, then returns to normal state. Separate handlers for grid (qty +1) and detail page (use picker value).
**When to use:** Product cards and detail page — distinguish quick-add from full cart management.
**Example:**
```typescript
// Source: Project patterns (Phase 1)
'use client'

import { useState } from 'react'
import { useCartStore } from '@/app/lib/store/cartStore'

interface AddToCartButtonProps {
  productId: string
  isSoldOut: boolean
  isDetailPage?: boolean
}

export default function AddToCartButton({
  productId,
  isSoldOut,
  isDetailPage = false,
}: AddToCartButtonProps) {
  const [showFeedback, setShowFeedback] = useState(false)
  const addToCart = useCartStore((state) => state.addToCart)

  const handleClick = () => {
    addToCart(productId, 1)
    setShowFeedback(true)
    setTimeout(() => setShowFeedback(false), 1500)
  }

  return (
    <button
      disabled={isSoldOut}
      onClick={handleClick}
      style={{
        backgroundColor: isSoldOut ? '#9ca3af' : '#ec4899',
        color: '#ffffff',
        // ... other styles
      }}
    >
      {showFeedback ? '✓ Added!' : 'Add to Cart'}
    </button>
  )
}
```

### Pattern 4: Cart Page Data Fetching with Freshness
**What:** On cart page load, fetch full product data (names, prices, images, availability) from DatoCMS for each item. Remove items that are now sold out. This ensures cart always displays current product state.
**When to use:** Cart page component — one-time fetch on mount, not on every re-render.
**Example:**
```typescript
// Source: Phase 1 patterns (datocmsRequest with cache tags)
async function getCartProducts(productIds: string[]) {
  if (productIds.length === 0) return []

  const PRODUCTS_QUERY = `
    query ProductsByIds($ids: [String!]!) {
      allProducts(filter: { id: { in: $ids } }) {
        id
        name
        price
        slug
        images { url alt }
        available
      }
    }
  `

  try {
    const data = await datocmsRequest<{ allProducts: Product[] }>(PRODUCTS_QUERY, {
      ids: productIds,
    })
    return data.allProducts || []
  } catch (error) {
    console.error('Failed to fetch cart products:', error)
    return []
  }
}

// On cart page:
export default async function CartPage() {
  const items = useCartStore((state) => state.items)
  const removeFromCart = useCartStore((state) => state.removeFromCart)

  const productIds = items.map((item) => item.productId)
  const products = await getCartProducts(productIds)

  // Check for sold-out items
  const availableProducts = new Set(products.filter((p) => p.available !== false).map((p) => p.id))
  const removedItems = items.filter((item) => !availableProducts.has(item.productId))

  removedItems.forEach((item) => removeFromCart(item.productId))

  // ... render cart
}
```

### Anti-Patterns to Avoid
- **Storing full product objects in cart state:** Product data changes (price, availability) won't update. Store only IDs+quantities.
- **Synchronous localStorage access on mount:** Can cause layout shift. Use `useEffect` with a `hasHydrated` flag to prevent SSR mismatch in Next.js.
- **Cart calculation from state without refetching:** Prices change. Always refetch and validate on checkout initiation (Phase 3).
- **No accessibility labels on stepper buttons:** Screen readers won't announce increment/decrement actions. Use `aria-label` or `useNumberField`.
- **Cart persists without availability check:** Sold-out items in cart confuse users. Auto-remove on cart page load with explanation.
- **Relying only on client-side validation:** Never trust cart contents at checkout. Server must re-validate quantities, prices, availability.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Accessible number input with stepper | Custom button/input combo | React Aria useNumberField | Custom implementations miss keyboard (arrow keys, Home/End), mobile (scroll wheel), screen reader ARIA roles. React Aria handles all edge cases. |
| localStorage serialization/hydration | JSON.stringify/parse in components | Zustand persist middleware | Custom code causes SSR hydration mismatches (state on server differs from client), persistence bugs, version migration complexity. Zustand handles all of this. |
| Cart total calculation | Manual reduce() in components | Derived from state in store | Calculations scattered across components become stale; Zustand forces single source of truth, easier to test. |
| Product availability checking on cart | Manual filter after fetch | DatoCMS `available` field + explicit removal on load | Manual checks don't work when availability changes between page loads. Fetch fresh data and auto-remove sold-out items. |

**Key insight:** Cart state management is deceptively complex when you account for cross-browser persistence, SSR/client hydration mismatch, real-time product changes, and accessibility. Zustand + localStorage is proven because it handles these edge cases. Building custom solutions consistently leads to lost carts, stale data, and accessibility failures.

## Common Pitfalls

### Pitfall 1: localStorage Hydration Mismatch in Next.js (SSR/Client)
**What goes wrong:** On server, state initializes empty (localStorage doesn't exist). Client hydrates with persisted data. HTML mismatch causes React hydration errors ("Expected server HTML to contain a matching div...").
**Why it happens:** Server renders without localStorage; client renders with it. Markup differs.
**How to avoid:**
  1. Create a `useCartStore` that initializes empty in getServerSideProps context
  2. Use a `hasHydrated` flag: only render cart count/page after client hydration
  3. Use Zustand's built-in onRehydrateStorage callback to handle this
**Warning signs:** Hydration errors in console during page load; cart count shows as 0 on server but correct on client; layout shift when page loads.

**Code example (safe pattern):**
```typescript
// cartStore.ts
const useCartStore = create<CartStore>()(
  persist(
    (set) => ({
      hasHydrated: false,
      // ... store definition
    }),
    {
      name: 'cart-storage',
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true)
      },
    },
  ),
)

// CartIcon.tsx (in Navigation)
'use client'
const CartIcon = () => {
  const [isMounted, setIsMounted] = useState(false)
  const itemCount = useCartStore((state) => state.getTotalItems())

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) return null // Prevent hydration mismatch
  return <span className="badge">{itemCount}</span>
}
```

### Pitfall 2: Cart Items Lost When Product Becomes Unavailable
**What goes wrong:** Product is in cart, seller marks it sold out in DatoCMS, user comes back to cart the next day, cart page crashes or shows "Product Not Found" for missing data.
**Why it happens:** Cart persists indefinitely, but product availability changes. Fetch doesn't return the product, cart still references the ID.
**How to avoid:**
  1. Always fetch fresh product data on cart page load
  2. Compare fetched products against cart IDs
  3. Auto-remove missing/sold-out items, show notice: "Love Letters to Ruby has sold out and been removed from your cart"
  4. Log removal so seller can email customer if needed
**Warning signs:** Cart page errors; users report items disappearing; missing product data in component renders.

### Pitfall 3: Quantity Updates Don't Trigger Re-renders (Store Subscription Issue)
**What goes wrong:** User clicks [-] button to reduce quantity, nothing happens on screen. Or re-render happens but old value displayed.
**Why it happens:** Component doesn't subscribe to the right store slice. Zustand won't re-render if you use the entire state object instead of subscribing to specific fields.
**How to avoid:**
  ```typescript
  // ❌ Wrong: re-render on any store change
  const cartItems = useCartStore((state) => state.items)

  // ✅ Right: re-render only when this item's quantity changes
  const quantity = useCartStore(
    (state) => state.items.find((item) => item.productId === productId)?.quantity ?? 0
  )
  ```
**Warning signs:** Quantity input updates but cart total doesn't; re-renders stale from Zustand state.

### Pitfall 4: Cart Never Empties Because Items Re-hydrate on Refresh
**What goes wrong:** User clears cart, page refreshes, items are back. Or user completes checkout, items still in cart because Zustand cleared local state but localStorage wasn't cleared.
**Why it happens:** Persistence middleware hydrates from localStorage even if you call `clearCart()`. Or `clearCart()` only clears state, not localStorage.
**How to avoid:**
  ```typescript
  clearCart: () => {
    set({ items: [] })
    // Explicitly clear localStorage entry
    localStorage.removeItem('cart-storage')
  }
  ```
**Warning signs:** Cart persists after user tries to clear; checkout doesn't reset cart; items reappear after page refresh post-clearance.

### Pitfall 5: Price/Availability Validated Client-Only, Bypassed on Checkout
**What goes wrong:** User adds product at PHP 300, price changes to PHP 500 in DatoCMS, they proceed to checkout. You charge them PHP 300 (wrong). Or they add 1, you shipped 100.
**Why it happens:** Client cart has stale price/quantity. Server doesn't re-validate.
**How to avoid:**
  1. **Phase 2:** Cart displays fetched price (refetched on page load)
  2. **Phase 3:** Checkout form server action MUST re-fetch product data and re-validate price, quantity, availability before order is submitted
  3. Never trust client-provided price or quantity
**Warning signs:** Price mismatches between cart and order; overselling; customers pay wrong amounts.

## Code Examples

Verified patterns from official sources:

### Cart Page Component (Client Component)
```typescript
// Source: https://nextjs.org/docs/app/getting-started/server-and-client-components
'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useCartStore, type CartItem } from '@/app/lib/store/cartStore'
import type { Product } from '@/app/lib/types'
import { datocmsRequest } from '@/app/lib/datocms'

async function getCartProducts(productIds: string[]): Promise<Product[]> {
  if (productIds.length === 0) return []

  const query = `
    query GetProducts($ids: [String!]!) {
      allProducts(filter: { id: { in: $ids } }) {
        id name price slug images { url alt } available
      }
    }
  `

  const data = await datocmsRequest<{ allProducts: Product[] }>(query, { ids: productIds })
  return data.allProducts || []
}

export default function CartPage() {
  const items = useCartStore((state) => state.items)
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadProducts = async () => {
      const ids = items.map((item) => item.productId)
      const fetched = await getCartProducts(ids)
      setProducts(fetched)
      setIsLoading(false)
    }

    loadProducts()
  }, [items])

  if (isLoading) return <p>Loading cart...</p>
  if (items.length === 0) return <EmptyCart />

  return <CartContent items={items} products={products} />
}

function EmptyCart() {
  return (
    <div className="shop-container" style={{ textAlign: 'center', paddingTop: '4rem' }}>
      <h1>Your cart is empty</h1>
      <Link href="/shop">Browse the shop</Link>
    </div>
  )
}

function CartContent({ items, products }: { items: CartItem[]; products: Product[] }) {
  const productMap = new Map(products.map((p) => [p.id, p]))
  const removeFromCart = useCartStore((state) => state.removeFromCart)
  const updateQuantity = useCartStore((state) => state.updateQuantity)

  const total = items.reduce((sum, item) => {
    const product = productMap.get(item.productId)
    return sum + (product?.price || 0) * item.quantity
  }, 0)

  return (
    <div className="shop-container">
      <h1>Cart</h1>
      {items.map((item) => {
        const product = productMap.get(item.productId)
        if (!product) return null

        return (
          <CartItemRow
            key={item.productId}
            product={product}
            quantity={item.quantity}
            onQuantityChange={(qty) => updateQuantity(item.productId, qty)}
            onRemove={() => removeFromCart(item.productId)}
          />
        )
      })}
      <div className="shop-cart-summary">
        <p>Subtotal: PHP {total.toFixed(0)}</p>
        <Link href="/checkout" className="shop-btn">
          Proceed to Checkout
        </Link>
      </div>
    </div>
  )
}

function CartItemRow({
  product,
  quantity,
  onQuantityChange,
  onRemove,
}: {
  product: Product
  quantity: number
  onQuantityChange: (qty: number) => void
  onRemove: () => void
}) {
  return (
    <div className="shop-cart-item">
      {product.images?.[0] && (
        <Image src={product.images[0].url} alt={product.name} width={100} height={100} />
      )}
      <div className="shop-cart-item__details">
        <h3>{product.name}</h3>
        <p>PHP {product.price}</p>
        <QuantityStepper value={quantity} onChange={onQuantityChange} />
        <button onClick={onRemove}>Remove</button>
      </div>
      <p className="shop-cart-item__subtotal">PHP {(product.price * quantity).toFixed(0)}</p>
    </div>
  )
}
```

### Quick-Add Button (for ProductCard)
```typescript
// Source: Phase 1 patterns adapted
'use client'

import { useState } from 'react'
import { useCartStore } from '@/app/lib/store/cartStore'

interface QuickAddProps {
  productId: string
  isSoldOut: boolean
}

export default function QuickAdd({ productId, isSoldOut }: QuickAddProps) {
  const [feedback, setFeedback] = useState<'idle' | 'added'>('idle')
  const addToCart = useCartStore((state) => state.addToCart)

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    addToCart(productId, 1)
    setFeedback('added')
    setTimeout(() => setFeedback('idle'), 1500)
  }

  return (
    <button
      disabled={isSoldOut}
      onClick={handleClick}
      className={`shop-quick-add ${feedback === 'added' ? 'shop-quick-add--added' : ''}`}
    >
      {feedback === 'added' ? '✓' : '+'}
    </button>
  )
}
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Redux for cart state | Zustand with persist middleware | 2022-2024 | Eliminated boilerplate; smaller bundle; faster development for simple carts |
| Manual localStorage code | Zustand persist middleware | 2023+ | Eliminated SSR hydration bugs; automatic version migrations support |
| HTML `<input type="number">` with native stepper | React Aria useNumberField | 2022+ | Cross-browser consistency; WCAG 2.2 compliance; keyboard + screen reader support |
| Cart in Context API | Zustand for global state | 2023+ | Context refactoring issue solved; no unnecessary re-renders of non-cart components |
| Drawer-style cart | Dedicated /cart page | User decision for this project | Better UX for quantity management; improved mobile layout; less intrusive |

**Deprecated/outdated:**
- Redux for shopping carts: Overkill boilerplate. Zustand does 90% of what Redux does with 10% of the code.
- React Query for cart state: React Query optimized for server state; cart is client-only state.
- Manual localStorage.setItem/getItem in useEffect: Fragile and error-prone. Zustand persist handles edge cases (hydration, quota exceeded, etc.)

## Open Questions

1. **Min/max quantity limits on stepper**
   - What we know: Phase requirements don't specify limits; Zustand action can enforce them
   - What's unclear: Should cart allow quantity 999 or cap at 10? Does any product have stock limits?
   - Recommendation: For now, allow 1–999. Phase 3 checkout can enforce per-product limits if needed.

2. **"Items removed" notice presentation**
   - What we know: DatoCMS may change availability; cart should remove sold-out items on load
   - What's unclear: Toast notification? Banner at top? Silent removal?
   - Recommendation: Dismissable banner: "Love Letters to Ruby has sold out and been removed from your cart." Dismisses on click or auto-hides after 5 seconds.

3. **Cart icon design and styling**
   - What we know: User wants icon + badge with count
   - What's unclear: SVG source? Style in Navigation header?
   - Recommendation: Use shopping-bag or shopping-cart SVG icon (free from Heroicons, already in project as @heroicons/react). Style badge with accent color #ec4899 to match brand.

4. **Product detail page quantity picker integration**
   - What we know: Detail page has placeholder button; Phase 2 wires it to cart
   - What's unclear: Should picker default to 1 or empty? Persist picker value if user navigates away?
   - Recommendation: Default to 1. Don't persist picker value—reset to 1 on each detail page visit. Keep cart state separate from page interaction state.

## Validation Architecture

> Skip this section entirely if workflow.nyquist_validation is false in .planning/config.json

**Config check:** workflow not specified in provided config.json; assume testing scope is optional for Phase 2. Placeholder included for reference.

### Test Framework
| Property | Value |
|----------|-------|
| Framework | Jest (likely; no explicit test config detected in project) |
| Config file | None detected — see Wave 0 |
| Quick run command | `npm test -- cart.test 2>/dev/null` |
| Full suite command | `npm test 2>/dev/null` |

### Phase Requirements → Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| CART-01 | Add product to cart increments item count | unit | `npm test -- addToCart` | ❌ Wave 0 |
| CART-02 | Cart page fetches product data and displays items | integration | `npm test -- cartPage` | ❌ Wave 0 |
| CART-03 | Update quantity via stepper; remove item via button | unit | `npm test -- cartActions` | ❌ Wave 0 |
| CART-04 | Cart state persists to localStorage; hydrates on load | integration | `npm test -- cartPersist` | ❌ Wave 0 |

### Sampling Rate
- **Per task commit:** Manual verification (add item, verify badge updates, check localStorage in DevTools)
- **Per wave merge:** Full integration test coverage before merging to main
- **Phase gate:** Manually test CART-01 through CART-04 success criteria before `/gsd:verify-work`

### Wave 0 Gaps
- [ ] `tests/store/cartStore.test.ts` — unit tests for Zustand store actions
- [ ] `tests/components/CartPage.test.tsx` — integration test for product fetching and UI rendering
- [ ] `tests/hooks/useCartStore.test.ts` — persistence hydration edge cases
- [ ] Test setup: Jest configuration, React Testing Library, mock DatoCMS fetch
- [ ] localStorage mock for Node.js test environment

*(Note: Existing test infrastructure detection needed before finalizing. If no tests exist, Wave 0 should include basic Jest + RTL setup.)*

## Sources

### Primary (HIGH confidence)
- [Zustand Documentation - GitHub](https://github.com/pmndrs/zustand) - State management library API and persist middleware
- [React Aria useNumberField](https://react-spectrum.adobe.com/react-aria/useNumberField.html) - Accessible number input component hook
- [Next.js Documentation - Caching & Revalidation](https://nextjs.org/docs/app/getting-started/caching-and-revalidating) - Cache tags and on-demand revalidation patterns
- [DatoCMS Cache Tags Integration](https://www.datocms.com/docs/next-js/using-cache-tags) - Product data freshness strategies

### Secondary (MEDIUM confidence)
- [HackerNoon: How to Build a Shopping Cart with Next.js and Zustand](https://hackernoon.com/how-to-build-a-shopping-cart-with-nextjs-and-zustand-state-management-with-typescript) - End-to-end Zustand cart pattern with TypeScript
- [Medium: Zustand with localStorage Persistence](https://medium.com/@jalish.dev/how-to-use-zustand-in-react-with-local-storage-persistence-fd67ab0cc5a0) - Persist middleware configuration and hydration patterns
- [Practical Ecommerce: Accessibility and the Checkout Process](https://www.practicalecommerce.com/Accessibility-and-the-Checkout-Process) - WCAG compliance for cart interactions

### Tertiary (LOW confidence, noted for validation)
- WebSearch results on accessibility: WCAG 2.2 compliance for stepper components, but specific detailed recommendations need official source verification
- WebSearch results on Context vs Zustand: General ecosystem consensus in 2026 blogs; official React docs still recommend Context for certain patterns

## Metadata

**Confidence breakdown:**
- **Standard stack:** HIGH — Zustand is ecosystem standard for cart state; React Aria useNumberField is Adobe's official accessible component; localStorage is native browser API; DatoCMS cache tags are production-tested
- **Architecture:** HIGH — Zustand persist middleware well-documented; cart-as-client-state pattern proven across hundreds of shops; fetch-products-on-load strategy prevents stale data bugs
- **Pitfalls:** HIGH — Common mistakes (hydration mismatch, sold-out items, quantity stale reads) documented in Zustand issues/discussions and ecommerce best practices; mitigation strategies verified with pattern examples
- **Accessibility:** MEDIUM — React Aria recommendations HIGH, but WCAG 2.2 stepper requirements noted in secondary sources (needs official W3C verification for absolute certainty)

**Research date:** 2026-03-01
**Valid until:** 2026-03-31 (30 days for stable technologies; Zustand/React Aria are mature, unlikely to change)
