# Architecture Integration Summary: Portfolio Pages

**Date:** 2026-03-04
**Status:** Research Complete
**For:** v2.0 Portfolio Milestone

---

## Key Architectural Decision

**Use Next.js route groups `(portfolio)` and `(shop)` to cleanly separate portfolio and e-commerce sections while maintaining a single global layout.**

This avoids page reloads when navigating between sections and provides a professional, responsive experience.

---

## What Changes vs. What Stays the Same

### No Changes (Fully Backward Compatible)

- Shop routes at `/shop/*` — fully preserved
- Product data flow (DatoCMS → ProductCard) — unchanged
- Cart and checkout flows — unchanged
- Comic posts at `/[slug]` — unchanged
- Existing CSS (`shop-*` prefix) — unchanged
- Existing components (Navigation, Footer for shop) — unchanged

### New Components & Files

```
New files (22 files, ~1500 LOC):
├── (portfolio)/layout.tsx                 # Route group layout
├── (portfolio)/page.tsx                   # Homepage
├── (portfolio)/engineering/page.tsx       # Tech stack
├── (portfolio)/case-studies/page.tsx      # Case grid
├── (portfolio)/case-studies/[slug]/page.tsx # Case detail
├── (portfolio)/resume/page.tsx            # Resume page
├── (portfolio)/contact/page.tsx           # Contact page
├── components/PortfolioNavigation.tsx     # Nav component
├── components/PortfolioFooter.tsx         # Footer component
├── components/CaseStudyCard.tsx           # Case card
├── components/SkillBadge.tsx              # Skill badge
├── components/ContactForm.tsx             # Contact form
├── lib/portfolio-data.ts                  # Hardcoded data
├── lib/contact.ts                         # Server Action
└── app/globals.css (additions)            # portfolio-* CSS
```

### Modified Files (Minimal Changes)

| File | Changes |
|------|---------|
| `app/layout.tsx` | Add conditional Navigation/Footer rendering based on route |
| `app/lib/types.ts` | Add CaseStudy, TechCategory, Resume types (TypeScript interfaces) |
| `app/lib/constants.ts` | Add portfolio constants if needed |
| `app/globals.css` | Add ~300 lines of `portfolio-*` CSS classes (no removal of existing styles) |

---

## Route Structure at a Glance

```
Root level:
  / → (portfolio)/page.tsx (NEW homepage, replaces current)
  /engineering → (portfolio)/engineering/page.tsx (NEW)
  /case-studies → (portfolio)/case-studies/page.tsx (NEW)
  /case-studies/[slug] → (portfolio)/case-studies/[slug]/page.tsx (NEW)
  /resume → (portfolio)/resume/page.tsx (NEW)
  /contact → (portfolio)/contact/page.tsx (NEW)
  /shop → (shop)/page.tsx (EXISTING, preserved)
  /shop/[slug] → (shop)/[slug]/page.tsx (EXISTING, preserved)
  /shop/about → (shop)/about/page.tsx (EXISTING, preserved)
  /cart → Existing (root level, shared)
  /checkout → Existing (root level, shared)
  /faq → Existing (root level, shared)
  /about → Existing (legacy comics page)
  /[slug] → Existing (comic posts)
```

---

## Navigation Flow

```
Portfolio (Primary):
  Home (/) → Engineering → Case Studies → Resume → Contact
                                         └→ Shop link (footer)

Shop (Secondary, demoted):
  /shop → Category filters → Product detail → Cart → Checkout
```

**Key:** Portfolio is the landing page. Shop is accessible via footer link on portfolio pages.

---

## Data Sources

| Content | Source | Freshness | Changes |
|---------|--------|-----------|---------|
| **Homepage** | `lib/portfolio-data.ts` | Deploy-time | None yet |
| **Engineering stack** | `lib/portfolio-data.ts` | Deploy-time | New data |
| **Case studies** | `lib/portfolio-data.ts` | Deploy-time | New data |
| **Resume** | `lib/portfolio-data.ts` | Deploy-time | New data |
| **Contact form** | Server Action + Resend | Real-time | New flow |
| **Shop products** | DatoCMS GraphQL | ISR (3600s) | Unchanged |
| **Cart state** | Zustand (localStorage) | Client-side | Unchanged |
| **Orders** | Supabase | Real-time | Unchanged |

