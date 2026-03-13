# Phase 4: Portfolio Foundation - Research

**Researched:** 2026-03-04
**Domain:** Next.js route groups, layout architecture, SEO metadata, conditional component rendering
**Confidence:** HIGH

## Summary

Phase 4 requires establishing clean architectural separation between portfolio and shop sections using Next.js route groups. The implementation leverages existing Next.js 15.5.8 route group capabilities and conditional rendering patterns already established in the Navigation/Footer components. The core challenge is refactoring the root layout from globally-scoped nav/footer to section-specific layouts, which Next.js route groups solve elegantly.

Key finding: The codebase already uses conditional rendering (Navigation/Footer check `SHOP_ROUTES`) and has a `(main)` route group established, indicating familiarity with this pattern. Route groups are a stable, production-proven feature in Next.js.

**Primary recommendation:** Use Next.js route groups `(portfolio)` and `(shop)` with section-specific layouts. Minimize root layout to HTML/body/analytics only. Establish portfolio-* CSS class naming convention parallel to existing shop-* pattern.

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- Comics KEEP the root `/` URL — comics listing stays as homepage
- Portfolio pages live under their own routes: /engineering, /case-studies, /resume, /contact
- Portfolio does NOT take over `/` — the site retains its comics identity at root
- Three separate, route-specific navigation systems (portfolio nav, shop nav, comics nav)
- Use Next.js route groups: `(portfolio)` and `(shop)` for clean separation
- Each route group gets its own layout with appropriate nav/footer
- Comics pages (/, /[slug], /about) remain at root level outside route groups
- Root layout.tsx becomes minimal (html/body/analytics only) — no nav/footer at root level
- Portfolio layout provides portfolio nav + portfolio footer
- Shop layout provides shop nav + shop footer (move existing Navigation.tsx/Footer.tsx here)
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

### Deferred Ideas (OUT OF SCOPE)
None — discussion stayed within phase scope

</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|----|---|
| SITE-01 | Main navigation shows Home, Engineering, Case Studies, Resume, Contact | Route groups + layout.tsx per (portfolio) group enables section-specific nav rendering. Navigation.tsx pattern shows conditional rendering approach already in use. |
| SITE-02 | Shop link demoted to footer (not primary nav) | Portfolio footer component can include shop link. Separate layouts for (portfolio) and (shop) allow different footer content. |
| SITE-03 | Portfolio pages use route groups for clean separation from shop routes | Next.js route groups are native feature. (portfolio) group routes won't collide with (shop). Root / remains for comics. |
| SITE-04 | All portfolio pages have SEO metadata and Open Graph tags | Next.js Metadata API (layout.tsx + page.tsx level) supports per-page SEO. Existing root layout.tsx shows pattern; extend to portfolio layout + pages. |
| SITE-05 | Site tone is professional: clear outcomes, measurable impact, technical clarity throughout | Content concern (out of scope for Phase 4 architecture). Phase 4 establishes structural foundation; tone is enforced in content creation (Phases 5-6). |

</phase_requirements>

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| **Next.js** | 15.5.8 | React framework, routing, server components, file-based routes | Codebase standard; enables route groups, server-side rendering, built-in SEO metadata API |
| **React** | latest (19.x) | UI component framework | Codebase standard; supports server/client components seamlessly |
| **TypeScript** | 5.7.3 | Type safety | Codebase standard; all components typed |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| **Tailwind CSS** | 3.4.17 | Utility-first CSS | Used across codebase; portfolio uses same build pipeline, custom portfolio-* classes via globals.css |
| **PostCSS** | 8.5.1 | CSS transformations | Required by Tailwind, already configured in codebase |
| **next/font/google** | 15.5.8 | Font loading | Currently loads Inter for shop; portfolio will use different font (discretion choice) |
| **Metadata API** (built-in) | 15.5.8 | SEO, Open Graph | Next.js native; supports cascading metadata from layout + page level |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Route groups for separation | Single layout with route detection | Route groups are explicit, maintainable, enable per-section layouts without conditional logic |
| Next.js Metadata API | Manual meta tag injection | Metadata API is built-in, typed, cascade-aware; manual tags are error-prone and duplicated |
| CSS prefix convention (portfolio-*) | CSS modules or separate stylesheet | Prefix convention matches existing shop-* pattern, allows quick visual identification, integrates with global Tailwind setup |

**Installation:**

Route groups and metadata are built into Next.js 15.5.8 — no additional packages needed. Existing dependencies suffice.

