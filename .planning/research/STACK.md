# Stack Research: Indie E-Commerce Shop (Educational Zines)

**Domain:** Small indie e-commerce shop (educational zines, apparel, stationery, pins)
**Researched:** 2026-02-20
**Confidence:** HIGH
**Stack Stability:** Production-ready — all recommended libraries are stable and actively maintained

---

## Executive Summary

For a Next.js 15 indie e-commerce shop with under 20 products and meetup-based fulfillment (no payment processing), the 2025 standard stack combines:

- **Next.js 15 App Router** with Server Components for fast product pages via ISR and `use cache` directives
- **Server Actions + Zod** for secure, validated order form handling
- **Client-side state** (Zustand for cart) instead of complex database ORM patterns
- **DatoCMS integration** for product catalog management
- **Resend + React Email** for transactional emails (order confirmations)
- **ShadCN UI** with React Hook Form for form components and UX

This stack prioritizes developer experience, performance (Core Web Vitals), and simplicity. The Partial Prerendering (PPR) feature is NOT recommended for production use yet (still experimental), so we use ISR with `use cache` instead.

---

## Recommended Stack

### Core Framework

| Technology | Version | Purpose | Why Recommended |
|------------|---------|---------|-----------------|
| **Next.js** | 15.x (latest) | React meta-framework, App Router, SSR/SSG/ISR | Industry standard for e-commerce, built-in image optimization, edge caching, Vercel deployment |
| **React** | 19.x (bundled) | UI library with Server Components | Fully integrated with Next.js 15, Server Components reduce client JS, better performance |
| **TypeScript** | 5.x | Type safety for forms, API routes, components | Prevents runtime errors in form validation, API handling, and DatoCMS integration |
| **Tailwind CSS** | 4.x | Utility-first CSS framework | Small bundle, matches zine/playful aesthetic, JIT compilation removes unused CSS |

### Product Data & Content

| Technology | Version | Purpose | Why Recommended |
|------------|---------|---------|-----------------|
| **DatoCMS** | Latest API | Headless CMS for product catalog | Already integrated in existing codebase; structured content management; webhook support for revalidation |
| **DatoCMS GraphQL API** | Latest | Fetch product data from CMS | Type-safe queries, efficient data fetching, builds ISR/caching strategies on top |

### Form Handling & Validation

| Technology | Version | Purpose | Why Recommended |
|------------|---------|---------|-----------------|
| **Server Actions** | Next.js built-in | Handle order form submissions securely | Runs on server, no separate API routes needed, CSRF protection built-in, TypeScript support |
| **Zod** | 4.3.x | Schema validation for form data | Type inference, better performance in v4 (14x faster string parsing), tree-shakable @zod/mini for frontend |
| **React Hook Form** | 7.71.x | Client-side form state management | Minimal re-renders, integrates with Zod validation, 8.6KB gzipped, uncontrolled component pattern |
| **@hookform/resolvers** | Latest | Connect Zod validation to React Hook Form | Simplifies validation error handling |

### Shopping Cart State

| Technology | Version | Purpose | Why Recommended |
|------------|---------|---------|-----------------|
| **Zustand** | 4.x | Client-side state management for cart | Lightweight (1KB), avoids Context API performance pitfalls, no boilerplate, persistence to localStorage |
| **next-secure-headers** | Optional | Secure cart state in browser storage | If storing sensitive cart data (item counts, prices) |

### Email & Transactional Communications

| Technology | Version | Purpose | Why Recommended |
|------------|---------|---------|-----------------|
| **Resend** | Latest | Transactional email API | Free tier generous, works with Server Actions, integrates with React Email templates |
| **React Email** | Latest | Build email templates with React components | Write emails as JSX, type-safe, reusable components, integrates with Resend |

### UI Components & Forms

| Technology | Version | Purpose | Why Recommended |
|------------|---------|---------|-----------------|
| **ShadCN UI** | Latest | Pre-built, copy-paste UI components | Field component (2025) handles form labels, errors, ARIA attributes; works with React Hook Form |
| **Radix UI** | Latest | Accessible component primitives | Underlying foundation for ShadCN, fully accessible for cart, modals, dropdowns |

### Image & Asset Optimization

| Technology | Version | Purpose | Why Recommended |
|------------|---------|---------|-----------------|
| **Next.js Image** | Built-in | Automatic image optimization | WebP conversion, responsive sizing, blur placeholders for product images |
| **next/font** | Built-in | Google Fonts optimization | Prevents layout shift (CLS), improves Core Web Vitals |

