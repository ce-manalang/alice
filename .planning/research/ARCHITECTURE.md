# Architecture Research: Next.js 15 E-Commerce Shop

**Domain:** Small e-commerce shop (under 20 products) with headless CMS
**Researched:** 2026-02-20
**Confidence:** HIGH

## Standard Architecture

### System Overview

```
┌──────────────────────────────────────────────────────────────────┐
│                         Client Layer                             │
├──────────────────────────────────────────────────────────────────┤
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐            │
│  │ ProductPage  │  │ CartDrawer   │  │ OrderForm    │  Client    │
│  │ (Server)     │  │ (Client)     │  │ (Client)     │ Components │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘            │
│         │                 │                 │                    │
├─────────┴─────────────────┴─────────────────┴────────────────────┤
│                    Server Components                             │
├──────────────────────────────────────────────────────────────────┤
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  Layout (root layout, nav, footer)                       │   │
│  │  ProductListLayout (category page structure)             │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  Server Actions (formSubmit, cartMutations)              │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                  │
├──────────────────────────────────────────────────────────────────┤
│              Data & Integration Layer                            │
├──────────────────────────────────────────────────────────────────┤
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐            │
│  │ DatoCMS API  │  │ Cart Context │  │ Form State   │  Services  │
│  │ (fetch)      │  │ (React)      │  │ (useAction)  │            │
│  └──────────────┘  └──────────────┘  └──────────────┘            │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘

                            Vercel Deployment
```

### Component Boundaries

| Component | Responsibility | Communicates With | Render Type |
|-----------|---|---|---|
| **Root Layout** | HTML structure, navigation, footer, global styles | All pages | Server |
| **ProductList** | Fetch and display all products with filtering/categories | ProductCard, Filter, Sort | Server |
| **ProductPage** | Fetch individual product, display details, "Add to Cart" button | CartProvider, ProductDetail | Server (with Client Button) |
| **ProductCard** | Display product preview card (image, name, price) | ProductPage link | Server |
| **CartProvider** | Cart state management, persistence to localStorage | CartDrawer, CartButton | Client Context |
| **CartDrawer** | Display cart items, remove items, show total, checkout link | CartProvider, OrderForm link | Client |
| **OrderForm** | Collect customer info (name, email, phone) and items | Server Action (submitOrder) | Client Form |
| **SubmitOrder Action** | Server-side form handling, validation, storage/notification | Database/email service | Server Action |
| **About/FAQ Pages** | Static content pages | Navigation | Server |

## Recommended Project Structure

```
src/
├── app/
│   ├── layout.tsx                    # Root layout (nav, footer, providers)
│   ├── page.tsx                      # Homepage
│   ├── error.tsx                     # Error boundary
│   ├── not-found.tsx                 # 404 page
│   │
│   ├── (shop)/
│   │   ├── layout.tsx                # Shop section layout
│   │   ├── products/
│   │   │   ├── page.tsx              # All products list with filters
│   │   │   └── [slug]/
│   │   │       └── page.tsx          # Individual product page (dynamic)
│   │   │
│   │   ├── categories/
│   │   │   └── [category]/
│   │   │       └── page.tsx          # Products by category
│   │   │
│   │   └── checkout/
│   │       └── page.tsx              # Order form page
│   │
│   ├── (marketing)/
│   │   ├── about/
│   │   │   └── page.tsx              # About page
│   │   └── faq/
│   │       └── page.tsx              # FAQ page
│   │
│   ├── api/
│   │   └── revalidate/
│   │       └── route.ts              # ISR webhook endpoint for DatoCMS
│   │
│   └── actions/
│       └── order.ts                  # Server actions for form submission
│
├── components/
│   ├── _shared/                      # Shared components (prevents routing)
│   │   ├── Header.tsx
│   │   ├── Navigation.tsx
│   │   ├── Footer.tsx
│   │   └── SEO.tsx
│   │
│   ├── _shop/                        # Shop-specific components
│   │   ├── ProductCard.tsx
│   │   ├── ProductDetail.tsx
│   │   ├── ProductFilter.tsx
│   │   ├── ProductSort.tsx
│   │   └── ProductGrid.tsx
│   │
│   ├── _cart/                        # Cart components
│   │   ├── CartProvider.tsx          # Context provider (Client Component)
│   │   ├── CartButton.tsx            # Cart button with item count
│   │   ├── CartDrawer.tsx            # Drawer/modal showing cart items
│   │   └── CartItem.tsx              # Individual cart item
│   │
│   └── _forms/                       # Form components
│       └── OrderForm.tsx             # Checkout/order form
│
├── lib/
│   ├── datocms.ts                    # DatoCMS API client + fetch functions
│   ├── types.ts                      # TypeScript types/interfaces
│   ├── utils.ts                      # Helper functions
│   └── constants.ts                  # App constants (categories, etc.)
│
├── styles/
│   ├── globals.css                   # Global Tailwind styles
│   └── variables.css                 # CSS custom properties
│
├── hooks/
│   ├── useCart.ts                    # Cart context hook
│   └── useFormStatus.ts              # Form submission status
│
└── public/
    ├── images/
    │   └── products/                 # Product images
    └── icons/                        # SVG icons
```