## Architecture Patterns

### Recommended Project Structure

```
app/
├── layout.tsx                    # Root: html, body, analytics only
├── page.tsx                      # Comics homepage (/)
├── [slug]/                       # Comics detail pages
├── about/                        # Comics about page (root level, outside groups)
├── (portfolio)/
│   ├── layout.tsx               # Portfolio layout: nav, footer, styles
│   ├── page.tsx                 # Portfolio home (discretion: /portfolio or just /)
│   ├── engineering/
│   │   └── page.tsx
│   ├── case-studies/
│   │   ├── page.tsx             # Index
│   │   └── [slug]/
│   │       └── page.tsx         # Individual case study
│   ├── resume/
│   │   └── page.tsx
│   └── contact/
│       └── page.tsx
├── (shop)/
│   ├── layout.tsx               # Shop layout: nav, footer (move Navigation.tsx/Footer.tsx here)
│   ├── page.tsx                 # /shop homepage
│   ├── about/
│   │   └── page.tsx
│   └── [slug]/
│       └── page.tsx
├── api/                         # API routes (shared)
├── components/
│   ├── Navigation.tsx           # MOVE to (shop)/layout.tsx
│   ├── Footer.tsx               # MOVE to (shop)/layout.tsx
│   ├── portfolio-navigation.tsx # NEW: Portfolio nav
│   ├── portfolio-footer.tsx     # NEW: Portfolio footer
│   └── [...other shared]
├── lib/
│   ├── portfolio-data.ts        # NEW: Portfolio content (hardcoded case studies, etc.)
│   └── [...other shared]
└── globals.css                  # Root styles: shop-* classes, NEW portfolio-* classes
```

### Pattern 1: Route Groups with Isolated Layouts

**What:** Next.js route groups (`(groupName)`) create logical sections without affecting URL structure. Each group can have its own layout.tsx, creating isolated layout boundaries.

**When to use:** When you need multiple visual/structural contexts (portfolio vs shop) but want to avoid URL slugs that indicate the grouping. Groups are invisible to routing — `/engineering` routes through `(portfolio)/engineering/page.tsx`, not `(portfolio)/engineering`.

**Example:**
```typescript
// app/(portfolio)/layout.tsx
import type { ReactNode } from 'react'
import PortfolioNav from '@/app/components/portfolio-navigation'
import PortfolioFooter from '@/app/components/portfolio-footer'

export default function PortfolioLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <PortfolioNav />
      <main style={{ flex: 1 }}>
        {children}
      </main>
      <PortfolioFooter />
    </>
  )
}

// This applies to ALL routes under (portfolio), including /engineering, /case-studies, etc.
```

**Source:** Next.js docs on route groups — https://nextjs.org/docs/app/building-your-application/routing/route-groups

### Pattern 2: Cascading Metadata (Layout + Page)

**What:** Next.js Metadata API supports metadata defined at layout.tsx level (applies to all children) and page.tsx level (overrides layout). No manual meta tag management needed.

**When to use:** When each page needs unique SEO title/description/og:image but shares common metadata (site name, type, locale). Layouts define defaults; pages override per-route.

**Example:**
```typescript
// app/(portfolio)/layout.tsx
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: {
    template: 'Rails Engineer | %s',
    default: 'Rails Engineer Portfolio'
  },
  description: 'Portfolio and case studies from a Rails engineer',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://centimentalcomics.com',
    siteName: 'centimentalcomics',
  },
}

export default function PortfolioLayout({ children }: { children: ReactNode }) {
  // ...
}

// ----

// app/(portfolio)/engineering/page.tsx
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Tech Stack',
  description: 'Rails, system design, infrastructure, tools',
  openGraph: {
    title: 'Tech Stack',
    description: 'Rails, system design, infrastructure, tools',
    images: [{ url: '/og-engineering.jpg' }],
  },
}

export default function EngineeringPage() {
  return <div>Engineering page content</div>
}

// Result: page uses template + overrides title to "Rails Engineer | Tech Stack"
```

**Source:** Next.js docs on metadata — https://nextjs.org/docs/app/building-your-application/optimizing/metadata

### Pattern 3: Conditional Component Rendering by Route

**What:** Check current route (via `usePathname()`) to render section-specific components. Existing codebase already does this in Navigation.tsx (checks `SHOP_ROUTES`).

**When to use:** For shared components used across multiple sections but needing different content. Alternative: move component to section layout (cleaner but less flexible).