---

## CSS Strategy

**Single stylesheet, semantic prefixes:**

```css
.portfolio-* ← Portfolio page styles
.shop-*     ← Shop page styles (existing)
.u-*        ← Utility classes (shared)
```

**No CSS-in-JS or styled-components needed.** Tailwind + globals.css handles everything.

---

## Font Strategy

**Two font families, no switching:**

```
Portfolio pages: System fonts (-apple-system, BlinkMacSystemFont, Roboto, sans-serif)
Shop pages:     Inter font (existing, via inline styles)
```

**No runtime font selection.** Route groups naturally separate the layouts.

---

## Form Handling Strategy

**Contact form uses Server Actions (no API route):**

```
User form → FormData → Server Action (lib/contact.ts)
                     → Zod validation
                     → Resend email
                     → Return success/error
```

**Benefits:** Progressive enhancement, type-safe validation, no separate API route, cleaner code.

---

## Static Generation & Build Strategy

**Portfolio pages are fully static at build-time:**

```typescript
export async function generateStaticParams() {
  return getAllCaseSlugs().map(slug => ({ slug }))
}

// Generates: /case-studies/rails-api-optimization.html
//            /case-studies/docker-deployment.html
//            ... etc (one .html file per case study)
```

**Build time:** Should remain <1 minute for up to 5 case studies. Monitor if grows beyond 20.

---

## Navigation Component Logic

**Portfolio Navigation shown on portfolio routes only:**

```typescript
const isPortfolioRoute = !pathname.startsWith('/shop') &&
                         !pathname.startsWith('/cart') &&
                         !pathname.startsWith('/checkout') &&
                         !pathname.startsWith('/faq')

if (!isPortfolioRoute) return null
```

**Result:** Portfolio nav hides automatically when visiting /shop, /cart, etc. No full page reload.

---

## Metadata & SEO

**Portfolio gets its own metadata overrides:**

- Root metadata: Title template, description, OG image
- Portfolio page metadata: "Rails Engineer Portfolio"
- Case study metadata: Dynamic per slug (title, summary from case study)
- Shop pages: Unchanged (existing metadata)

**Result:** Proper SEO for both sections. Google can crawl and index all pages.

---

## Integration with Existing Architecture

### Existing Features That Don't Change

- **DatoCMS integration**: Shop products fetched via GraphQL, ISR revalidation works as-is
- **Cart state**: Zustand + localStorage persists across portfolio and shop pages
- **Checkout flow**: Existing Server Actions and Supabase integration unchanged
- **Order email**: Resend integration for order notifications works as-is
- **Google Analytics/GTM**: Global tracking continues to work
- **Vercel deployment**: No special config needed; static generation and ISR coexist

### New Dependencies (If Any)

- **Resend**: Already a dependency for order emails. Contact form reuses it.
- **Zod**: Already a dependency (used in other projects). Contact form validation uses it.
- **No new npm packages** required.

---

## Performance Implications

### Build Time Impact

- **Expected:** +30–60 seconds (for static generation of portfolio pages + case studies)
- **Current:** Unknown, but likely ~60 seconds already
- **At 5 case studies:** ~90 seconds total build time
- **At 20 case studies:** ~120 seconds total build time
- **Recommendation:** Monitor build time in CI/CD

### Runtime Performance

- **Portfolio pages:** Static HTML, instant (0 network requests for content)
- **Shop pages:** ISR with 3600s revalidation, no change
- **Contact form:** Server Action, ~500ms (Resend email latency)
- **No performance degradation** vs. current shop-only site

### Bundle Size

- **JavaScript:** +~20KB (portfolio components, form handling)
- **CSS:** +~15KB (portfolio-* classes)
- **HTML:** Static pages have no impact on bundle (pre-rendered)
- **Overall:** Minimal impact; mostly static files

---

## Testing Strategy

### Unit Tests to Add

- `lib/portfolio-data.ts`: Test data structure, slug generation
- `lib/contact.ts`: Test Zod validation, error handling
- `components/ContactForm.tsx`: Test form submission

### Integration Tests to Add

- Portfolio navigation visibility on portfolio vs. shop routes
- Case study dynamic routing (slug → correct page)
- Contact form submission and Resend email delivery