### Structure Rationale

- **Route Groups `(shop)`, `(marketing)`:** Organize related routes without affecting URL structure. Shop routes sit at `/products`, `/checkout` not `/shop/products`.
- **Underscore-prefixed folders `_shared`, `_shop`, `_cart`:** Colocate components logically without accidentally creating routes. Router ignores these folders.
- **Server vs Client Separation:** Server Components in `/app` (pages, layouts, data fetching). Client Components in `/components` marked with `"use client"`.
- **Actions folder:** All Server Actions live in `src/app/actions/` following Next.js conventions.
- **lib/datocms.ts:** Centralized data fetching logic to avoid coupling views to API calls.
- **Types in lib/:** Single source of truth for TypeScript interfaces used across the app.

## Architectural Patterns

### Pattern 1: Server Components for Data Fetching + Client Components for Interactivity

**What:** Fetch data server-side on product pages using async Server Components, passing immutable data down to Client Components for interactivity (e.g., "Add to Cart" button).

**When to use:** Always. This is the default pattern in Next.js 15 App Router.

**Trade-offs:**
- **Pro:** Reduced JavaScript bundle, secrets stay secure, direct database/API access
- **Pro:** Data fetching collocated with rendering
- **Con:** Can't use React hooks in Server Components
- **Con:** Must pass data as props to Client Children

**Example:**
```typescript
// app/shop/products/[slug]/page.tsx - SERVER COMPONENT
import { getProduct } from '@/lib/datocms';
import ProductDetail from '@/components/_shop/ProductDetail';
import AddToCartButton from '@/components/_cart/AddToCartButton';

export default async function ProductPage({ params }) {
  const product = await getProduct(params.slug);

  return (
    <div>
      <ProductDetail product={product} />
      {/* Client component receives product as prop */}
      <AddToCartButton product={product} />
    </div>
  );
}

// components/_cart/AddToCartButton.tsx - CLIENT COMPONENT
'use client';
import { useCart } from '@/hooks/useCart';

export default function AddToCartButton({ product }) {
  const { addItem } = useCart();

  return (
    <button onClick={() => addItem(product)}>
      Add to Cart
    </button>
  );
}
```

### Pattern 2: Server Actions for Form Handling

**What:** Use `'use server'` directive for Server Actions that handle form submissions (order form) server-side, eliminating need for API routes while keeping logic secure.

**When to use:** Form submissions, mutations, operations requiring secrets/database access.

**Trade-offs:**
- **Pro:** No separate API route needed, progressive enhancement (works without JavaScript)
- **Pro:** Strongly typed between client and server
- **Con:** Can't use browser APIs (localStorage) directly in Server Actions

