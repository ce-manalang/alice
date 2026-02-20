# Domain Pitfalls: Next.js 15 E-Commerce Shop Rebuild

**Domain:** Next.js 15 e-commerce shop rebuild (DatoCMS + small catalog + meetup fulfillment)
**Researched:** 2026-02-20
**Confidence:** HIGH (multiple official sources, recent 2026 guidance, direct Next.js/DatoCMS documentation)

---

## Critical Pitfalls

### Pitfall 1: Silent Data Staleness from Fetch Caching in App Router

**What goes wrong:**
Product pages display outdated prices, inventory status, or descriptions because fetched data is cached when it shouldn't be. Customers see information that was rendered at build time or previous deployment, leading to wrong purchase decisions or broken product descriptions.

**Why it happens:**
Next.js App Router caches `fetch` requests by default (unless explicitly disabled). Developers migrating from Pages Router assume all requests are fresh, or they don't realize ISR + fetch caching interact unexpectedly. When data source caching is also enabled upstream (e.g., DatoCMS fetch with `useCdn: true`), double-caching masks the problem until deployment.

**How to avoid:**
- Use `cache: "no-store"` for all dynamic product/inventory data: `fetch(url, { cache: "no-store" })`
- Disable upstream CDN caching in DatoCMS when pulling product data: `useCdn: false` in the client
- Never rely on static generation for product data that changes (prices, availability)
- Use `revalidatePath()` or `revalidateTag()` immediately after any data mutation (cart submission, product updates)
- Test in production-like deployment; local dev server hides caching issues

**Warning signs:**
- Product page shows old data after updates in DatoCMS
- Price changes or new product descriptions don't appear for hours
- Manual Vercel rebuild fixes the problem temporarily
- Team reports "works locally, broken on production"

**Phase to address:**
Phase 1 (Core Shop) — Establish fetch caching strategy before building product pages. Document every API call with its cache policy.

---

### Pitfall 2: Cart State Lost Across Page Navigation

**What goes wrong:**
Customer adds items to cart, navigates away (e.g., to product details), returns to homepage, and cart is empty. Trust erodes quickly. Or cart persists but shows stale prices/availability from old session.

**Why it happens:**
Team stores cart in `useState` without persistence, or uses context without localStorage. Next.js App Router doesn't auto-persist client state between navigations. If persistence is added later with localStorage, hydration mismatches occur (server renders empty cart, client hydrates with saved data, UI flickers). With external sources (Supabase), teams forget to sync client state with server on component mount.

**How to avoid:**
- Choose persistence strategy upfront: localStorage (simplest, <5MB limit) or IndexedDB (if cart grows complex)
- Implement state hydration correctly: use `useEffect` to load from storage only on client, after mount. Avoid hydration mismatches.
- For small catalogs with <20 products, localStorage is sufficient; avoid Supabase overhead
- Use Zustand or similar minimal state library with built-in persistence middleware (`persist` plugin)
- Test cart flow: add item, hard-refresh page, verify cart still present with correct quantity/price
- Never store prices in cart—fetch fresh on checkout from product database

**Warning signs:**
- Console errors: "text content does not match server-rendered HTML" (hydration mismatch)
- Cart empties on refresh or navigation
- Cart shows old prices that don't match current product data
- localStorage/IndexedDB grows unbounded over time (no cleanup strategy)

**Phase to address:**
Phase 2 (Cart System) — Implement and test persistence layer before shipping. Hydration issues surface only after deployment.

---

### Pitfall 3: SEO Ranking Loss from URL/Slug Changes During Rebuild

**What goes wrong:**
Shop is rebuilt with a new URL structure (e.g., `/products/zine-101` becomes `/shop/zines/101`). Google's rankings for old product pages drop 40-60%. Even with 301 redirects, AI search systems take weeks to reassess link graphs, internal authority distribution, and topical relationships. In the meantime, organic traffic and conversions tank.

**Why it happens:**
Teams focus on feature completeness during rebuild and treat SEO as an afterthought. Product slug changes seem minor. Redirects are added but internal linking structure is flattened or reorganized ("we'll clean this up later"). Category pages disappear. Supporting content (FAQs, guides) is dropped because they generate low direct traffic—but they provide topical authority that validates the main product pages.

