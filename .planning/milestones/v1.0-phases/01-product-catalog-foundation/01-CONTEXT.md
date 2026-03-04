# Phase 1: Product Catalog & Foundation - Context

**Gathered:** 2026-02-24
**Status:** Ready for planning

<domain>
## Phase Boundary

Users can browse the product catalog, view product details with images and pricing, navigate the site, and understand the brand mission. Includes homepage, shop page with category pages, product detail pages, About page, FAQ page, header/footer navigation, responsive design, and SEO metadata. Shopping cart and checkout are separate phases.

</domain>

<decisions>
## Implementation Decisions

### Visual style & brand feel
- Minimal with personality — clean modern shop with subtle illustrated touches, not full zine aesthetic
- Monochrome + accent color palette — black/white/gray base with one or two pop colors, like a zine printed with limited ink
- Clean sans-serif typography — Inter, Satoshi, or similar; personality comes from content not fonts
- Illustrations come through product images only — no custom illustrated UI elements, empty states, or hero illustrations

### Product browsing experience
- Grid of cards layout — 2-3 columns of product cards, standard e-commerce grid
- Each card shows: product image, name, price, and availability badge (Available / Pre-order / Sold out)
- Separate category pages with their own URLs — /shop/zines, /shop/apparel, /shop/stationery, /shop/pins (better for SEO and sharing)
- Sold-out products shown but dimmed — visible with 'Sold out' badge and reduced opacity, keeps full range visible

### Homepage & featured products
- Homepage (/) and Shop (/shop) are separate pages
- Hero section: brand statement headline + "Browse the shop" CTA — simple and direct
- Featured products displayed as a horizontal row of 3-4 product cards below the hero
- Minimal homepage: hero + featured products + footer only — no extra sections, shop page is the main destination

### Content pages (About & FAQ)
- About page: mission-focused tone (third-person), covering educational mission, origin story, and who's behind it
- FAQ: grouped by topic (Ordering, Fulfillment, Products, etc.) with expandable accordion answers
- Both About and FAQ content hardcoded in the codebase — content rarely changes, no CMS needed

### Claude's Discretion
- Specific accent color choice within the monochrome + accent direction
- Exact spacing, card sizing, and responsive breakpoints
- Loading states and error handling
- Product detail page layout (image gallery behavior, info arrangement)
- SEO metadata structure and Open Graph implementation
- Footer content and social media link presentation

</decisions>

<specifics>
## Specific Ideas

- Brand inspiration: shop.bubblesort.io for the educational-yet-fun overall feel, but our execution is cleaner/more minimal
- Under 20 products — architecture should stay simple, no virtualization or complex pagination needed
- DatoCMS for product data (existing integration pattern)
- Categories are fixed: Zines, Apparel, Stationery, Pins

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 01-product-catalog-foundation*
*Context gathered: 2026-02-24*