### Data Querying & Caching

| Technology | Version | Purpose | Why Recommended |
|------------|---------|---------|-----------------|
| **use cache** directive | Next.js 15 built-in | Cache expensive operations (product fetches) | Part of Cache Components model, replaces old `revalidate` config, per-component granularity |
| **DatoCMS webhooks** | Latest API | Revalidate product cache on CMS updates | Trigger `revalidateTag()` when products updated, ensures fresh content without full rebuilds |

### Development & Build

| Technology | Version | Purpose | Why Recommended |
|------------|---------|---------|-----------------|
| **pnpm** | Latest | Package manager (already in use) | Faster, uses symlinks, better disk efficiency than npm |
| **Turbopack** | Built into Next.js 15 | Default bundler | 10x faster builds than Webpack, part of Next.js 15 |
| **Vercel** | Hosting platform | Deploy Next.js apps | First-class support for Next.js features, edge caching, ISR, webhooks integration with DatoCMS |

### SEO & Analytics

| Technology | Version | Purpose | Why Recommended |
|------------|---------|---------|-----------------|
| **next/seo (via next-seo)** | Latest OR use built-in metadata | Manage metadata for product pages | generateMetadata API in App Router, Open Graph for social sharing |
| **Google Analytics / GTM** | Latest | Analytics tracking (already in use) | Existing integration, can be maintained as-is |

---

## Supporting Libraries

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| **next-safe-action** | Latest | Wrapper around Server Actions with better TypeScript & error handling | If you want type-safe Server Action calls on the client |
| **swr** OR **TanStack Query** | 5.90.x (Query) | Data fetching & caching | Only if doing real-time cart syncing with backend; NOT needed for simple ISR shops |
| **clsx** / **classnames** | 2.x | Conditional CSS class management | Cleaner than ternaries in JSX, minimal size |
| **react-markdown** | Latest | Render product descriptions from markdown | If DatoCMS stores descriptions as markdown |

---

## Installation Command

```bash
# Core dependencies (already should be installed)
pnpm add next@15 react@19 typescript tailwindcss

# Form handling & validation
pnpm add zod react-hook-form @hookform/resolvers

# UI components
pnpm add zustand clsx

# Email (if sending order confirmations)
pnpm add resend react-email

# Development dependencies
pnpm add -D @types/node @types/react shadcn-ui typescript-eslint

# Optional: For server action type safety
pnpm add next-safe-action
```

---

## Alternatives Considered

| Recommended | Alternative | When to Use Alternative |
|-------------|-------------|-------------------------|
| **Server Actions** | API Routes (`/app/api/...`) | If you need REST endpoints for external integrations (rare for solo shops) |
| **Zod** | Valibot, Yup, io-ts | Valibot if bundle size is critical (<1KB); Yup if familiar from React world |
| **Zustand** | Redux Toolkit, Jotai, TanStack store | Redux if massive team state management needed; Jotai if atom-based granularity preferred |
| **React Hook Form** | Formik, TanStack Form | Formik is older but stable; TanStack Form if headless form control needed |
| **DatoCMS** | Contentful, Strapi, Sanity | Contentful for more enterprise CMS; Strapi for self-hosted; Sanity for structured content |
| **ShadCN UI** | Material-UI, HeadlessUI, shadcn alternatives | Material-UI if corporate design required; HeadlessUI if minimal styling preferred |
| **Resend** | Mailgun, SendGrid, AWS SES | SendGrid for higher volume; Mailgun for lower-level control; SES if already using AWS |

---

## What NOT to Use

| Avoid | Why | Use Instead |
|-------|-----|-------------|
| **Redux** | Over-engineered for small shops, boilerplate heavy, overkill for cart state | Zustand — 1KB, no middleware, just stores |
| **Prisma ORM** | Not needed; no complex database queries for <20 product catalog | Direct DatoCMS GraphQL or simple supabase queries if needed |
| **Next.js Pages Router** | Legacy, being phased out, misses Server Components benefits | App Router — all new projects should use `/app` directory |
| **Partial Prerendering (PPR)** | Experimental, not production-ready, causes DX issues on large codebases | Use ISR + `use cache` instead — proven stable |
| **Context API alone for cart** | Re-renders entire component tree on any state change, performance issues | Zustand — subscription model, granular updates |
| **Stripe integration** | Out of scope (meetup-based fulfillment), unnecessary complexity | Keep order form → email → manual fulfillment pipeline |
| **Serverless database** (Neon, Supabase for products) | Unnecessary — products in DatoCMS, don't duplicate in DB | Use DatoCMS as single source of truth |