**How to avoid:**
- Map every old product URL to new slug before rebuild; maintain 1:1 relationship where possible
- Keep category structure unchanged; categories are often high-traffic commercial keywords
- Implement 301 redirects in `next.config.js` redirects array for ALL old URLs
- Preserve all supporting content (FAQ, about, guides); they reinforce topical authority
- Audit internal linking: ensure product detail pages link to related products, categories link up/down hierarchically
- Test redirect chains; broken redirects (→ → →) are flagged by search engines instantly in 2026
- Stage rebuild on separate domain/environment; use GSC (Google Search Console) staging verification to dry-run indexing
- Add structured data (schema.org/Product) to all product pages; helps search systems remap content

**Warning signs:**
- Google Search Console shows 404s for old product URLs
- Organic traffic drops post-launch, particularly for product category pages
- "Discover" traffic vanishes (weak topical authority signals)
- Redirect chain broken (301 → 302 → 404)

**Phase to address:**
Phase 1 (Core Shop) — Finalize URL structure before building. Phase 3 (Pre-Launch) — audit all redirects and internal links before going live.

---

### Pitfall 4: DatoCMS Integration Schema Drift and Outdated Queries

**What goes wrong:**
DatoCMS schema is updated (field renamed, new field added, field deprecated) but Next.js app still uses old query. GraphQL queries fail silently or return `null` for missing fields. Product pages break with "Cannot read property 'title' of undefined." Multiple developers edit schema in DatoCMS UI without updating TypeScript types or coordinating with backend.

**Why it happens:**
DatoCMS offers convenient UI-based schema editing, which is great for content editors but dangerous when developers don't sync changes. The generated `schema.graphql` file (used by `gql.tada`) falls out of sync. TypeScript types become unreliable. Small teams don't have a schema versioning/review process.

**How to avoid:**
- Establish schema change protocol: schema updates must be pull requests, not UI-only edits
- Always run `pnpm datocms:generate` (or equivalent) after any DatoCMS schema change to update `schema.graphql`
- Use `gql.tada` for GraphQL queries to get real-time type checking; it will error if query doesn't match current schema
- Don't hand-write TypeScript interfaces; generate them from schema
- Store DatoCMS schema changes in Git; use DatoCMS environment branching (dev/staging/prod)
- Add `schema.graphql` to version control; reviewers can see what schema changed
- Test product page queries in both DatoCMS GraphQL playground AND in deployed app after schema changes

**Warning signs:**
- "Cannot read property 'X' of undefined" errors on product pages
- GraphQL errors like "Cannot query field 'oldFieldName'" in logs
- `schema.graphql` is out of date compared to DatoCMS actual schema
- Schema changes work in UI but break deployed app
- Multiple developers editing schema without communication

**Phase to address:**
Phase 0 (Setup) — configure DatoCMS schema generation in build process. Phase 1 (Core Shop) — document schema change process before first content editor touches CMS.

---

### Pitfall 5: Route Handler Caching Hides Stale Data in Checkout Flow

**What goes wrong:**
Build a Route Handler (API route) to fetch product data for checkout: `GET /api/products/123`. It works locally. In production, Route Handlers are cached by default in App Router. Customer sees stale product price or availability. If cart submission submits to another Route Handler, the `POST` isn't cached (good), but the product fetch for verification WAS cached (bad). Inventory oversells or prices charge incorrectly.

**Why it happens:**
Developers assume Route Handlers behave like Pages Router API routes (no caching). Next.js 15 changed this: GET requests are cached by default unless `revalidate` is set. Teams don't realize caching applies even to dynamic endpoints. No explicit `cache` policy is set.

**How to avoid:**
- Never use Route Handlers for dynamic data without explicit caching strategy
- Set `export const revalidate = 0` (no caching) for any endpoint that serves real-time data (inventory, pricing, cart validation)
- Or use `fetch(..., { cache: "no-store" })` inside the handler
- For truly dynamic endpoints, consider not using Route Handlers at all; call server actions directly from components
- Test every Route Handler in production: verify cache headers with `curl -i` and check response timestamps
- Document cache policy in code: `// Cache disabled: inventory is real-time` near the handler

**Warning signs:**
- Checkout page shows outdated product price
- Inventory doesn't decrement properly on order submission
- Manual cache clear in Vercel fixes intermittent checkout failures
- Route Handler returns same response for repeated calls over time

