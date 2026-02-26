# Requirements: Centimentalcomics Shop

**Defined:** 2026-02-20
**Core Value:** Customers can browse the product catalog and submit orders for educational CS products

## v1 Requirements

Requirements for initial release. Each maps to roadmap phases.

### Catalog

- [ ] **CAT-01**: User can browse all products on the shop page with images and prices
- [ ] **CAT-02**: User can view product detail page with images, price, description, and availability status
- [ ] **CAT-03**: User can see featured products highlighted on the homepage
- [ ] **CAT-04**: User can browse products organized by category (Zines, Apparel, Stationery, Pins)

### Cart

- [ ] **CART-01**: User can add products to a shopping cart from product pages
- [ ] **CART-02**: User can view cart with item list, quantities, and running total
- [ ] **CART-03**: User can update quantities or remove items from cart
- [ ] **CART-04**: Cart persists across page navigation and browser refresh

### Checkout

- [ ] **CHKT-01**: User can submit an order form with name, contact info, and selected items
- [ ] **CHKT-02**: User sees order confirmation after successful submission
- [ ] **CHKT-03**: Order details are stored for seller to review and arrange meetup

### Content

- [ ] **CONT-01**: User can view About page with brand story and educational mission
- [ ] **CONT-02**: User can view FAQ page with answers about ordering, fulfillment, availability, and pre-orders

### Design

- [ ] **DSGN-01**: Site has a playful, zine-like visual aesthetic matching the centimentalcomics brand
- [ ] **DSGN-02**: All pages are mobile responsive with touch-friendly interactions
- [ ] **DSGN-03**: Site has clear navigation with header and product categories

### Technical

- [ ] **TECH-01**: Product pages have SEO metadata and Open Graph tags
- [x] **TECH-02**: Product data is fetched from DatoCMS via GraphQL
- [ ] **TECH-03**: Social media links (Instagram, Twitter) displayed in site header/footer

## v2 Requirements

Deferred to future release. Tracked but not in current roadmap.

### Filtering

- **FILT-01**: User can filter products by category, price, and availability

### Engagement

- **ENGM-01**: User can view upcoming meetup events and pop-ups
- **ENGM-02**: User can subscribe to newsletter for restock alerts and new releases

### Enhanced Content

- **ECNT-01**: User can preview sample zine pages before purchasing
- **ECNT-02**: User can view learning objectives for each educational zine
- **ECNT-03**: User can read customer testimonials and educator endorsements

## Out of Scope

| Feature | Reason |
|---------|--------|
| Online payment processing (Stripe, PayPal) | Meetup-based fulfillment — payment is in-person |
| User accounts / authentication | Public shop, no login needed at this scale |
| Inventory tracking / admin dashboard | Under 20 products managed via external spreadsheet/Notion |
| Abandoned cart recovery emails | Over-engineering for meetup-based indie shop |
| Real-time chat / live support | FAQ covers common questions; email for inquiries |
| Multi-language support | English-only audience for now |
| Wishlist / save for later | Low value with under 20 products |
| Product ratings / reviews | Use curated testimonials instead (v2) |
| Shipping calculator | Not applicable — meetup-based fulfillment |
| Coupon / discount codes | Low priority for mission-driven shop |
| Mobile app / PWA | Web-first |

## Traceability

Which phases cover which requirements. Updated during roadmap creation.

| Requirement | Phase | Status |
|-------------|-------|--------|
| CAT-01 | Phase 1 | Pending |
| CAT-02 | Phase 1 | Pending |
| CAT-03 | Phase 1 | Pending |
| CAT-04 | Phase 1 | Pending |
| CART-01 | Phase 2 | Pending |
| CART-02 | Phase 2 | Pending |
| CART-03 | Phase 2 | Pending |
| CART-04 | Phase 2 | Pending |
| CHKT-01 | Phase 3 | Pending |
| CHKT-02 | Phase 3 | Pending |
| CHKT-03 | Phase 3 | Pending |
| CONT-01 | Phase 1 | Pending |
| CONT-02 | Phase 1 | Pending |
| DSGN-01 | Phase 1 | Pending |
| DSGN-02 | Phase 1 | Pending |
| DSGN-03 | Phase 1 | Pending |
| TECH-01 | Phase 1 | Pending |
| TECH-02 | Phase 1 | Complete |
| TECH-03 | Phase 1 | Pending |

**Coverage:**
- v1 requirements: 19 total
- Mapped to phases: 19
- Unmapped: 0 ✓

---

*Requirements defined: 2026-02-20*
*Last updated: 2026-02-20 after roadmap creation*