---

## Stack Patterns by Use Case

### Pattern 1: Product Page (Static + ISR)

**Scenario:** Catalog with <20 products, prices/availability change occasionally

```typescript
// app/products/[slug]/page.tsx
import { cacheLife } from 'next/cache'

export default async function ProductPage({ params }) {
  'use cache'
  cacheLife('hours') // Revalidate every hour

  const product = await fetchProductFromDatoCMS(params.slug)
  return <ProductDetail product={product} />
}
```

**Why:** `use cache` replaces old `revalidate` config. Faster than ISR alone because it's prerendered at build time, then revalidated incrementally. DatoCMS webhooks can trigger `revalidateTag('products')` for on-demand updates.

---

### Pattern 2: Shopping Cart (Client-Side State)

**Scenario:** Add-to-cart, cart total, persist across sessions

```typescript
// lib/cart-store.ts
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type CartItem = { productId: string; quantity: number }

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      addItem: (item: CartItem) => set((state) => ({
        items: [...state.items, item],
      })),
      clearCart: () => set({ items: [] }),
    }),
    { name: 'cart-storage' }
  )
)
```

**Why:** No backend cart needed. Zustand persists to localStorage automatically. Avoids database round-trips for simple cart UI.

---

### Pattern 3: Order Form (Server Actions + Zod)

**Scenario:** Submit name, email, selected items, get confirmation

```typescript
// app/checkout/actions.ts
'use server'

import { z } from 'zod'
import { resend } from '@/lib/resend'

const orderSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  items: z.array(z.object({ productId: z.string(), quantity: z.number() })),
})

export async function submitOrder(formData: FormData) {
  const validatedOrder = orderSchema.safeParse(Object.fromEntries(formData))

  if (!validatedOrder.success) {
    return { error: validatedOrder.error.flatten().fieldErrors }
  }

  // Send confirmation email
  await resend.emails.send({
    from: 'shop@centimentalcomics.com',
    to: validatedOrder.data.email,
    react: <OrderConfirmation order={validatedOrder.data} />,
  })

  return { success: true }
}
```