**Phase to address:**
Phase 2 (Cart System) → Phase 3 (Checkout) — validate all Route Handlers have explicit cache policies before shipping.

---

### Pitfall 6: Over-Engineering for a Small Catalog (Unnecessary Complexity)

**What goes wrong:**
Team implements advanced patterns designed for 10k+ product catalogs: microservices, headless architecture with separate payment gateway, complex state management (Redux + sagas), server-driven UI, or image optimization frameworks. With <20 products, this adds 4+ weeks of overhead. Simple features take 10x longer. Maintenance burden explodes. Small team burns out.

**Why it happens:**
Developers follow "best practices" from large e-commerce case studies (built for scale) or cargo-cult copying from bigger codebases. Supabase is set up "for future expansion" but barely used. Zustand + Redux + Context all in one app. ISR is implemented when static build is simpler. Every endpoint is a Route Handler "for API consistency" instead of direct server actions.

**How to avoid:**
- Right-size architecture to 20 products: static HTML build per product, simple localStorage cart, Vercel serverless functions only if needed
- Explicitly defer: payment gateways, user accounts, inventory sync, email notifications (all v2)
- Use SSG (static site generation) for product catalog: build once per deployment, cache forever
- Cart state: localStorage + Zustand or plain context; Supabase is overkill
- Image optimization: Next.js `<Image>` component is sufficient; don't build custom optimization
- Use DatoCMS drafts/publish flow instead of building approval workflows in app
- Single rendering strategy (SSG) beats ISR complexity for fixed product list
- Count LOC (lines of code): if cart implementation is >200 lines, you're over-engineering

**Warning signs:**
- Product pages take 3 weeks to ship because of architecture design
- Zustand, Redux, and Context are all used in same feature
- Supabase connection exists but unused for checkout
- ISR revalidate logic is more complex than product data itself
- Team debates "should we use a headless architecture?" for 15 products

**Phase to address:**
Phase 0 (Setup) → Phase 1 (Core Shop) — decide architecture early. Smaller = faster. Phase 3 (Pre-Launch) — audit codebase; delete unused abstractions.

---

## Technical Debt Patterns

| Shortcut | Immediate Benefit | Long-term Cost | When Acceptable |
|----------|-------------------|----------------|-----------------|
| **Storing prices in cart instead of fetching fresh** | Faster checkout, no server calls | Charges wrong price if product changes, oversells | Never — prices must be real-time |
| **No redirect mapping from old URLs** | Saves time, "we'll add redirects later" | 40-60% organic traffic loss, weeks to recover | Never — do redirects before launch |
| **Disable DatoCMS schema versioning** | Editors can freely modify schema | Type errors, silent bugs, schema drift | Never — enforce schema reviews |
| **Use ISR instead of static build for small catalog** | Handles future growth, "more flexible" | Complexity, revalidation bugs, stale data risk | Only if catalog is 100+ products and changes hourly |
| **Supabase for checkout/orders** | "Future-proof", team familiar with it | Overkill for meetup-only fulfillment, unnecessary ops burden | When actual online payments or user accounts needed (v2+) |
| **localStorage without versioning/cleanup** | Cart works immediately | Storage bloat, migration headaches, stale data | Only acceptable if you commit to versioning strategy now |
| **Hand-written TypeScript types for DatoCMS queries** | No generation tool setup | Types drift from schema, bugs in production | Never — use gql.tada or similar |
| **No 404 error page** | "We'll add it later" | Search engines confused, poor UX, no error tracking | Never — design 404 page early |

---

## Integration Gotchas

