# Phase 4: Portfolio Foundation - Context

**Gathered:** 2026-03-04
**Status:** Ready for planning

<domain>
## Phase Boundary

Clean architectural separation between portfolio and shop using Next.js route groups. Portfolio pages get their own navigation, layout, and styling. Shop pages remain untouched. No route collisions between portfolio, shop, and comics content.

</domain>

<decisions>
## Implementation Decisions

### Homepage Ownership
- Comics KEEP the root `/` URL — comics listing stays as homepage
- Portfolio pages live under their own routes: /engineering, /case-studies, /resume, /contact
- Portfolio does NOT take over `/` — the site retains its comics identity at root

### Navigation Split
- Three separate, route-specific navigation systems:
  - Portfolio nav on portfolio pages (Home, Engineering, Case Studies, Resume, Contact)
  - Shop nav on /shop/* pages (existing Navigation.tsx — unchanged)
  - Comics nav on / and /[slug] pages (existing inline nav — unchanged)
- No unified nav — each section has its own context-appropriate navigation

### Route Architecture
- Use Next.js route groups: `(portfolio)` and `(shop)` for clean separation
- Each route group gets its own layout with appropriate nav/footer
- Comics pages (/, /[slug], /about) remain at root level outside route groups
- Root layout.tsx becomes minimal (html/body/analytics only) — no nav/footer at root level
- Portfolio layout provides portfolio nav + portfolio footer
- Shop layout provides shop nav + shop footer (move existing Navigation.tsx/Footer.tsx here)

### Visual Identity
- Clean professional palette — DROP the pink (#ec4899) for portfolio pages
- Use neutral/dark palette for professional feel (dark text, muted accents)
- New portfolio-* CSS prefix (parallel to shop-* convention)
- System fonts or professional sans-serif for portfolio (NOT Inter — that's shop)
- Shop retains its existing playful identity entirely unchanged

### Claude's Discretion
- Exact color palette for portfolio (neutral/dark professional)
- Font choice for portfolio pages (system fonts or a professional option)
- Portfolio footer content and layout
- SEO metadata structure per portfolio page

</decisions>

<specifics>
## Specific Ideas

- Portfolio "Home" link in portfolio nav should point to a portfolio landing page (could be /portfolio or similar) — NOT the comics root /
- Three distinct visual worlds on one domain: comics (root, hand-drawn feel), portfolio (professional, clean), shop (playful, indie)
- The separation should be clean enough that a Tokyo hiring manager only sees the portfolio section

</specifics>

<code_context>
## Existing Code Insights

### Reusable Assets
- `app/components/Navigation.tsx` — shop nav, currently rendered globally in root layout. Move to shop route group layout
- `app/components/Footer.tsx` — shop footer, same situation. Move to shop route group layout
- `app/components/comic-navigation.tsx` — comics nav component exists
- `app/globals.css` — has shop-* prefixed classes, will add portfolio-* classes here

### Established Patterns
- shop-* CSS prefix convention — extend to portfolio-* for new pages
- Route-aware conditional rendering already partially done (Navigation/Footer check SHOP_ROUTES)
- Inter font scoped to shop via next/font/google — portfolio will use different font

### Integration Points
- `app/layout.tsx` — currently renders Navigation + Footer globally. Must be refactored to be minimal (html/body only)
- `app/page.tsx` — comics homepage with inline nav. Stays at root, outside route groups
- `app/shop/` — moves into `(shop)` route group with its own layout
- New `(portfolio)` route group with portfolio layout, nav, footer

</code_context>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 04-portfolio-foundation*
*Context gathered: 2026-03-04*