**Why:** Server Actions ensure form submissions never expose your validation logic. Zod validates server-side (user can't bypass). Resend sends emails asynchronously without blocking form response.

---

### Pattern 4: DatoCMS Product Fetching

**Scenario:** Query products from headless CMS

```typescript
// lib/datocms.ts
const DATOCMS_API_URL = 'https://graphql.datocms.com'

export async function fetchProducts() {
  const query = `
    query {
      allProducts {
        id
        slug
        title
        price
        image { url }
      }
    }
  `

  const res = await fetch(DATOCMS_API_URL, {
    method: 'POST',
    body: JSON.stringify({ query }),
    headers: { Authorization: `Bearer ${process.env.DATOCMS_API_TOKEN}` },
  })

  return res.json()
}
```

**Why:** GraphQL is efficient, only fetches fields you need. Pair with `use cache` in Server Components to cache the query result and revalidate via DatoCMS webhooks.

---

## Production Setup Checklist

### Pre-Launch

- [ ] Environment variables set: `DATOCMS_API_TOKEN`, `RESEND_API_KEY`
- [ ] `use cache` integrated for product pages (not experimental PPR)
- [ ] DatoCMS webhooks configured to trigger `revalidateTag()` on product updates
- [ ] Order form tested with real email submission to Resend
- [ ] Images optimized in DatoCMS (use Next.js `Image` component)
- [ ] SEO metadata (title, OG image) set for product pages via `generateMetadata()`
- [ ] Vercel deployment connected, automatic deployments on main branch

### Post-Launch

- [ ] Monitor Core Web Vitals (LCP, INP, CLS) via Vercel Analytics
- [ ] Set up error tracking (Sentry) for form failures
- [ ] Track order submissions (Google Analytics or Resend webhook)
- [ ] Backup process for DatoCMS (automatic via DatoCMS)

---

## Version Compatibility Matrix

| Package | Version | Compatibility Notes |
|---------|---------|-------------------|
| Next.js | 15.x | Requires Node.js 18.18+ |
| React | 19.x | Bundled with Next.js 15, required for Server Components |
| Zod | 4.3.x | No breaking changes from 3.x, can upgrade safely; v4 has major perf improvements |
| React Hook Form | 7.71.x | Stable; v8 in beta with improved Next.js 16 Server Actions support (future upgrade) |
| Zustand | 4.x | Compatible with React 18+, no breaking changes from 3.x |
| Resend | Latest | Works with all Node.js versions Next.js supports |
| ShadCN UI | Latest | Uses Radix UI primitives, compatible with Tailwind 4 |
| Tailwind CSS | 4.x | Breaking changes from 3.x; check migration guide if upgrading |

---

## What This Stack DOES Well

✅ **Performance:** Server Components reduce client JS, ISR + caching deliver instant product pages
✅ **DX:** Server Actions eliminate API route boilerplate, TypeScript-first validation with Zod
✅ **Small bundle:** Zustand (1KB), React Hook Form (8.6KB), minimal CSS with Tailwind
✅ **SEO:** Static product pages with Open Graph, automatic Next.js image optimization
✅ **Meetup fulfillment:** Simple order form → email pipeline, no payment gateway complexity
✅ **CMS flexibility:** DatoCMS webhooks enable on-demand cache invalidation

---

## What This Stack DOESN'T Do

❌ Payment processing (out of scope — use Stripe/Square when needed)
❌ User accounts (public shop, no auth required)
❌ Inventory tracking (product availability managed in DatoCMS)
❌ Admin panel (products edited in DatoCMS directly)
❌ Real-time collaboration (not a team tool)

---

## Sources

**Official Documentation:**
- [Next.js Docs: App Router](https://nextjs.org/docs/app) — Confirmed App Router is standard for new projects
- [Next.js 15 Cache Components (Partial Prerendering)](https://nextjs.org/docs/15/app/getting-started/partial-prerendering) — Verified PPR is experimental, recommended ISR + `use cache` instead
- [Next.js Docs: Forms & Server Actions](https://nextjs.org/docs/app/guides/forms) — Validated form handling patterns
- [Zod Documentation](https://zod.dev/) — Confirmed Zod v4 released with 14x performance improvements
- [React Hook Form Releases](https://github.com/react-hook-form/react-hook-form/releases) — v7.71.1 latest stable, v8 in beta
- [Zustand GitHub](https://github.com/pmndrs/zustand) — Confirmed as lightweight alternative to Redux/Context
- [DatoCMS + Next.js Integration](https://www.datocms.com/docs/next-js) — Official integration guide and starter kit
- [Resend Docs: Next.js](https://resend.com/docs/send-with-nextjs) — Works with Server Actions

**Research Articles (2025):**
- [React & Next.js in 2025 - Modern Best Practices](https://strapi.io/blog/react-and-nextjs-in-2025-modern-best-practices) — Confirmed SSG, ISR, streaming as standards
- [Next.js 15 Best Practices 2025](https://www.raftlabs.com/blog/building-with-next-js-best-practices-and-benefits-for-performance-first-teams/) — Confirmed App Router, Server Components, ISR patterns
- [Shopping Cart Implementation: Zustand vs Redux](https://medium.com/@rigal9979/why-zustand-is-gaining-popularity-for-state-management-in-2025-4e19483c0c6e) — Verified Zustand adoption trend
- [Form Handling in 2025](https://www.deepintodev.com/blog/form-handling-in-nextjs) — Confirmed Server Actions + Zod as standard pattern

---

**Stack Research Confidence Breakdown:**

| Category | Confidence | Reason |
|----------|-----------|--------|
| Core (Next.js, React, TS, Tailwind) | HIGH | Official docs, v15 stable since 2024 |
| Form Handling (Server Actions, Zod) | HIGH | Official Next.js docs, Zod v4 stable |
| Cart State (Zustand) | HIGH | Production usage confirmed, v4 stable |
| DatoCMS Integration | HIGH | Official DatoCMS starter kit available |
| Email (Resend + React Email) | HIGH | Official docs, free tier sufficient for shop |
| ShadCN UI (2025 updates) | MEDIUM-HIGH | 2025 changelog confirmed Field component, but ecosystem still evolving |
| ISR + `use cache` instead of PPR | HIGH | Official docs clear PPR is experimental |

---

**Last Updated:** 2026-02-20
**Researched for:** Centimentalcomics shop rebuild (Next.js 15 + DatoCMS)