| Integration | Common Mistake | Correct Approach |
|-------------|----------------|------------------|
| **DatoCMS → Next.js** | Schema changes in UI without syncing `schema.graphql` or TypeScript types | Run `pnpm datocms:generate` after every schema change. Test queries in GraphQL playground. Use gql.tada for type safety. |
| **Product data (Notion/spreadsheet → DatoCMS)** | Assume DatoCMS migration scripts handle content. Only handle schema changes. | Write custom script to bulk-import products from spreadsheet. DatoCMS scripts only handle schema, not data. Migrate once, carefully. |
| **Fetch requests → DatoCMS API** | Enable upstream caching (`useCdn: true`). Double-caching with App Router fetch caching hides changes. | Use `useCdn: false` in DatoCMS client. Use `cache: "no-store"` or `revalidate: 0` in fetch. |
| **Cart state → localStorage/IndexedDB** | Assume state syncs automatically across tabs. Store sensitive data (prices, user ID). | Use explicit sync mechanism. Only store IDs and quantities. Fetch fresh prices on checkout. Use Safari Private window testing. |
| **Google Analytics / GTM** | Migrate tracking without updating event names. Old reports break. | Re-implement tracking in new app with NEW event names. Archive old reports. Don't reuse old event names. Version your event schema. |
| **Vercel deployment** | Assume production caching works like dev server. Test only locally. | Test in preview deployment. Check response headers: `Cache-Control`, `x-vercel-cache`. Verify ISR revalidation works post-deploy. |

---

## Performance Traps

| Trap | Symptoms | Prevention | When It Breaks |
|------|----------|------------|----------------|
| **Image optimization missing** | Product images load slowly, layout shifts, no lazy loading | Use Next.js `<Image>` component for all product photos. Set `placeholder="blur"` for LCP. | Immediately visible; impacts LCP (Core Web Vitals). Even 20 products matter if images are unoptimized. |
| **Cart re-renders on every keystroke** | Typing in quantity field is laggy. Cart icon updates slowly. | Memoize cart components. Debounce quantity changes. Use Zustand instead of context for cart state. | Noticeable at ~3+ items. Small catalog means fewer components, but bad patterns still hurt UX. |
| **Fetching full product list on every page load** | Each page load requires HTTP request. No caching. | Build static catalog at deploy time. Use `generateStaticParams` if using dynamic routes. Cache product list server-side for 24h if dynamic. | Becomes obvious at 10+ daily users. Vercel logs show repeated requests. |
| **ISR revalidation too aggressive** | Vercel shows "Function execution timeout" or "Build requests exceed tier". Cost spikes. | For <20 products: use SSG (no revalidation needed). If ISR: set `revalidate: 3600` (1 hour minimum). Profile revalidation cost. | Happens silently. Vercel bill spikes. Performance dashboard shows > rebuild time than code change time. |
| **No image CDN for DatoCMS images** | DatoCMS serves images directly. Every product page loads all images. No resizing. | Use DatoCMS image API: `?w=400&h=300&fit=crop`. Or use Next.js `<Image>` component pointing to DatoCMS CDN URL. | Page load time 3-5 seconds for 3-4 product pages. Mobile users most impacted. |

---

## Security Mistakes

| Mistake | Risk | Prevention |
|---------|------|------------|
| **Storing user info or payment data in localStorage** | If browser is compromised, attacker gets customer names, emails, addresses, or worse. | Never persist PII to client storage. Collect contact info only at checkout, submit immediately to backend. Use secure HTTPOnly cookies if auth needed. |
| **Exposing DatoCMS API key in client-side code** | Attacker can read/modify all content. Entire product catalog becomes editable. | DatoCMS keys belong only in `env.local` (server-side). Use GraphQL Proxy or API route wrapper to hide keys. Rotate keys after rebuild. |
| **No validation on cart quantity/prices** | Attacker sends cart with 0 price or negative quantity. Fulfillment gets invalid order. | Validate all cart data server-side. Re-fetch prices from DatoCMS on checkout, not from client. Check quantity > 0. |
| **Order form accepts any data without sanitization** | XSS attacks via order form. Malicious script stored in order notes. | Sanitize all form inputs. Use libraries like `xss` or `DOMPurify` if storing user content. Don't render order data without escaping. Better: don't accept free-form text, use select/radio for options. |
| **No CSRF protection on checkout form** | Attacker crafts fake form, redirects customer to submit order with wrong contact info. | Add CSRF tokens to form. Next.js Server Actions handle CSRF automatically. If using Route Handlers, check `Content-Type` header, validate origin. |

---

## UX Pitfalls

