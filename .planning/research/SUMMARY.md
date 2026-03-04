# Project Research Summary

**Project:** Centimentalcomics Indie E-Commerce Shop Rebuild
**Domain:** Small e-commerce shop (educational zines, apparel, stationery, pins) with meetup-based fulfillment
**Researched:** 2026-02-20
**Confidence:** HIGH

---

## Executive Summary

Centimentalcomics is rebuilding its shop as a modern Next.js 15 headless e-commerce platform optimized for a small product catalog (<20 items) with no payment processing and meetup-based order fulfillment. This is fundamentally different from traditional e-commerce: the shop's job is to showcase educational products, capture customer intent (name, email, items), and facilitate in-person meetings—not to process payments or manage inventory. The recommended stack prioritizes developer experience and performance over enterprise features: Next.js 15 App Router with Server Components for static product pages, DatoCMS as the product catalog CMS, Zustand for lightweight cart state, Server Actions for order form handling, and Resend for transactional emails.

The critical success factor is keeping architecture simple. Over-engineering is the primary risk: teams often implement patterns designed for 10k+ product catalogs (Supabase, Redux, ISR revalidation logic, payment gateways) which adds 4+ weeks of unnecessary overhead. This project benefits from static site generation (build once per deployment, cache forever), simple localStorage cart persistence, and no backend inventory tracking. Following this simplified approach, the shop can launch with core functionality in 2-3 phases and be production-ready within reasonable timelines.

Key risks center on data management: fetch caching misconceptions can result in stale product prices being displayed; cart state loss between page navigations causes trust erosion; SEO slug changes during rebuild can cause 40-60% organic traffic loss if redirects aren't implemented carefully. These are all preventable with explicit policies established upfront and tested in production-like environments before launch.

---

## Key Findings

### Recommended Stack

**Next.js 15 App Router with Server Components** is the foundation. React 19 with TypeScript ensures type safety across forms, API handling, and component boundaries. Tailwind CSS 4 provides small bundle size and matches the zine aesthetic. DatoCMS (already integrated) serves as the single source of truth for product catalog, with GraphQL API for efficient querying. Product pages use static generation with `generateStaticParams()` + on-demand revalidation via DatoCMS webhooks—not Partial Prerendering (PPR), which remains experimental and is not recommended for production.

**Core technologies:**
- **Next.js 15 + React 19:** App Router with Server Components, ISR support, built-in image optimization
- **TypeScript 5:** Type safety for form validation, API routes, and component props
- **Tailwind CSS 4:** Small bundle, matches playful zine brand aesthetic, JIT compilation
- **DatoCMS GraphQL API:** Headless CMS with webhook support for real-time cache invalidation
- **Server Actions + Zod:** Form handling without API routes; Zod for schema validation with 14x performance improvements in v4
- **Zustand 4:** Client-side cart state (1KB footprint), localStorage persistence, no boilerplate
- **React Hook Form 7.7:** Minimal re-renders, integrates with Zod, uncontrolled component pattern
- **ShadCN UI + Radix UI:** Pre-built accessible components; Field component handles form labels/errors
- **Resend + React Email:** Transactional emails (order confirmations) with free tier sufficient for small shop
- **Vercel:** Hosting with first-class Next.js support, edge caching, automatic ISR handling

**Critical non-recommendations:**
- Avoid Redux (overkill for cart), Prisma ORM (unnecessary; DatoCMS + simple storage), Pages Router (legacy), Partial Prerendering (experimental), Stripe (out of scope for meetup model), or Serverless databases (DatoCMS is single source of truth).

---

### Expected Features

**Must-have for launch (P1 — Table Stakes):**
All table-stake features are required for a functional shop; missing any = product feels incomplete. Implement cart persistence and mobile responsiveness first; they enable everything else.