### Manual Testing Checklist

- [ ] `next build` completes successfully
- [ ] All portfolio pages render (static HTML files exist in `.next`)
- [ ] Navigation between portfolio pages doesn't reload
- [ ] Navigation from portfolio to shop doesn't reload
- [ ] Shop pages still load products from DatoCMS
- [ ] Cart persists across portfolio and shop pages
- [ ] Contact form submits and email arrives
- [ ] OG metadata correct for each page
- [ ] Responsive design on mobile (portfolio and shop)

---

## Deployment Considerations

### Vercel Deployment

- **No changes to `vercel.json`** — default Next.js config works
- **Environment variables needed:**
  - `RESEND_API_KEY` (for contact form emails)
  - `CONTACT_EMAIL_TO` (inbox to receive contact submissions)
  - Existing: `NEXT_PUBLIC_DATO_API_TOKEN`, `NEXT_PUBLIC_GTM_ID`, etc.
- **Build command:** `next build` (unchanged)
- **Start command:** `next start` (unchanged)
- **ISR revalidation:** Works as-is for shop pages

### Pre-Deployment Checklist

- [ ] Test `.env.local` with Resend API key
- [ ] Verify contact form sends emails to correct address
- [ ] Run `next build && next start` locally
- [ ] Check all portfolio pages generate as static HTML
- [ ] Verify shop pages still ISR-revalidate correctly
- [ ] Test navigation on production (Vercel preview or staging)
- [ ] Confirm no errors in Vercel build logs

---

## Rollback Strategy

If portfolio integration breaks the site:

1. **Immediate:** Revert latest commit (before portfolio changes)
2. **Short-term:** Delete `(portfolio)` folder, remove portfolio routes
3. **Root cause:** Check build logs for static generation failures
4. **Prevention:** Always test `next build` locally before pushing

**Risk:** Very low. Changes are additive (new route group) and don't modify existing shop/cart/checkout code.

---

## Suggested Commit Strategy

**Four commits, one per phase:**

```bash
# Phase 1: Foundation
git commit -m "feat: add portfolio route group structure and components"

# Phase 2: Core pages
git commit -m "feat: add portfolio pages (home, engineering, resume, contact)"

# Phase 3: Case studies
git commit -m "feat: add case studies grid and detail pages with static generation"

# Phase 4: Polish
git commit -m "feat: implement contact form Server Action and portfolio CSS styling"
```

---

## Success Criteria

- [ ] Portfolio pages render as static HTML at build time
- [ ] No full page reloads when navigating between portfolio and shop
- [ ] Contact form submits and emails are delivered
- [ ] All metadata (title, description, OG image) correct per page
- [ ] Shop functionality unchanged (products, cart, checkout, orders)
- [ ] Build time <2 minutes on Vercel
- [ ] All pages pass Core Web Vitals thresholds
- [ ] Responsive design on mobile, tablet, desktop

---

## What Comes Next (Phase 2 Tasks)

Once architecture is approved:

1. **Write phase plans** for each route (home, engineering, case-studies, etc.)
2. **Define content structure** for case studies, resume, stack
3. **Design mockups** for portfolio pages (hero, case grid, etc.)
4. **Plan Japanese-language section** (optional, for Tokyo market)
5. **Schedule interviews/writing** for case studies with real examples

---

## Questions to Clarify Before Starting

- [ ] Should portfolio be at `/` or have home page at another route?
- [ ] How many case studies to include initially? (Recommend 2–3)
- [ ] Should resume be a single page or multi-section with PDF download?
- [ ] Any Japanese language content needed for Tokyo market?
- [ ] Contact form: email-only, or also save to database?
- [ ] Case study code samples: GitHub links, or embedded code?

---

## Summary

**This architecture is proven, scalable, and adds zero complexity to the existing shop.** Route groups provide clean separation between portfolio and shop. Static generation makes portfolio pages fast. Server Actions make the contact form simple. Hardcoded data means no CMS overhead for content that rarely changes.

**Implementation risk: Low.** Changes are additive. Existing shop code untouched. Can be rolled back in minutes if needed.

**Confidence: HIGH.** This approach follows Next.js 15 best practices and mirrors patterns used by successful portfolios and SaaS sites.