**Example:**
```typescript
// app/actions/order.ts
'use server';

import { saveOrder } from '@/lib/db';

export async function submitOrder(formData: FormData) {
  const name = formData.get('name') as string;
  const email = formData.get('email') as string;
  const items = JSON.parse(formData.get('items') as string);

  // Validation
  if (!name || !email || !items.length) {
    return { error: 'Missing required fields' };
  }

  try {
    const order = await saveOrder({ name, email, items });
    return { success: true, orderId: order.id };
  } catch (error) {
    return { error: 'Failed to submit order' };
  }
}

// components/_forms/OrderForm.tsx - CLIENT COMPONENT
'use client';
import { useActionState } from 'react';
import { submitOrder } from '@/app/actions/order';

export default function OrderForm({ cartItems }) {
  const [state, formAction, isPending] = useActionState(
    submitOrder,
    { error: null, success: false }
  );

  return (
    <form action={formAction}>
      <input name="name" required />
      <input name="email" type="email" required />
      <input name="items" type="hidden" value={JSON.stringify(cartItems)} />
      <button disabled={isPending}>
        {isPending ? 'Submitting...' : 'Place Order'}
      </button>
      {state.success && <p>Order #{state.orderId} received!</p>}
      {state.error && <p className="error">{state.error}</p>}
    </form>
  );
}
```

### Pattern 3: Context API for Cart State (Client-Side)

**What:** Use React Context + useReducer for lightweight client-side cart state management. Persist to localStorage for cart recovery across sessions.

**When to use:** Shared state needed across multiple client components (cart drawer, buttons, checkout form).

**Trade-offs:**
- **Pro:** Lightweight, no dependencies, built-in to React
- **Pro:** Easy to debug, understand data flow
- **Con:** No built-in persistence (must handle localStorage manually)
- **Con:** All consumers re-render on state change (fine for small carts)

**Example:**
```typescript
// contexts/CartContext.tsx
'use client';
import { createContext, useContext, useReducer, ReactNode, useEffect } from 'react';

type CartItem = { id: string; name: string; price: number; quantity: number };
type CartState = { items: CartItem[] };
type CartAction =
  | { type: 'ADD_ITEM'; payload: CartItem }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'UPDATE_QUANTITY'; payload: { id: string; quantity: number } }
  | { type: 'LOAD_FROM_STORAGE'; payload: CartItem[] };

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD_ITEM':
      const existing = state.items.find(i => i.id === action.payload.id);
      return {
        items: existing
          ? state.items.map(i =>
              i.id === action.payload.id
                ? { ...i, quantity: i.quantity + action.payload.quantity }
                : i
            )
          : [...state.items, action.payload]
      };
    case 'REMOVE_ITEM':
      return { items: state.items.filter(i => i.id !== action.payload) };
    case 'LOAD_FROM_STORAGE':
      return { items: action.payload };
    default:
      return state;
  }
}

const CartContext = createContext<any>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, { items: [] });

  // Load from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('cart');
    if (stored) {
      dispatch({ type: 'LOAD_FROM_STORAGE', payload: JSON.parse(stored) });
    }
  }, []);

  // Persist to localStorage on change
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(state.items));
  }, [state.items]);

  return (
    <CartContext.Provider value={{ state, dispatch }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const { state, dispatch } = useContext(CartContext);
  return {
    items: state.items,
    addItem: (item: CartItem) => dispatch({ type: 'ADD_ITEM', payload: item }),
    removeItem: (id: string) => dispatch({ type: 'REMOVE_ITEM', payload: id }),
  };
}
```

### Pattern 4: Static Generation + ISR for Product Pages

**What:** Generate product pages at build time using `generateStaticParams()`. When CMS is updated, trigger on-demand revalidation via webhook.

**When to use:** Product catalog pages that rarely change but need freshness on CMS publish.

**Trade-offs:**
- **Pro:** Lightning-fast static HTML served from CDN
- **Pro:** Webhook-based updates = fresh content without full rebuilds
- **Con:** Build takes longer initially (pre-generates all products)
- **Con:** ISR revalidation adds slight delay when CMS publishes