| Feature | Why Critical |
|---------|-------------|
| **Product Catalog with Images** | Users must see products to buy them; multi-angle images crucial for zines/apparel |
| **Category Browsing** | Users need to filter by product type (Zines, Apparel, Stationery, Pins) |
| **Product Detail Pages** | Price, description, availability, size/color variants must be visible |
| **Shopping Cart** | Standard requirement; users expect to review items before checkout |
| **Checkout Form** | Order submission (name, email, phone, items, meetup details) — no payment processing |
| **Mobile Responsiveness** | 60%+ of e-commerce traffic is mobile; missing this = 85% cart abandonment on phone |
| **Product Availability Status** | "In Stock" / "Out of Stock" / "Pre-order" badges prevent wasted checkout attempts |
| **About Page** | Establishes mission, builds trust, aligns with educational positioning (low cost, high impact) |
| **FAQ** | 77% of customers prefer self-service; comprehensive FAQ (fulfillment, delivery, returns) prevents support overload |
| **Clear Navigation** | Breadcrumbs and category links enable users to understand product universe instantly |

**Should-have for v1.x (P2 — Competitive Advantage):**
These differentiators set Centimentalcomics apart from generic merch stores. Implement after core shop validates.

| Feature | Value | When to Add |
|---------|-------|------------|
| **Playful, Whimsical Design** | Hand-drawn illustrations, micro-interactions, zine aesthetic = brand trust with creative communities | Phase 1 (low cost, high impact) |
| **Product Learning Content** | Sample zine pages, learning objectives, CS concepts tie products to educational mission | Phase 2 (requires content curation) |
| **Event/Meetup Promotion** | Calendar, countdown timers, location details create urgency ("order by X for Y meetup") | Phase 2 (directly supports fulfillment model) |
| **Social Proof & Testimonials** | Classroom use cases, educator testimonials | Phase 2 (collect feedback first) |
| **Visual Product Previews** | Lightbox galleries, zine page samples, apparel mockups | Phase 2 (high effort, wait for feedback) |
| **Newsletter for Restocks** | Email notifications when sold-out items restock | Phase 2 (optional, low priority) |

**Explicitly defer (v2+):**
Online payment (out of scope — meetup-based model), user accounts (public shop, no auth needed), inventory tracking (manual in CMS), admin panel (products edited in DatoCMS), multi-language support (low priority unless demand emerges).

---

### Architecture Approach

**Server Components for data fetching + Client Components for interactivity.** Product pages fetch DatoCMS data on the server, pass immutable props to Client Components for "Add to Cart" buttons. This reduces JavaScript bundle, keeps secrets secure, and eliminates hydration issues. Cart state lives in React Context with localStorage persistence; order form uses Server Actions (no API routes needed) validated with Zod.

Project structure uses route groups (`(shop)`, `(marketing)`) to organize without affecting URLs, underscore-prefixed component folders (`_cart`, `_shop`) to colocate logic without creating routes, and a centralized `lib/datocms.ts` for all API calls. This prevents view/data coupling and enables easy schema changes.

**Major components & boundaries:**
1. **Server Components (Product Pages, Layouts):** Fetch from DatoCMS, render HTML, pass data to Client children
2. **Client Components (Cart, Forms):** Handle interactivity, form state, localStorage persistence
3. **Server Actions (Order Submission):** Validate form data, save orders, send emails—all server-side with CSRF protection built-in
4. **Cart Context (useCart hook):** Shared state across cart drawer, buttons, checkout form; persists to localStorage
5. **DatoCMS GraphQL client:** Centralized data fetching with revalidation via webhooks

**Data flow:**
- Product browsing: User navigates → Server fetches products → Renders static HTML from ISR cache
- Adding to cart: User clicks button → Client dispatches to Context → localStorage updated → UI reflects change
- Checkout: User fills form → Submit button triggers Server Action → Validation on server → Email sent + order stored → Response returned to client → Cart cleared

**Build order priorities:**
1. Layout + Navigation (unblocks everything)
2. Product fetch + list page (data foundation)
3. Product detail page (validates static generation)
4. Cart Context + Add to Cart (core feature)
5. Order form + Server Action (checkout flow)
6. Cart Drawer (polish)
7. Category pages (nice-to-have)
8. About + FAQ (marketing content)
9. ISR webhook (final infrastructure)

---

### Critical Pitfalls