| Pitfall | User Impact | Better Approach |
|---------|-------------|-----------------|
| **Cart counter not updating when item added** | User adds item, sees no feedback. Thinks add didn't work. Adds again. Double order. | Update cart counter immediately (optimistic UI). Show toast/notification "Added to cart". Cart icon badge increments visibly. |
| **Broken product image fallback** | Product page shows broken image. No alt text. Accessibility broken. | Provide `alt` text for all images. Fallback placeholder for failed image loads. Test images are accessible via keyboard. |
| **No inventory status displayed** | Product says "available" but checkout form says "out of stock". Trust breaks. | Show "In Stock" / "Out of Stock" / "Pre-order" prominently. Update in real-time if inventory is DatoCMS field. Disable "Add to Cart" if out of stock. |
| **Confusing product filtering with few products** | With 15 products, filtering by category shows empty results because not all products tagged. | With <50 products, consider no filtering. Or simple category tabs. Ensure all products tagged in DatoCMS. Show "No products in this category" clearly. |
| **Form validation missing on order checkout** | User submits incomplete form (no email). Order lost. Email bounces. | Validate form client-side (required fields) and server-side (real email, valid phone). Show error messages inline. Re-populate form if validation fails. |
| **Mobile layout breaks cart or checkout** | Mobile user can't add quantity, sees payment form off-screen. Cart unusable on phone. | Mobile-first design. Test checkout form on iPhone SE and Android. Responsive cart layout (vertical stacking). Tap targets ≥44px. |
| **No loading state during checkout submission** | User taps submit, no feedback. Taps again. Form submits twice. | Disable submit button while loading. Show spinner. Display "Processing..." message. Prevent double-submission. |

---

## "Looks Done But Isn't" Checklist

- [ ] **Product pages:** Include OG meta tags, product image, price, category, availability. Test with Twitter/Discord preview.
- [ ] **Cart:** Works on mobile, persists after hard-refresh, empty state clear, total price visible, item removal works.
- [ ] **Checkout form:** All fields labeled, validation messages clear, submit button obvious, success/error message shown.
- [ ] **SEO:** Each product page has unique title (not generic), meta description (under 160 chars), schema.org/Product structured data.
- [ ] **404 page:** Custom 404 designed, suggests alternatives or back button. Not error stack trace.
- [ ] **Redirects:** Old product URLs (if migrating) redirect with 301 to new URLs. Test with `curl -I`.
- [ ] **Images:** All product images optimized, lazy-loaded, alt text present, no layout shift on load.
- [ ] **DatoCMS sync:** Schema changes documented, types generated, no stale queries in codebase.
- [ ] **Cart edge cases:** Add same product twice (quantity increments?). Remove last item. Navigate away and return. Hardcoded prices vs. real prices matched.
- [ ] **Analytics:** GA / GTM events firing correctly (product page view, add to cart, checkout). Not firing duplicate events.
- [ ] **Dark mode (if applicable):** Test all pages in dark mode. Images still visible. Text contrast OK. No flicker on page load.
- [ ] **Lighthouse:** Aim for green across FCP, LCP, CLS on mobile. Core Web Vitals passing.

---

## Recovery Strategies

If pitfalls occur despite prevention:

| Pitfall | Recovery Cost | Recovery Steps |
|---------|---------------|----------------|
| **Data staleness discovered post-launch** | MEDIUM (1-2 days) | 1. Add `cache: "no-store"` to affected fetch calls. 2. Deploy hotfix. 3. Vercel purges cache automatically. 4. Verify fresh data appears. |
| **Cart lost on refresh (no persistence implemented)** | HIGH (2-3 days) | 1. Add localStorage persistence to cart state. 2. Implement hydration carefully to avoid mismatch errors. 3. Migrate users with saved carts (JSON in localStorage). 4. Communicate to users "carts now save". |
| **SEO traffic dropped (URL structure changed, bad redirects)** | HIGH (2-4 weeks) | 1. Audit old → new URL mapping. 2. Add 301 redirects for any missing. 3. Submit updated sitemap to GSC. 4. Wait for re-crawl (days to weeks). 5. Monitor rankings in GSC. |
| **DatoCMS schema broken queries in production** | MEDIUM (1 day) | 1. Revert DatoCMS schema change. 2. Or fix queries immediately, redeploy. 3. Regenerate `schema.graphql`. 4. Test in staging before prod. 5. Implement schema review process. |
| **Cart shows wrong price (stored price instead of real-time)** | HIGH (1-2 days + manual support) | 1. Fetch fresh prices server-side on checkout, don't use cart prices. 2. Refund/re-charge customers affected. 3. Audit checkout logic. 4. Test with product price changes mid-checkout. |
| **Vercel function timeout (ISR revalidation too aggressive)** | LOW (hours) | 1. Increase `revalidate` time (e.g., 3600 instead of 60). 2. Batch revalidations. 3. Use on-demand revalidation instead of time-based. 4. Monitor function execution time. |
| **localStorage data corruption (outdated format)** | MEDIUM (1-2 days) | 1. Add version number to localStorage data. 2. Implement migration from old → new format. 3. Clear old data if no migration possible. 4. Release as hotfix. 5. Users re-add items to cart (acceptable for small catalogs). |