**Example:**
```typescript
// lib/datocms.ts
const DATOCMS_API = 'https://graphql.datocms.com/';
const DATOCMS_TOKEN = process.env.NEXT_PUBLIC_DATOCMS_API_TOKEN;

export async function getProducts() {
  const response = await fetch(DATOCMS_API, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${DATOCMS_TOKEN}` },
    body: JSON.stringify({
      query: `query { allProducts { id slug name price description image { url } } }`
    })
  });
  return response.json();
}

export async function getProduct(slug: string) {
  const response = await fetch(DATOCMS_API, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${DATOCMS_TOKEN}` },
    body: JSON.stringify({
      query: `query { product(filter: { slug: { eq: "${slug}" } }) { id slug name price description image { url } } }`
    })
  });
  return response.json();
}

// app/shop/products/[slug]/page.tsx
import { getProduct, getProducts } from '@/lib/datocms';

export async function generateStaticParams() {
  const data = await getProducts();
  return data.allProducts.map((product) => ({
    slug: product.slug,
  }));
}

export default async function ProductPage({ params }) {
  const product = await getProduct(params.slug);
  return <ProductDetail product={product} />;
}

// app/api/revalidate/route.ts - WEBHOOK ENDPOINT
import { revalidateTag } from 'next/cache';

export async function POST(request: Request) {
  const secret = request.headers.get('x-datocms-signature');

  if (secret !== process.env.DATOCMS_WEBHOOK_SECRET) {
    return new Response('Unauthorized', { status: 401 });
  }

  const body = await request.json();
  const resourceType = body.entity.__typename;

  if (resourceType === 'Product') {
    revalidateTag('products');
    return Response.json({ revalidated: true });
  }

  return Response.json({ revalidated: false });
}
```

### Pattern 5: Atomic Component Organization

**What:** Organize components using atomic design: Atoms (buttons, inputs) → Molecules (form fields, cards) → Organisms (product list, checkout).

**When to use:** Any project. Especially helpful for design consistency and reusability.

**Trade-offs:**
- **Pro:** Clear component hierarchy, easy to find and reuse
- **Pro:** Scales well as component library grows
- **Con:** Requires discipline to maintain boundaries
- **Con:** Can feel over-engineered for very small projects

**Example:**
```typescript
// Atoms (smallest, reusable)
components/_atoms/Button.tsx
components/_atoms/Input.tsx
components/_atoms/Badge.tsx
components/_atoms/Price.tsx

// Molecules (combines atoms, standalone)
components/_molecules/ProductCard.tsx (Image + Name + Price + Button)
components/_molecules/FormField.tsx (Label + Input)
components/_molecules/CartLineItem.tsx (Product info + Quantity + Remove)

// Organisms (complex sections)
components/_organisms/ProductGrid.tsx (multiple ProductCards)
components/_organisms/OrderForm.tsx (multiple FormFields + Button)
components/_organisms/CartDrawer.tsx (CartLineItems + Total + Checkout)
```

## Data Flow

### Product Browsing & Cart Flow

```
User Visits /products
    ↓
Server: Fetch all products from DatoCMS
    ↓
Render: ProductGrid component with ProductCard children
    ↓
User clicks product → /products/[slug]
    ↓
Server: Fetch single product from DatoCMS
    ↓
Render: ProductDetail + ClientAddToCartButton
    ↓
User clicks "Add to Cart" (Client Click)
    ↓
Client: CartContext dispatch → useReducer → localStorage update
    ↓
UI: CartDrawer shows updated count/items
```

### Order Submission Flow

```
User clicks "Checkout"
    ↓
Navigate to /checkout
    ↓
Render: OrderForm (Client Component) with cart items in hidden input
    ↓
User fills form + clicks submit
    ↓
Form action → submitOrder Server Action
    ↓
Server: Validate data → Save to database/send email notification
    ↓
Return response: { success: true, orderId: "..." }
    ↓
Client: Show success message, clear cart from localStorage
    ↓
Optional: Redirect to confirmation page
```

### Content Update Flow (CMS → Live)

```
Editor publishes product change in DatoCMS
    ↓
DatoCMS triggers webhook → POST /api/revalidate
    ↓
Next.js: revalidateTag('products') invalidates ISR cache
    ↓
Next request to product page → regenerate static HTML
    ↓
Serve updated page
```

## Integration Points

### External Services

| Service | Integration Pattern | Notes |
|---------|---------------------|-------|
| **DatoCMS** | REST/GraphQL fetch in lib/datocms.ts, Server Components call this | Use `NEXT_PUBLIC_DATOCMS_API_TOKEN` env var. Webhook for ISR revalidation. |
| **Database (for orders)** | Server Actions + optional ORM (if using Supabase/etc) | Store orders: name, email, items, timestamp. No PII needed beyond contact info. |
| **Email** | Server Actions can call Resend/SendGrid after order submission | Optional: send confirmation to customer + admin |
| **Vercel Analytics** | Built-in with next/analytics | Track page views, user interactions |

### Internal Boundaries

| Boundary | Communication | Notes |
|----------|---|---|
| **Server Components ↔ Client Components** | Props only (one-way data flow) | Render Server Component, pass data as props to Client Component children. |
| **Client Components ↔ Server Actions** | Form action / useActionState hook | Client form calls Server Action, gets back response/error. |
| **Cart Context ↔ Components** | useCart() hook | All cart-aware components consume context via hook. |
| **Components ↔ lib/datocms** | Import fetch functions | Server Components import and call DatoCMS helpers. No direct API calls in components. |

## Scaling Considerations

| Scale | Architecture Adjustments |
|-------|---|
| **0-100 users (MVP)** | Current architecture perfect. Single PostgreSQL/Supabase for orders. Context API for cart. No caching needed beyond ISR. |
| **100-1k users** | Add Vercel KV for session cart backup (optional). Monitor DatoCMS query costs. Consider image optimization (next/image). |
| **1k+ users** | Move order storage to dedicated database. Implement edge functions for geo-local checkout. Add CDN image caching. Consider moving from Context to Zustand if cart logic grows. |

### Scaling Priorities

1. **First bottleneck:** DatoCMS API rate limits. Solution: Implement request caching, batch queries, consider static generation for catalog.
2. **Second bottleneck:** Image delivery. Solution: Use Next.js Image component with Vercel CDN, implement responsive image sizes.
3. **Third bottleneck:** Order database storage. Solution: Archive old orders, implement database indexing on order date/email.

## Anti-Patterns

### Anti-Pattern 1: Fetching in Client Components

**What people do:** Use `useEffect` to fetch product data in a Client Component on mount.

**Why it's wrong:**
- Delays rendering (data fetching only starts after hydration)
- Waterfalls (fetch in child delays render)
- No streaming benefit from Server Components
- Increases bundle size with fetch logic

**Do this instead:** Fetch in Server Component, pass data as props to Client children.

### Anti-Pattern 2: Server Actions with Heavy Business Logic

**What people do:** Put complex order validation, inventory checks, payment logic in Server Actions.

**Why it's wrong:**
- Server Actions designed for simple data mutations
- Complex logic belongs in service layer/database triggers
- Harder to test and reuse

**Do this instead:** Keep Server Actions thin (extract data), call service functions in lib/ that contain business logic.

### Anti-Pattern 3: Storing All Cart Data in localStorage

**What people do:** Store full product objects with images/descriptions in localStorage.

**Why it's wrong:**
- localStorage is limited (~5-10MB), bloats with images
- No security for sensitive data
- Stale data if products updated in CMS

**Do this instead:** Store only `{ productId, quantity }` in localStorage. Fetch full product data from server when needed.

### Anti-Pattern 4: Over-Fetching from DatoCMS

**What people do:** Fetch all product fields (including heavy content) for list pages.

**Why it's wrong:**
- Waste API bandwidth and slow rendering
- CMS quota costs increase
- Worse UX (slower pages)

**Do this instead:** Use GraphQL queries to fetch only needed fields. Separate queries for list (name, price, thumbnail) vs detail (full description, gallery).

### Anti-Pattern 5: Mixing Server & Client State

**What people do:** Fetch product in Server Component, then fetch again in Client useEffect to sync state.

**Why it's wrong:**
- Redundant requests
- Risk of stale data mismatch
- Defeats purpose of Server Components

**Do this instead:** Single source of truth. Server fetches → passes to Client. Client can refetch if needed, but shouldn't duplicate server fetch.

## Recommendations

### For This Project

Given the constraints (under 20 products, order form + meetup checkout, rebuilding from scratch):

1. **Use Static Generation for product pages:** All 20 products fit in memory. generateStaticParams() pre-builds in ~1 second. DatoCMS webhook revalidates on publish.

2. **Context API + localStorage for cart:** No backend cart persistence needed. Users can abandon cart during meetup. On checkout, submit items to Server Action which stores in database/email.

3. **Database for orders:** Use Supabase (already in project) or simple JSON file + email notification. Order form just needs: name, email, items, timestamp. No complex fulfillment logic needed.

4. **ISR for homepage featured products:** Refresh every 24 hours in case CMS updates. Fast rebuild since catalog is small.

5. **No async client-side cart sync:** Cart lives locally in React Context. On checkout, form includes full item list (sent as JSON in hidden input). No need for server-side cart persistence during shopping.

6. **Atomic components but simple:** Don't over-engineer. 3-level hierarchy (atoms/molecules/organisms) is enough. Start flat, refactor when duplication appears.

### Build Order (Dependencies)

1. **Layout + Navigation** (root layout, typography, color variables)
   - Everything else depends on consistent styling

2. **Product fetch + list page** (lib/datocms, getProducts)
   - Data flow foundation. Unblock product pages.

3. **Product detail page** (dynamic [slug], generateStaticParams)
   - Validates DatoCMS fetch logic. Builds static files.

4. **Cart Context + Add to Cart** (useCart hook, localStorage)
   - Core e-commerce feature. Required before checkout.

5. **Order form + Server Action** (OrderForm component, submitOrder action)
   - Checkout flow. Depends on cart working.

6. **Cart Drawer** (CartDrawer component, useCart hook)
   - Polish. Depends on cart context existing.

7. **Category pages + filtering** (optional, low priority)
   - Nice-to-have. Shop functions without it.

8. **About + FAQ pages** (static, no dependencies)
   - Last. Marketing content.

9. **ISR webhook** (revalidate API route)
   - Final infrastructure. Everything works without it (manual revalidation always available).

This order ensures testable, incremental progress. Each step delivers working functionality.

## Sources

- [Next.js App Router Documentation](https://nextjs.org/docs/app)
- [Next.js Server and Client Components Guide](https://nextjs.org/docs/app/getting-started/server-and-client-components)
- [Building a Next.js shopping cart app - LogRocket Blog](https://blog.logrocket.com/building-a-next-js-shopping-cart-app/)
- [Next.js Forms and Server Actions](https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations)
- [DatoCMS + Next.js Integration](https://www.datocms.com/docs/next-js)
- [Next.js Incremental Static Regeneration (ISR)](https://nextjs.org/docs/app/guides/incremental-static-regeneration)
- [The Ultimate Guide to Organizing Your Next.js 15 Project Structure - Wisp CMS](https://www.wisp.blog/blog/the-ultimate-guide-to-organizing-your-nextjs-15-project-structure)
- [Mastering Next.js App Router: Best Practices - Medium](https://thiraphat-ps-dev.medium.com/mastering-next-js-app-router-best-practices-for-structuring-your-application-3f8cf0c76580)
- [Building a Modern E-commerce System: Next.js 15+ Architecture - Medium](https://medium.com/@d_pt_m/building-a-modern-e-commerce-system-next-js-15-shopify-go-high-level-architecture-55b19ca23465)
- [Next.js Commerce: A headless Shopify ecommerce template - Vercel](https://vercel.com/blog/introducing-next-js-commerce-2-0)

---
*Architecture research for: Next.js 15 e-commerce shop with DatoCMS*
*Researched: 2026-02-20*