**1. Silent fetch caching = stale product data displayed.** Next.js App Router caches fetch requests by default. Product pages display outdated prices, inventory status, or descriptions. DatoCMS also has upstream caching, creating double-caching that masks problems until production. Prevention: use `cache: "no-store"` for all dynamic product data; set `useCdn: false` in DatoCMS client; test in production-like deployment, not local dev. Verify with `curl -I` to check cache headers.

**2. Cart state lost on page refresh.** Customer adds items, navigates away, returns with empty cart. Or cart persists with stale prices. Prevention: implement localStorage persistence upfront; use Zustand with persist middleware; test cart with hard-refresh; avoid hydration mismatches by loading storage only on client mount via `useEffect`. For small catalogs, localStorage is sufficient (don't use Supabase).

**3. SEO ranking loss from URL structure changes.** If product URLs change during rebuild (e.g., `/products/zine-101` → `/shop/zines/101`), Google rankings drop 40-60%. Recovery takes weeks. Prevention: map all old URLs to new slugs before launch; implement 301 redirects in `next.config.js`; preserve category pages; maintain internal linking structure; preserve supporting content (FAQ, guides); add schema.org/Product structured data.

**4. DatoCMS schema drift.** Schema is updated in DatoCMS UI without syncing TypeScript types or GraphQL queries. Queries fail silently or return `null`. Production breaks with "Cannot read property 'X' of undefined." Prevention: establish schema change protocol (pull requests, not UI-only edits); run `pnpm datocms:generate` after every schema change; use `gql.tada` for real-time query validation; store schema changes in Git; test queries in GraphQL playground after schema updates.

**5. Over-engineering for <20 products.** Teams implement patterns designed for 10k+ catalogs: microservices, complex state management (Redux), Supabase for orders, ISR instead of static builds. This adds 4+ weeks overhead. Prevention: use static site generation (build once, cache forever) for fixed product list; use simple localStorage cart; defer Supabase/payment/admin until needed; count lines of code — if cart is >200 LOC, you're over-engineering.

---

## Implications for Roadmap

Research reveals a shop with minimal dependencies and clear feature ordering. The critical path is: product visibility → shopping → checkout → polish. Static generation + simple cart means most of the complexity is in content management (DatoCMS) and display, not backend logic.

### Phase 1: Core Shop Foundation
**Rationale:** Product catalog is the prerequisite for everything. No cart without products; no checkout without items to order. Also requires upfront decisions on fetch caching, URL structure, and DatoCMS schema.

**Delivers:**
- Product list page (all products with category filtering)
- Product detail pages (generated statically via `generateStaticParams`)
- Navigation + About + FAQ pages
- DatoCMS integration validated

**Addresses (Features):**
- Product Catalog with Images
- Category Browsing
- Product Detail Pages
- Product Pricing Transparency
- Clear Navigation
- About Page
- FAQ
- Product Availability Status
- Playful Design aesthetic

**Stack elements:**
- Next.js App Router + Server Components
- DatoCMS GraphQL client
- Static generation (`generateStaticParams` + ISR)
- Tailwind CSS
- ShadCN UI

**Avoids pitfalls:**
- Finalize product URL slugs NOW (prevents SEO loss later)
- Establish fetch caching policy: `cache: "no-store"` for product data
- Set up DatoCMS schema.graphql in Git; document schema change process
- Test static generation locally and in preview deployment

**Research flags:** None — Next.js + DatoCMS integration patterns are well-documented.

---

### Phase 2: Cart System
**Rationale:** Cart state is required before checkout. Also unblocks testing of "Add to Cart" user flow end-to-end.

**Delivers:**
- Cart Context with localStorage persistence
- "Add to Cart" button (Client Component)
- Cart counter in header
- Cart Drawer / modal showing items, quantities, total, remove actions
- Cart persistence across sessions and page navigations

**Uses (Stack elements):**
- React Context API (or Zustand if preferred)
- localStorage with hydration
- Client Components with hooks

**Implements (Architecture):**
- Client-side cart state management
- Context provider wrapping app
- useCart hook for components

**Avoids pitfalls:**
- Use localStorage for persistence; Supabase is overkill for <20 products
- Avoid hydration mismatches: load from storage in `useEffect`, not on initial render
- Test cart with hard-refresh, multiple tabs, mobile
- Store only `{ productId, quantity }` in localStorage; fetch fresh prices on checkout
- Use Zustand (1KB, minimal, with persist middleware) OR plain Context; avoid mixing both

**Research flags:** None — cart state management patterns are standard.

---

### Phase 3: Checkout & Order Form
**Rationale:** Completes the e-commerce flow. Once cart works, order form follows directly.

**Delivers:**
- Checkout page with order form
- Form validation (client-side + server-side)
- Server Action to handle submission
- Order storage (JSON file, database, or email notification)
- Order confirmation email (Resend + React Email)
- Success/error messaging
- Clear call-to-action for meetup fulfillment

**Uses (Stack elements):**
- Server Actions (`'use server'`)
- Zod schema validation
- React Hook Form for client-side state
- Resend API for emails
- ShadCN Field components for form UX

**Implements (Architecture):**
- Server Action: `submitOrder` in `app/actions/order.ts`
- Form Component (Client) with `useActionState`
- Email template with React Email

**Avoids pitfalls:**
- Route Handlers: avoid if possible; use Server Actions directly for simpler code
- If Route Handlers used: set `export const revalidate = 0` for dynamic endpoints
- Validate all cart data server-side; re-fetch prices from DatoCMS, don't trust client cart prices
- Sanitize form inputs; use select dropdowns for options (not free-form text)
- Include CSRF protection (Server Actions handle automatically)
- Test checkout form on mobile; ensure tap targets ≥44px
- Show loading state during form submission; disable submit button to prevent double-submission
- Test order submission with real Resend API; verify email arrives

**Research flags:** None — Server Actions + Zod patterns are canonical in Next.js 15.

---

### Phase 4: Pre-Launch & Polish
**Rationale:** Final validation before public launch. Focus on SEO, performance, and edge cases.

**Delivers:**
- SEO optimization: metadata, OG tags, structured data (schema.org/Product)
- Image optimization: all product images using Next.js `<Image>` component, Lighthouse green
- Redirect mapping: old product URLs (if migrating) → new URLs (301 redirects)
- DatoCMS webhook for ISR revalidation
- 404 error page
- Lighthouse audit: mobile score ≥90, Core Web Vitals passing
- Final security audit: no exposed API keys, input validation, CSRF protection
- Edge case testing: empty cart, out-of-stock product, form validation errors, mobile layout

**Avoids pitfalls:**
- SEO: verify each product page has unique title, meta description <160 chars, OG image, schema.org/Product
- Test redirects with `curl -I`; fix broken redirect chains (301 → 302 → 404)
- Images: use Next.js `<Image>` with `placeholder="blur"`; ensure no layout shift on load
- Test cart edge cases: add same product twice (quantity increments?), remove last item, navigate away and return
- Verify analytics events fire correctly (no duplicates)
- Test dark mode if applicable
- Set up error tracking (Sentry) for production monitoring

**Research flags:**
- **SEO migration:** If migrating from old shop, needs careful redirect audit. Reference PITFALLS.md Pitfall 3.
- **Analytics:** May need custom event schema if migrating from old shop.

---

### Phase 5: Post-Launch Features (v1.x)
**Rationale:** Only after core validation, add differentiators and enhancements.

**Delivers:**
- Product Learning Content (sample pages, CS concepts)
- Event/Meetup Promotion (calendar, countdown timers)
- Enhanced About Page (testimonials, mission expansion)
- Social Proof section (curated customer testimonials)
- Newsletter signup (optional, low priority)

**Why deferred:**
- Requires content curation and customer feedback
- Doesn't block core shop functionality
- Adds polish after validating demand

---

## Phase Ordering Rationale

1. **Phase 1 (Core Shop) comes first** because product visibility is the prerequisite for everything else. Also forces upfront decisions on fetch caching, URL structure, and schema management that would be expensive to change later.

2. **Phase 2 (Cart) before checkout** because adding to cart is the primary user interaction; testing this flow unblocks form design.

3. **Phase 3 (Checkout)** depends on cart working. Also allows time for order storage infrastructure decision (JSON, database, email).

4. **Phase 4 (Pre-Launch)** is final validation, not new features. Catches data staleness bugs, redirect issues, and performance problems before public launch.

5. **Phase 5 (Enhancements)** deferred to v1.x because these are differentiators, not table stakes. Allows feedback loop before investing in content curation.

---

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| **Stack** | HIGH | Official Next.js 15 docs, DatoCMS integration guide, Zod v4 stable, community consensus on App Router patterns |
| **Features** | HIGH | Direct analysis of shop.bubblesort.io, Baymard Institute cart abandonment data, NN/G e-commerce UX guidelines, Centimentalcomics' own goals |
| **Architecture** | HIGH | Next.js App Router patterns well-documented, Server Components + Actions canonical, multiple real-world references |
| **Pitfalls** | HIGH | Vercel blog on App Router mistakes, Next.js GitHub issues, DatoCMS schema versioning guides, production deployment experience documented |
| **Phase structure** | HIGH | Feature dependencies clear from FEATURES.md, build order inferred from ARCHITECTURE.md recommendations |

**Overall confidence: HIGH**

All four research areas have high-confidence sources (official docs, production experience guides, recent 2026 community standards). No major gaps or uncertainties identified.

---

## Gaps to Address

**During Phase 1 Implementation:**
- **DatoCMS data bulk import:** PITFALLS.md notes that DatoCMS migration scripts handle schema, not data. If importing products from Notion/spreadsheet, write custom import script. Test import on staging environment.
- **Product URL finalization:** Confirm slug strategy with stakeholders NOW. Once Phase 1 ships, changing slugs requires redirects. Reference PITFALLS.md Pitfall 3 (SEO loss).

**During Phase 2 Implementation:**
- **Cart persistence edge cases:** Test localStorage behavior on Safari Private mode, in-app browsers, cleared browser data. Some environments block localStorage. Have fallback strategy (session-only cart if localStorage unavailable).

**During Phase 3 Implementation:**
- **Order storage decision:** ARCHITECTURE.md assumes database or email notification. Decide: JSON file + email, Supabase, or external service? This is low-risk decision (can change in v1.x) but clarify early.

**During Phase 4 Pre-Launch:**
- **Redirect audit (if migrating):** Map every old product URL to new slug. Test all redirects in staging. If this is a rebuild from existing shop, needs careful SEO planning.

---

## Sources

### Primary (HIGH confidence)
- **Next.js 15 Official Docs** — App Router, Server Components, Forms & Server Actions, ISR/caching (https://nextjs.org/docs)
- **DatoCMS + Next.js Integration** — Official integration guide, API docs (https://www.datocms.com/docs/next-js)
- **Zod Documentation** — Schema validation, v4 performance improvements (https://zod.dev/)
- **React Hook Form + Zod** — Integration patterns (https://react-hook-form.com/)
- **Zustand** — State management, persistence middleware (https://github.com/pmndrs/zustand)
- **Vercel Blog: Common Mistakes with Next.js App Router** — Fetch caching, Route Handler pitfalls (https://vercel.com/blog)
- **Shop.bubblesort.io** — Direct competitor analysis (https://shop.bubblesort.io/)
- **Baymard Institute: Cart Abandonment Rate Statistics** — Mobile abandonment data (https://baymard.com/)
- **NN/G UX Guidelines** — E-commerce product pages, mobile design (https://www.nngroup.com/)

### Secondary (MEDIUM confidence)
- React Email + Resend integration patterns
- Next.js 15 caching guide (https://nextjs.org/learn/seo/url-structure)
- E-commerce SEO migration best practices (Shopify enterprise blog)
- ISR pitfalls in Next.js 15 (GitHub issues, Reddit discussions)

### Community Standards (HIGH confidence)
- 2026 e-commerce best practices: SSG for fixed catalogs, Zustand/Context for cart, Server Actions for forms
- DatoCMS schema versioning via Git (industry standard)
- Mobile-first design (60%+ of traffic)

---

**Research completed:** 2026-02-20
**Next step:** Roadmap creation using SUMMARY.md as input
**Ready for requirements:** YES