**Example:**
```typescript
// app/components/portfolio-navigation.tsx
'use client'

import { usePathname } from 'next/navigation'

const PORTFOLIO_ROUTES = ['/engineering', '/case-studies', '/resume', '/contact']

export default function PortfolioNav() {
  const pathname = usePathname()
  const isPortfolioRoute = PORTFOLIO_ROUTES.some(route => pathname === route || pathname.startsWith(route + '/'))

  if (!isPortfolioRoute) return null

  return (
    <header>
      <nav>
        <a href="/">home</a>
        <a href="/engineering">engineering</a>
        <a href="/case-studies">case studies</a>
        <a href="/resume">resume</a>
        <a href="/contact">contact</a>
      </nav>
    </header>
  )
}
```

**Source:** Next.js docs on usePathname — https://nextjs.org/docs/app/api-reference/hooks/use-pathname

### Anti-Patterns to Avoid

- **Global nav/footer in root layout:** Creates duplication/confusion when multiple sections exist. Use route groups + section layouts instead.
- **Duplicate Navigation/Footer components:** Current Navigation.tsx does shop-only rendering via conditional. Don't copy this pattern — move to shop layout instead.
- **Manual meta tag injection in head:** Use Next.js Metadata API instead (type-safe, cascade-aware, no duplication).
- **URL-based section indicators in group name:** Route groups are specifically designed to be invisible to URLs. Avoid `(portfolio)` affecting route structure.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Metadata/SEO management | Custom meta tag helpers, manual head management | Next.js Metadata API | Built-in, cascade-aware, typed, integrates with layouts |
| Route-aware rendering | Custom route tracking systems | Next.js usePathname() | Native hook, performs equally to custom tracking |
| Layout separation | Route detection in single layout | Route groups with per-group layouts | Explicit, maintainable, no conditional bloat in root |
| Font management per-section | Manual @font-face definitions | next/font/google (already in use) | Optimized, cached, integrates with build pipeline |

**Key insight:** Next.js route groups + layout.tsx are designed exactly for this use case (multi-section sites with different visual/structural identities). Attempting custom route detection or conditional layouts recreates what route groups solve natively.

## Common Pitfalls

### Pitfall 1: Forgetting Route Groups Don't Affect URLs

**What goes wrong:** Developer creates `(portfolio)` group and expects `/portfolio/engineering` URL. Actually produces `/engineering` URL.

**Why it happens:** Route groups are intentionally "invisible" to routing — they're a code organization feature, not URL structure. This is by design.

**How to avoid:** Verify URLs match requirements at the start. For "Portfolio Home," either create `/portfolio/page.tsx` (visible in URL) or use root `/` with logic elsewhere.

**Warning signs:**
- Testing and finding URLs different than expected
- User confusion about URL structure not matching folder structure

### Pitfall 2: Metadata Not Cascading as Expected

**What goes wrong:** Metadata defined in `(portfolio)/layout.tsx` not appearing on `(portfolio)/engineering/page.tsx`.

**Why it happens:** Usually a scope issue — layout metadata only applies to direct children. If page has its own metadata export, page-level metadata overrides layout.

**How to avoid:** Test each page URL and verify in page source. Use Next.js build warnings (will show if metadata export is incorrect).

**Warning signs:**
- SEO titles appearing wrong in browser tab
- Open Graph tags missing when checking page source
- Metadata template strings not expanding correctly

### Pitfall 3: CSS Prefix Collisions

**What goes wrong:** Portfolio CSS class `portfolio-card` conflicts with shop's `portfolio-*` if shop ever uses that prefix.

**Why it happens:** Single globals.css file shared across all routes. Prefixes prevent but don't eliminate collision risk with future code.

**How to avoid:** Establish clear naming: `portfolio-*` only in `(portfolio)` context, `shop-*` only in `(shop)` context. Document this convention. Use linting (future consideration) to enforce.

**Warning signs:**
- Unexpected styling on portfolio pages (shop CSS leaking through)
- Increased CSS bundle size from duplication

### Pitfall 4: Moving Navigation/Footer Without Updating Props

**What goes wrong:** Navigation.tsx moved to `(shop)/layout.tsx` but still has route detection logic for other routes (comics, portfolio).

**Why it happens:** Copy-paste from old location. Navigation.tsx was originally global, so it had logic to hide on non-shop routes.

**How to avoid:** When moving to shop layout, remove all `usePathname()` checks. Shop layout should always render shop nav — no conditionals needed.

