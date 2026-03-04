# Centimentalcomics Shop Roadmap

**Project:** Centimentalcomics Indie E-Commerce Shop
**Created:** 2026-02-20
**Depth:** Quick (3 phases)
**Coverage:** 19/19 v1 requirements mapped

---

## Phases

- [x] **Phase 1: Product Catalog & Foundation** - Build product catalog, navigation, and information pages with DatoCMS integration (completed 2026-02-26)
- [x] **Phase 2: Shopping Cart** - Implement cart state management with persistence across sessions (completed 2026-03-01)
- [x] **Phase 3: Checkout & Order Form** - Complete the purchase flow with order submission and confirmation (completed 2026-03-03)

---

## Phase Details

### Phase 1: Product Catalog & Foundation

**Goal:** Users can browse the product catalog, view product details with images and pricing, navigate the site, and understand the brand mission.

**Depends on:** Nothing (first phase)

**Requirements:** CAT-01, CAT-02, CAT-03, CAT-04, DSGN-01, DSGN-02, DSGN-03, TECH-01, TECH-02, TECH-03, CONT-01, CONT-02

**Success Criteria** (what must be TRUE when phase completes):
1. User can browse all products on the shop page with images, names, prices, and availability status visible
2. User can click on any product and view a detail page with full description, multiple images, price, and availability
3. User can see featured products highlighted on the homepage to understand top recommendations
4. User can filter products by category (Zines, Apparel, Stationery, Pins) and view each category independently
5. User can navigate the entire site with clear header navigation linking to Shop, About, and FAQ pages
6. User can view the About page with the brand story and educational mission
7. User can view the FAQ page with answers about ordering, fulfillment, and pre-orders
8. Site displays a playful, zine-like visual aesthetic with illustrations that match the centimentalcomics brand
9. All pages are responsive and usable on mobile devices with touch-friendly interactions
10. Product pages are SEO-optimized with metadata, Open Graph tags, and social media links visible in header/footer

**Plans:** 5/5 plans complete

Plans:
- [ ] 01-01-PLAN.md — Foundation: types, constants, DatoCMS queries, cache tags (Wave 1)
- [ ] 01-02-PLAN.md — Design system: layout, Navigation, Footer, Tailwind accent color (Wave 2)
- [ ] 01-03-PLAN.md — Product browsing: ProductCard, ProductGrid, /shop page, category pages (Wave 2)
- [ ] 01-04-PLAN.md — Product detail page: SSG, SEO metadata, availability badge (Wave 3)
- [ ] 01-05-PLAN.md — Content: homepage hero + featured products, About page, FAQ page (Wave 3)

---

### Phase 2: Shopping Cart

**Goal:** Users can add products to a cart, view and manage their selections, and have cart persist across browser sessions and page navigations.

**Depends on:** Phase 1 (requires products to be browsable)

**Requirements:** CART-01, CART-02, CART-03, CART-04

**Success Criteria** (what must be TRUE when phase completes):
1. User can click "Add to Cart" on any product and see the cart counter increment in the header
2. User can open the cart drawer and see all added items with product names, quantities, and subtotals
3. User can update item quantities in the cart and see the total price update in real-time
4. User can remove items from the cart and see them disappear from the cart view
5. User can navigate away from the shop, close the browser, and return to find the same items still in their cart

**Plans:** 3/3 plans complete

Plans:
- [ ] 02-01-PLAN.md — Cart store foundation: Zustand + localStorage persist, CartItem type (Wave 1)
- [ ] 02-02-PLAN.md — Cart UI: NavigationCartIcon + /cart page with item management (Wave 2)
- [ ] 02-03-PLAN.md — Add-to-Cart wiring: ProductCard quick-add + detail page stepper (Wave 2)

---

### Phase 3: Checkout & Order Form

**Goal:** Users can submit orders with their contact information and selected items, receive order confirmation, and orders are stored for the seller to arrange meetup fulfillment.

**Depends on:** Phase 2 (requires working cart)

**Requirements:** CHKT-01, CHKT-02, CHKT-03

**Success Criteria** (what must be TRUE when phase completes):
1. User can navigate to checkout page from the cart
2. User can fill out order form with name, email, phone, and see all items from their cart listed
3. User can submit the form and receive a success confirmation page with order details
4. User sees clear instructions on the confirmation page explaining that they will be contacted at the provided email/phone to arrange meetup
5. Order data (customer contact info and items) is securely stored for the seller to retrieve and process

**Plans:** 2/2 plans complete

---

## Progress Tracking

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Product Catalog & Foundation | 5/5 | Complete    | 2026-02-26 |
| 2. Shopping Cart | 3/3 | Complete    | 2026-03-01 |
| 3. Checkout & Order Form | 2/2 | Complete   | 2026-03-03 |

---

## Notes

**Coverage validation:** All 19 v1 requirements mapped to exactly one phase. No orphaned requirements.

**Depth rationale:** Quick depth is appropriate for this project. Research identified clear feature dependencies (catalog → cart → checkout) with no complex cross-cutting concerns. Three phases deliver a complete, launchable shop.

**Research integration:** Phases align with SUMMARY.md recommendations. Phase 1 establishes foundation and avoids critical pitfalls (fetch caching, URL structure, DatoCMS schema). Phase 2 implements proven cart patterns (Zustand or Context with localStorage). Phase 3 completes the flow with Server Actions and order storage.

**Next step:** Run `/gsd:execute-phase 1` to execute Phase 1 plans.