---

## Phase-Specific Warnings

| Phase Topic | Likely Pitfall | Mitigation |
|-------------|----------------|------------|
| **Phase 0: Setup** | Over-engineering architecture for <20 products | Decide early: SSG for products, localStorage for cart. Skip Supabase. |
| **Phase 1: Core Shop** | Fetch caching misunderstanding. URL slugs not finalized. DatoCMS schema not versioned. | Establish fetch policy NOW: document every API call. Lock product URLs. Set up schema.graphql in Git. |
| **Phase 1: Core Shop** | Old product URLs not redirected (if migrating) | Create URL mapping spreadsheet. Implement redirects in `next.config.js`. Test with `curl -I`. |
| **Phase 2: Cart System** | Cart state lost on page refresh. Hydration mismatches. | Implement localStorage persistence. Test with hard-refresh. Verify no console hydration errors. |
| **Phase 3: Checkout** | Route Handler caching hides stale product data. Prices wrong. | Set `revalidate: 0` on checkout-related Route Handlers. Fetch fresh prices. Test in production preview. |
| **Phase 3: Checkout** | Order form accepts any input without validation | Sanitize inputs. Validate server-side. Limit free-form text fields. Use select dropdowns. |
| **Phase 3: Pre-Launch** | SEO metadata missing or broken. Redirects incomplete. | Audit every product page: title, meta description, OG tags, schema.org. Test redirects. Verify structured data with Google's tool. |
| **Phase 3: Pre-Launch** | Image optimization overlooked | Ensure all product images use Next.js `<Image>`. Test Lighthouse mobile score. Aim for green LCP. |
| **Post-Launch Monitoring** | Undetected caching bugs or data staleness | Monitor Vercel logs for cache misses. Set up alerts for function errors. Monthly audit of product prices vs. DatoCMS. |

---

## Sources

- [Vercel: Common mistakes with the Next.js App Router](https://vercel.com/blog/common-mistakes-with-the-next-js-app-router-and-how-to-fix-them)
- [App Router Pitfalls in Next.js](https://imidef.com/en/2026-02-11-app-router-pitfalls)
- [State Management in React 2026: Best Practices](https://www.c-sharpcorner.com/article/state-management-in-react-2026-best-practices-tools-real-world-patterns/)
- [Next.js SEO Migration Guide 2026](https://next-cart.com/blog/seo-ecommerce-migration-guide-in-the-ai-era-2026/)
- [SEO Migration Checklist 2026](https://www.shopify.com/enterprise/blog/replatforming-seo-strategies)
- [E-commerce Cart Persistence: localStorage vs IndexedDB](https://rxdb.info/articles/localstorage-indexeddb-cookies-opfs-sqlite-wasm.html)
- [DatoCMS and Next.js Integration Documentation](https://www.datocms.com/docs/next-js)
- [Small E-commerce Shop Over-engineering Pitfalls](https://www.bigcommerce.com/articles/ecommerce-website-development/ecommerce-architecture/)
- [ISR Pitfalls in Next.js 15](https://github.com/vercel/next.js/issues/72456)
- [Next.js App Router Caching Guide](https://nextjs.org/learn/seo/url-structure)
- [Cart State Management Mistakes (Adobe Commerce PWA Studio)](https://developer.adobe.com/commerce/pwa-studio/guides/general-concepts/state-management/)

---

*Pitfalls research for: Next.js 15 e-commerce shop rebuild (DatoCMS + small catalog + meetup fulfillment)*
*Researched: 2026-02-20*