**Warning signs:**
- Navigation appearing/disappearing unexpectedly on shop pages
- Unnecessary `usePathname()` calls in section-specific layouts

## Code Examples

Verified patterns from Next.js official documentation and existing codebase.

### Root Layout (Minimal)

```typescript
// app/layout.tsx
import type React from "react"
import type { Metadata } from "next"
import "./globals.css"
import { GoogleTagManager, GoogleAnalytics } from "@next/third-parties/google"

export const metadata: Metadata = {
  title: {
    template: "centimentalcomics: %s",
    default: "centimentalcomics",
  },
  description: "some comics about art and internet",
  // ... other root-level metadata (shared across all sections)
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const gtmId = process.env.NEXT_PUBLIC_GTM_ID
  const gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID

  return (
    <html lang="en">
      {gtmId && <GoogleTagManager gtmId={gtmId} />}
      {gaId && <GoogleAnalytics gaId={gaId} />}
      <body style={{ margin: 0, display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <main style={{ flex: 1 }}>
          {children}
        </main>
      </body>
    </html>
  )
}

// Note: Navigation and Footer removed. Comics, portfolio, and shop layouts handle their own nav/footer.
// Source: Next.js docs on layouts — https://nextjs.org/docs/app/building-your-application/routing/layouts-and-templates
```

### Portfolio Layout with Metadata

```typescript
// app/(portfolio)/layout.tsx
import type React from "react"
import type { Metadata } from "next"
import PortfolioNav from "@/app/components/portfolio-navigation"
import PortfolioFooter from "@/app/components/portfolio-footer"

export const metadata: Metadata = {
  title: {
    template: "Rails Engineer | %s",
    default: "Rails Engineer Portfolio",
  },
  description: "Portfolio and case studies from a Rails engineer",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://centimentalcomics.com",
    siteName: "centimentalcomics",
    title: "Rails Engineer Portfolio",
    description: "Portfolio and case studies from a Rails engineer",
    images: [
      {
        url: "/og-portfolio.jpg",
        width: 1200,
        height: 630,
        alt: "Portfolio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Rails Engineer Portfolio",
    description: "Portfolio and case studies from a Rails engineer",
    images: ["/og-portfolio.jpg"],
    creator: "@centimentalcomx",
  },
}

export default function PortfolioLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <PortfolioNav />
      <main style={{ flex: 1 }}>
        {children}
      </main>
      <PortfolioFooter />
    </>
  )
}

// Source: Next.js docs on metadata — https://nextjs.org/docs/app/building-your-application/optimizing/metadata
```

### Individual Portfolio Page with Metadata Override

```typescript
// app/(portfolio)/engineering/page.tsx
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Tech Stack",
  description: "Rails, system design, infrastructure, and tools I use",
  openGraph: {
    title: "Tech Stack",
    description: "Rails, system design, infrastructure, and tools I use",
    images: [{ url: "/og-engineering.jpg" }],
  },
}

export default function EngineeringPage() {
  return (
    <div className="portfolio-container">
      <h1>Engineering</h1>
      <p>Backend, frontend, infrastructure, tools...</p>
    </div>
  )
}

// Result: SEO title becomes "Rails Engineer | Tech Stack" (template + override)
// Source: Next.js docs on metadata — https://nextjs.org/docs/app/building-your-application/optimizing/metadata
```

### Shop Layout (After Migration)

```typescript
// app/(shop)/layout.tsx
import type React from "react"
import type { Metadata } from "next"
import Navigation from "@/app/components/Navigation"
import Footer from "@/app/components/Footer"

export const metadata: Metadata = {
  title: {
    template: "centimentalcomics: %s",
    default: "shop",
  },
  description: "Comics, prints, and goods",
}

export default function ShopLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <Navigation />  {/* Remove SHOP_ROUTES check — shop layout always renders shop nav */}
      <main style={{ flex: 1 }}>
        {children}
      </main>
      <Footer />  {/* Remove SHOP_ROUTES check — shop layout always renders shop footer */}
    </>
  )
}

// Note: SHOP_ROUTES conditional logic removed. This layout is exclusively for shop routes.
// Source: Next.js docs on layouts — https://nextjs.org/docs/app/building-your-application/routing/layouts-and-templates
```

### Portfolio Navigation Component

```typescript
// app/components/portfolio-navigation.tsx
'use client'

import Link from "next/link"

export default function PortfolioNav() {
  return (
    <header className="portfolio-nav-header">
      <div className="portfolio-container">
        <nav className="portfolio-nav">
          <ul className="portfolio-nav-list">
            <li>
              <Link href="/" className="portfolio-nav-link">
                home
              </Link>
            </li>
            <li>
              <Link href="/engineering" className="portfolio-nav-link">
                engineering
              </Link>
            </li>
            <li>
              <Link href="/case-studies" className="portfolio-nav-link">
                case studies
              </Link>
            </li>
            <li>
              <Link href="/resume" className="portfolio-nav-link">
                resume
              </Link>
            </li>
            <li>
              <Link href="/contact" className="portfolio-nav-link">
                contact
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  )
}

// Note: No route checking — this is only rendered from (portfolio)/layout.tsx
// Source: Next.js Link component — https://nextjs.org/docs/app/api-reference/components/link
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Global layout with route detection | Route groups with section layouts | Next.js 13+ (introduced app router) | Cleaner code, no conditional bloat, explicit layout boundaries |
| Manual meta tag injection | Next.js Metadata API | Next.js 13+ | Type-safe, cascade-aware, built-in, no duplication |
| Single stylesheet with global prefixes | Same (no change needed) | — | Tailwind + CSS still the standard. portfolio-* prefix extends existing shop-* pattern. |
| Font loading per-component | next/font/google (instance per route) | Next.js 12+ | Optimized font loading, automatic subsetting, integrated build pipeline |

**Deprecated/outdated:**
- `_app.tsx` global wrappers: Replaced by root layout.tsx (Next.js app router)
- Manual `<Head>` management: Replaced by Metadata API
- Conditional nav in global layout: Replaced by route group layouts

## Open Questions

1. **Portfolio "Home" URL**
   - What we know: CONTEXT.md mentions "portfolio landing page (could be /portfolio or similar)" and "NOT the comics root /"
   - What's unclear: Should portfolio home be at `/portfolio/` (group-visible) or `/` with special handling?
   - Recommendation: Defer to planning phase. Architecture supports both. If `/`, portfolio layout needs special case at root. If `/portfolio`, requires additional route group handling.

2. **Exact professional color palette**
   - What we know: "neutral/dark professional," "DROP pink #ec4899"
   - What's unclear: Specific hex values, accent colors, hover states
   - Recommendation: Claude's discretion in planner. Establish baseline in globals.css with portfolio-* CSS variables, finalize during implementation.

3. **Portfolio footer content**
   - What we know: Shop link should appear in portfolio footer
   - What's unclear: What else goes in portfolio footer (social links, copyright, etc.)
   - Recommendation: Claude's discretion. Minimum: shop link. Consider mirroring footer structure from comics/shop for consistency.

## Validation Architecture

Not applicable for Phase 4. Phase 4 is architectural foundation (route groups, layout separation). No behavior requirements to test.

**Phase 5-6** (content creation) will have testable requirements (SEO metadata presence, specific links, tone). Phase 4 verification is manual: navigate to portfolio URLs, confirm correct nav/footer visible, check page source for SEO tags.

## Sources

### Primary (HIGH confidence)
- **Next.js official documentation (v15.5.8)**
  - Route groups: https://nextjs.org/docs/app/building-your-application/routing/route-groups
  - Layouts: https://nextjs.org/docs/app/building-your-application/routing/layouts-and-templates
  - Metadata API: https://nextjs.org/docs/app/building-your-application/optimizing/metadata
  - usePathname hook: https://nextjs.org/docs/app/api-reference/hooks/use-pathname
- **Codebase inspection**
  - Next.js 15.5.8 in package.json verified
  - Existing Navigation.tsx shows conditional rendering pattern
  - Existing route structure shows partial route group use ((main) group exists)
  - globals.css uses shop-* prefix convention established

### Secondary (MEDIUM confidence)
- **Next.js release notes (v15.x)**: No breaking changes to route groups or metadata since v13

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - Next.js 15.5.8 verified in package.json, all libraries are production dependencies
- Architecture: HIGH - Route groups and Metadata API are stable, documented features in Next.js. Existing codebase shows partial implementation.
- Pitfalls: HIGH - Based on common Next.js adoption patterns documented in official material
- Open questions: MEDIUM - Deferred to planning phase, not blocking implementation

**Research date:** 2026-03-04
**Valid until:** 2026-04-04 (30 days — Next.js ecosystem is stable but check for v16 release announcements)

---

*Research complete. Ready for planning phase.*
