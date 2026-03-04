# Architecture Research: Portfolio Pages Integration

**Domain:** Rails-focused portfolio site with integrated e-commerce (Next.js)
**Researched:** 2026-03-04
**Confidence:** HIGH

---

## Executive Summary

The existing e-commerce architecture (Next.js 15 App Router, /shop/* routes) provides a solid foundation for integrating portfolio pages. The key architectural decision is whether to treat portfolio and shop as separate route hierarchies (via route groups) or nest them under a unified structure. **Recommendation: Use Next.js route groups to cleanly separate concerns while maintaining a single global layout.**

This approach:
- Creates two independent layout trees: `(portfolio)` for public pages (Home, Engineering, Case Studies, Resume, Contact) and `(shop)` for e-commerce
- Allows each section to have its own navigation, styling, and data flow without collision
- Preserves the existing /shop/* routes unchanged
- Positions Portfolio as the primary entry point (root /) while Shop remains accessible at /shop/*
- Avoids page reloads when navigating between sections (critical for UX)

**Integration complexity: Moderate.** Portfolio pages are static, hardcoded content; no new data sources needed beyond existing DatoCMS. The contact form requires a new Server Action. CSS strategy stays unified (Tailwind + globals.css) but requires new semantic prefixes (portfolio-* vs shop-*).

---

## System Overview

```
┌────────────────────────────────────────────────────────────────────┐
│                       app/ (Root Layout)                           │
│  ┌─────────────────────────────────────────────────────────────┐  │
│  │  layout.tsx (Global: Metadata, Providers, GTM)              │  │
│  │  globals.css, Tailwind, Font imports                        │  │
│  └────────┬─────────────────────────┬──────────────────────────┘  │
│           │                         │                              │
│     ┌─────▼──────────┐       ┌──────▼──────────┐                  │
│     │  (portfolio)   │       │    (shop)       │                  │
│     │  layout.tsx    │       │    layout.tsx   │                  │
│     ├────────────────┤       ├─────────────────┤                  │
│     │ Routes:        │       │ Routes:         │                  │
│     │ /              │       │ /shop           │                  │
│     │ /engineering   │       │ /shop/[slug]    │                  │
│     │ /case-studies  │       │ /shop/about     │                  │
│     │ /resume        │       │                 │                  │
│     │ /contact       │       │ Features:       │                  │
│     │                │       │ • Inter font    │                  │
│     │ Features:      │       │ • Product grid  │                  │
│     │ • System fonts │       │ • DatoCMS data  │                  │
│     │ • Static HTML  │       │ • ISR caching   │                  │
│     │ • portfolio-*  │       │ • shop-* CSS    │                  │
│     │   CSS          │       │                 │                  │
│     └────┬───────────┘       └────┬────────────┘                  │
│          │                        │                               │
│    ┌─────▼────────────┐    ┌──────▼────────────┐                 │
│    │ / (Home)         │    │ /shop (Catalog)   │                 │
│    │ • Hero section   │    │ • Product grid    │                 │
│    │ • Value props    │    │ • Categories      │                 │
│    │ • Featured cases │    │ • Filtering       │                 │
│    │ • Timeline       │    └──────┬────────────┘                 │
│    └─────┬───────────┘            │                              │
│          │                  ┌─────▼────────────┐                 │
│    ┌─────┴────────────┐    │ /shop/[slug]     │                 │
│    │ /engineering     │    │ • Product detail │                 │
│    │ • Tech stack     │    │ • Add to cart    │                 │
│    │ • By category    │    └──────┬───────────┘                 │
│    └──────────────────┘           │                              │
│                            ┌──────▼────────────┐                 │
│    ┌──────────────────┐    │ /shop/about       │                 │
│    │ /case-studies    │    │ • Brand story     │                 │
│    │ • Grid/list      │    │ • Existing        │                 │
│    │ • Filter/sort    │    └───────────────────┘                 │
│    └─────┬────────────┘                                          │
│          │                                                       │
│    ┌─────▼────────────┐    Separate Root:                       │
│    │ /case-studies/   │    /cart, /checkout                     │
│    │ [slug]           │    /faq, /about (legacy)                │
│    │ • Dynamic route  │    /[slug] (comic posts)                │
│    │ • Static gen     │                                          │
│    │ • Full detail    │                                          │
│    └──────────────────┘                                          │
│                                                                  │
│    ┌──────────────────┐                                          │
│    │ /resume          │                                          │
│    │ • Clean layout   │                                          │
│    │ • Single page    │                                          │
│    └──────────────────┘                                          │
│                                                                  │
│    ┌──────────────────┐                                          │
│    │ /contact         │                                          │
│    │ • Form + Server  │                                          │
│    │   Action         │                                          │
│    │ • Resend email   │                                          │
│    └──────────────────┘                                          │
└────────────────────────────────────────────────────────────────────┘
```

---

## Recommended Project Structure

```
app/
├── layout.tsx                      # Root: Metadata, providers, GTM/GA
├── globals.css                     # Unified Tailwind + base + prefixed styles
├── components/
│   ├── PortfolioNavigation.tsx      # NEW: Portfolio-specific nav
│   ├── PortfolioFooter.tsx          # NEW: Portfolio-specific footer
│   ├── ShopNavigation.tsx           # EXISTING: Shop nav (conditional)
│   ├── ShopFooter.tsx               # EXISTING: Shop footer (conditional)
│   ├── CaseStudyCard.tsx            # NEW: Case study preview
│   ├── SkillBadge.tsx               # NEW: Tech skill badge
│   ├── ContactForm.tsx              # NEW: Contact form + Server Action
│   └── [existing shop components]
│
├── lib/
│   ├── portfolio-data.ts            # NEW: Hardcoded case studies, resume, stack
│   ├── contact.ts                   # NEW: Contact form Server Action
│   ├── types.ts                     # MODIFIED: Add portfolio types
│   ├── constants.ts                 # MODIFIED: Add portfolio constants
│   └── [existing shop libs]
│
├── (portfolio)/                     # NEW: Route group for portfolio
│   ├── layout.tsx                   # Portfolio layout + nav/footer
│   ├── page.tsx                     # / (Homepage)
│   ├── engineering/
│   │   └── page.tsx                 # /engineering (Stack listing)
│   ├── case-studies/
│   │   ├── page.tsx                 # /case-studies (Grid)
│   │   └── [slug]/
│   │       └── page.tsx             # /case-studies/[slug] (Detail)
│   ├── resume/
│   │   └── page.tsx                 # /resume (Clean layout)
│   └── contact/
│       └── page.tsx                 # /contact (Form)
│
├── (shop)/                          # EXISTING: Route group for shop
│   ├── layout.tsx                   # Existing shop layout
│   ├── page.tsx                     # /shop
│   ├── [slug]/                      # /shop/[slug] (Product detail)
│   ├── about/                       # /shop/about
│   └── [other shop routes]
│
├── cart/                            # EXISTING: Root-level (not in group)
├── checkout/                        # EXISTING: Root-level
├── faq/                             # EXISTING: Root-level
├── about/                           # EXISTING: Legacy comics page
├── [slug]/                          # EXISTING: Comic posts
│
├── api/
│   ├── cart-products/               # EXISTING
│   └── [other endpoints]
│
└── [metadata routes: robots, sitemap, not-found, etc.]
```

**Key rationale:**

- **Route groups**: `(portfolio)` and `(shop)` cleanly separate concerns. Routes nested under them don't include the group name in the URL: `(portfolio)/page.tsx` → `/`, not `/portfolio`.
- **Single root layout**: All routes share `app/layout.tsx` for metadata, providers, and global styles. No full page reloads between portfolio and shop.
- **Portfolio layout**: Defines portfolio-specific navigation and footer. Renders only for portfolio routes.
- **Shop layout**: Existing; unchanged. Renders only for /shop/* routes.
- **Hardcoded data**: Case studies, resume, and stack are in `lib/portfolio-data.ts` (no CMS needed; content rarely changes).
- **Contact form**: Server Action in `lib/contact.ts` handles submission and Resend email.
- **CSS strategy**: Single `globals.css` with `portfolio-*` and `shop-*` prefixes to prevent collisions.

---

## Navigation & Layout Strategy

### Navigation Hierarchy

**Portfolio (Primary):**
```
Home → Engineering → Case Studies → Resume → Contact
                                            ↓
                                   Shop (footer link)
```

**Shop (Secondary, demoted):**
```
Accessible at /shop, linked from portfolio footer
Shop → Categories → Product Detail → Cart → Checkout
```

### Implementation Pattern

```typescript
// app/(portfolio)/layout.tsx
'use client'

import PortfolioNavigation from '@/app/components/PortfolioNavigation'
import PortfolioFooter from '@/app/components/PortfolioFooter'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: { template: '%s | centimentalcomics', default: 'centimentalcomics' },
  description: 'Rails engineer portfolio with case studies, technical stack, and resume.',
}

export default function PortfolioLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <PortfolioNavigation />
      <main>{children}</main>
      <PortfolioFooter />
    </>
  )
}

// app/components/PortfolioNavigation.tsx
'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function PortfolioNavigation() {
  const pathname = usePathname()

  // Show on portfolio routes only (not /shop/*, /cart, /checkout, etc.)
  const isPortfolioRoute = !pathname.startsWith('/shop') &&
                           !pathname.startsWith('/cart') &&
                           !pathname.startsWith('/checkout') &&
                           !pathname.startsWith('/faq')

  if (!isPortfolioRoute) return null

  return (
    <nav className="portfolio-nav">
      <Link href="/">centimentalcomics</Link>
      <ul>
        <li><Link href="/">home</Link></li>
        <li><Link href="/engineering">engineering</Link></li>
        <li><Link href="/case-studies">case studies</Link></li>
        <li><Link href="/resume">resume</Link></li>
        <li><Link href="/contact">contact</Link></li>
      </ul>
    </nav>
  )
}

// app/components/PortfolioFooter.tsx
'use client'

import { usePathname } from 'next/navigation'

export default function PortfolioFooter() {
  const pathname = usePathname()

  // Same conditional logic as nav
  const isPortfolioRoute = !pathname.startsWith('/shop') &&
                           !pathname.startsWith('/cart') &&
                           !pathname.startsWith('/checkout')

  if (!isPortfolioRoute) return null

  return (
    <footer className="portfolio-footer">
      <div className="footer-links">
        <a href="https://github.com/..." target="_blank">github</a>
        <a href="https://linkedin.com/..." target="_blank">linkedin</a>
        <a href="/shop">shop</a>
      </div>
      <p>&copy; 2025 centimentalcomics · made in ph</p>
    </footer>
  )
}
```

### Font Strategy

**Portfolio pages:** System fonts (default, clean, professional)
```css
font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
```

**Shop pages:** Inter font (existing, brand-aligned)
```
fontFamily: "'Inter', system-ui, sans-serif"
```

**How to implement:**
- Portfolio: Use Tailwind's default `font-sans` (system fonts)
- Shop: Existing inline styles (no change needed)
- No global font switching: Let route groups handle layout separation

---

## CSS Strategy: Portfolio + Shop Coexistence

### Prefix Convention

All CSS classes use semantic prefixes to avoid collisions:

| Prefix | Used By | Examples |
|--------|---------|----------|
| `.portfolio-*` | Portfolio pages | `.portfolio-hero`, `.portfolio-nav`, `.portfolio-case-card` |
| `.shop-*` | Shop pages (existing) | `.shop-container`, `.shop-product-card` |
| `.u-*` | Utilities (shared) | `.u-text-center`, `.u-flex` |

### CSS Organization in globals.css

```css
/* Fonts */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
@import url("...other font imports...");

/* Base + Tailwind */
@import url("../public/assets/css/normalize.css");
@import url('../public/assets/css/skeleton.css');
@import url('../public/assets/css/custom.css');

/* === PORTFOLIO STYLES === */
.portfolio-nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border-bottom: 1px solid #e5e7eb;
}

.portfolio-hero {
  padding: clamp(3rem, 10vw, 8rem) 0;
  font-size: clamp(1.5rem, 5vw, 3rem);
  line-height: 1.1;
}

.portfolio-case-card {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 1.5rem;
  transition: transform 0.2s, box-shadow 0.2s;
}

.portfolio-case-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

/* === SHOP STYLES (EXISTING, UNCHANGED) === */
.shop-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

.shop-product-card {
  /* existing styles */
}

/* === SHARED UTILITIES === */
.u-text-center { text-align: center; }
.u-flex { display: flex; }
.u-flex-col { flex-direction: column; }
```

### Why Single Tailwind Config?

- **Shared design tokens**: Both portfolio and shop use colors, spacing, typography from same theme
- **No CSS duplication**: Single stylesheet vs. separate bundles
- **Prefix prevention**: `portfolio-*` and `shop-*` prevent naming collisions
- **Simplicity**: No content-based scoping complexity

---

## Architectural Patterns

### Pattern 1: Route Groups for Multi-Layout Architecture

**What:** Use Next.js `(group-name)` folders to create independent layout hierarchies without affecting URLs.

**When to use:**
- Multiple sections with different layouts, navigation, or styling
- Sections should not reload when navigating between them
- Keep URLs clean (no `/portfolio/case-studies`, just `/case-studies`)

**Trade-offs:**

| Pros | Cons |
|------|------|
| Clean separation | Slight folder structure complexity |
| No full page reloads | Route-aware components needed for nav/footer |
| Single root layout | N/A |

**Example:**
```
(portfolio)/case-studies/[slug]/page.tsx  → URL: /case-studies/[slug]
(shop)/[slug]/page.tsx                    → URL: /shop/[slug]
```

No collision because route groups don't contribute to the URL.

### Pattern 2: Static Generation + generateStaticParams

**What:** Pre-render all case study pages at build time using `generateStaticParams`.

**When to use:**
- Content rarely changes (hardcoded in `lib/portfolio-data.ts`)
- Small number of pages (2-5 case studies initially)
- Want instant page loads and SEO optimization

**Implementation:**
```typescript
// app/(portfolio)/case-studies/[slug]/page.tsx

import { getCaseStudy, getAllCaseSlugs } from '@/app/lib/portfolio-data'
import { notFound } from 'next/navigation'

export async function generateStaticParams() {
  const slugs = getAllCaseSlugs()
  return slugs.map(slug => ({ slug }))
}

export async function generateMetadata({ params }) {
  const { slug } = await params
  const caseStudy = getCaseStudy(slug)

  if (!caseStudy) {
    return { title: 'Not Found' }
  }

  return {
    title: caseStudy.title,
    description: caseStudy.summary,
    openGraph: {
      title: caseStudy.title,
      description: caseStudy.summary,
      url: `/case-studies/${slug}`,
    },
  }
}

export default async function CaseStudyPage({ params }) {
  const { slug } = await params
  const caseStudy = getCaseStudy(slug)

  if (!caseStudy) {
    notFound()
  }

  return <CaseStudyDetail caseStudy={caseStudy} />
}
```

**Benefits:**
- Build-time validation (Next.js errors if dynamic content is used)
- Fast delivery (static HTML, no server processing)
- SEO-friendly (all pages crawlable)

### Pattern 3: Server Actions for Contact Form

**What:** Use React Server Actions to handle form submission without a separate API route.

**When to use:**
- Simple form (name, email, message)
- No complex client-side state needed
- Want progressive enhancement (works without JS)
- Need server-side validation and email sending

**Implementation:**
```typescript
// app/lib/contact.ts

'use server'

import { z } from 'zod'
import { Resend } from 'resend'

const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
})

const resend = new Resend(process.env.RESEND_API_KEY)

export async function submitContact(formData: FormData) {
  const data = Object.fromEntries(formData)

  try {
    const validated = contactSchema.parse(data)

    const result = await resend.emails.send({
      from: 'contact@centimentalcomics.com',
      to: process.env.CONTACT_EMAIL_TO || 'you@example.com',
      subject: `New contact from ${validated.name}`,
      html: `
        <h2>New Contact Submission</h2>
        <p><strong>Name:</strong> ${validated.name}</p>
        <p><strong>Email:</strong> ${validated.email}</p>
        <h3>Message:</h3>
        <p>${validated.message.replace(/\n/g, '<br>')}</p>
      `,
    })

    if (result.error) {
      return { error: 'Failed to send email. Please try again.' }
    }

    return { success: true }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { error: error.errors[0].message }
    }
    return { error: 'An unexpected error occurred.' }
  }
}

// app/components/ContactForm.tsx

'use client'

import { submitContact } from '@/app/lib/contact'
import { useActionState } from 'react'

export default function ContactForm() {
  const [state, formAction] = useActionState(submitContact, null)

  return (
    <form action={formAction} className="portfolio-contact-form">
      <div>
        <label htmlFor="name">Name</label>
        <input id="name" name="name" type="text" required />
      </div>

      <div>
        <label htmlFor="email">Email</label>
        <input id="email" name="email" type="email" required />
      </div>

      <div>
        <label htmlFor="message">Message</label>
        <textarea id="message" name="message" required />
      </div>

      <button type="submit">Send</button>

      {state?.error && <p className="error">{state.error}</p>}
      {state?.success && <p className="success">Message sent successfully!</p>}
    </form>
  )
}
```

**Benefits:**
- Simpler than API route
- Progressive enhancement: works without JavaScript
- Server-side validation built-in
- No client-side state management needed

### Pattern 4: Hardcoded Portfolio Data with Type Safety

**What:** Store case studies, resume, and stack data in TypeScript, not a CMS.

**When to use:**
- Content is stable and rarely updated
- Small data volume (few case studies, single resume)
- Want type safety and no external dependencies

**Implementation:**
```typescript
// app/lib/portfolio-data.ts

export interface CaseStudy {
  slug: string
  title: string
  category: 'backend' | 'fullstack' | 'devops' | 'infra'
  summary: string
  context: string // Problem/situation
  architecture: string // Solution approach
  challenges: string[] // Technical obstacles
  outcomes: string[] // Results/metrics
  technologies: string[] // Tech stack used
  codeLink?: string // GitHub link
  reflection: string // Lessons learned
}

export interface TechCategory {
  name: string
  description: string
  items: string[]
}

export const caseStudies: CaseStudy[] = [
  {
    slug: 'rails-api-optimization',
    title: 'Rails API Performance Optimization',
    category: 'backend',
    summary: 'Reduced API latency from 800ms to 200ms through caching and query optimization.',
    context: 'SaaS platform with 10K DAU. Product listing endpoint was slow, impacting user experience.',
    architecture: 'Implemented Redis caching layer, optimized SQL queries with eager loading, added background jobs for batch operations.',
    challenges: [
      'N+1 queries in product listing',
      'Cache invalidation complexity',
      'Memory constraints on shared hosting',
    ],
    outcomes: [
      'P95 latency: 800ms → 200ms (75% reduction)',
      'Throughput: 50 req/s → 200 req/s (4x improvement)',
      'Database CPU load: 60% → 20%',
    ],
    technologies: ['Rails 7', 'PostgreSQL', 'Redis', 'Sidekiq'],
    reflection: 'Started with profiling before optimizing. Learned that premature optimization wastes time. Observability first.',
  },
  // ... more case studies
]

export const engineeringStack: Record<string, TechCategory> = {
  backend: {
    name: 'Backend',
    description: 'Server-side web development and APIs',
    items: ['Rails 6+', 'PostgreSQL', 'Redis', 'Sidekiq', 'GraphQL'],
  },
  frontend: {
    name: 'Frontend',
    description: 'Client-side UI and interactions',
    items: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS'],
  },
  devops: {
    name: 'DevOps & Infrastructure',
    description: 'Deployment, monitoring, and infrastructure',
    items: ['Docker', 'Kubernetes', 'AWS', 'Vercel', 'GitHub Actions'],
  },
  testing: {
    name: 'Testing & QA',
    description: 'Code quality and reliability',
    items: ['RSpec', 'Jest', 'E2E Testing', 'Load Testing'],
  },
}

export const resume = {
  summary: 'Senior Rails engineer with 8+ years experience...',
  experience: [
    {
      title: 'Senior Rails Engineer',
      company: 'Startup XYZ',
      date: '2021 – Present',
      description: [
        'Led backend architecture for 10K+ user SaaS platform',
        'Mentored 3 junior engineers on testing and performance',
        'Reduced API latency by 60% through optimization',
      ],
    },
    // ... more positions
  ],
  education: [
    {
      title: 'BS Computer Science',
      company: 'University Name',
      date: '2015',
    },
  ],
}

export function getCaseStudy(slug: string): CaseStudy | null {
  return caseStudies.find(cs => cs.slug === slug) ?? null
}

export function getAllCaseSlugs(): string[] {
  return caseStudies.map(cs => cs.slug)
}
```

---

## Data Flow

### Portfolio Data (Static at Build-Time)

```
portfolio-data.ts (TypeScript objects)
        ↓
   (import)
        ↓
Page component (page.tsx)
        ↓
   (render)
        ↓
Static HTML (generated at next build)
        ↓
Served by CDN/Vercel
```

**Key property:** No runtime fetching. Content known at build time. Changes require redeploy.

### Contact Form (Server Action)

```
User fills form (client)
        ↓
Form submission (form action)
        ↓
Server Action (lib/contact.ts)
        ↓
Zod validation
        ↓
Resend API call
        ↓
Email delivered
        ↓
Response sent to client (success/error)
```

**Key property:** No separate API route. Validation and email handling in Server Action.

### Shop Data (Existing, Unchanged)

```
DatoCMS (GraphQL API)
        ↓
datocmsRequest() (lib/datocms.ts)
        ↓
Page/API route (shop pages)
        ↓
ProductGrid component
        ↓
Product cards
```

**No changes needed.**

---

## Integration Points

### New Components

| Component | Purpose | Location |
|-----------|---------|----------|
| PortfolioNavigation | Navigation for portfolio pages | components/PortfolioNavigation.tsx |
| PortfolioFooter | Footer for portfolio pages | components/PortfolioFooter.tsx |
| CaseStudyCard | Preview card for case studies | components/CaseStudyCard.tsx |
| SkillBadge | Tech skill/stack badge | components/SkillBadge.tsx |
| ContactForm | Contact form with Server Action | components/ContactForm.tsx |
| (portfolio)/layout | Portfolio section layout | (portfolio)/layout.tsx |

### New Data Files

| File | Purpose |
|------|---------|
| lib/portfolio-data.ts | Hardcoded case studies, resume, engineering stack |
| lib/contact.ts | Contact form Server Action |

### New Pages

| Route | File | Purpose |
|-------|------|---------|
| / | (portfolio)/page.tsx | Homepage with hero and featured content |
| /engineering | (portfolio)/engineering/page.tsx | Tech stack listing |
| /case-studies | (portfolio)/case-studies/page.tsx | Case studies grid/list |
| /case-studies/[slug] | (portfolio)/case-studies/[slug]/page.tsx | Case study detail |
| /resume | (portfolio)/resume/page.tsx | Resume page |
| /contact | (portfolio)/contact/page.tsx | Contact form |

### Modified Files

| File | Changes |
|------|---------|
| app/layout.tsx | Add route-aware Navigation/Footer rendering |
| app/globals.css | Add portfolio-* CSS classes |
| app/lib/types.ts | Add CaseStudy, TechCategory, Resume types |
| app/lib/constants.ts | Add portfolio constants if needed |

### Data Sources

| Data | Source | Freshness |
|------|--------|-----------|
| Case studies | lib/portfolio-data.ts | Deploy-time |
| Resume | lib/portfolio-data.ts | Deploy-time |
| Engineering stack | lib/portfolio-data.ts | Deploy-time |
| Products (shop) | DatoCMS GraphQL | ISR (3600s) |
| Contact submissions | Resend email | On-demand |

---

## Metadata & SEO Strategy

### Root Metadata

```typescript
// app/layout.tsx

export const metadata: Metadata = {
  title: {
    template: 'centimentalcomics: %s',
    default: 'centimentalcomics'
  },
  description: 'Rails engineer portfolio with case studies, technical expertise, and resume.',
  keywords: ['rails', 'engineer', 'portfolio', 'case studies', 'backend'],
  authors: [{ name: 'ce manalang' }],
  openGraph: {
    type: 'website',
    url: 'https://centimentalcomics.com',
    title: 'centimentalcomics',
    description: 'Rails engineer portfolio.',
    images: [{
      url: '/assets/images/og-image.jpg',
      width: 1200,
      height: 630
    }],
  },
  robots: { index: true, follow: true },
  metadataBase: new URL('https://centimentalcomics.com'),
}
```

### Portfolio Page Metadata

```typescript
// app/(portfolio)/page.tsx
export const metadata: Metadata = {
  title: 'Rails Engineer Portfolio',
  description: 'Professional Rails engineer portfolio with case studies, technical expertise, and resume.',
  alternates: { canonical: '/' },
  openGraph: {
    title: 'centimentalcomics — Rails Engineer',
    description: 'Professional Rails engineer portfolio.',
  },
}

// app/(portfolio)/case-studies/[slug]/page.tsx
export async function generateMetadata({ params }) {
  const { slug } = await params
  const caseStudy = getCaseStudy(slug)

  if (!caseStudy) {
    return { title: 'Not Found' }
  }

  return {
    title: caseStudy.title,
    description: caseStudy.summary,
    openGraph: {
      title: caseStudy.title,
      description: caseStudy.summary,
      url: `/case-studies/${slug}`,
    },
  }
}
```

---

## Suggested Implementation Order

### Phase 1: Foundation (Days 1-2)

1. Create `(portfolio)` route group folder structure
2. Create `(portfolio)/layout.tsx` with PortfolioNavigation and PortfolioFooter
3. Create portfolio components: Navigation, Footer, CaseStudyCard, SkillBadge, ContactForm
4. Create `lib/portfolio-data.ts` with TypeScript interfaces and stub data
5. Create `lib/contact.ts` Server Action (stub)

### Phase 2: Core Pages (Days 3-5)

6. Create portfolio pages: `page.tsx`, `/engineering/page.tsx`, `/resume/page.tsx`, `/contact/page.tsx`
7. Add content to `portfolio-data.ts`: case studies, resume, engineering stack
8. Style with `portfolio-*` CSS classes in globals.css
9. Test static generation: `next build`

### Phase 3: Case Studies (Days 6-7)

10. Create `/case-studies/page.tsx` (grid/list)
11. Create `/case-studies/[slug]/page.tsx` with `generateStaticParams`
12. Write 2-3 production case studies
13. Test dynamic routing and metadata

### Phase 4: Polish & Integration (Days 8-10)

14. Implement contact form Server Action (submitContact)
15. Test Resend email integration
16. Add error handling and success messages
17. Verify no full page reloads between portfolio and shop
18. Deploy to Vercel and test production

---

## Anti-Patterns to Avoid

### Anti-Pattern 1: Multiple Root Layouts

**Don't:**
```typescript
// app/(portfolio)/layout.tsx
export const metadata = { ... } // ❌ Can't export metadata

// app/(shop)/layout.tsx
export const metadata = { ... } // ❌ Conflict!
```

**Do:** Single `app/layout.tsx` exports metadata. Nested layouts in route groups don't export metadata.

---

### Anti-Pattern 2: Fetching Static Content from CMS

**Don't:**
```typescript
export default async function ResumePage() {
  const resume = await fetch('https://api.datocms.com/resume')
  return <Resume data={resume} />
}
```

**Do:**
```typescript
import { resume } from '@/app/lib/portfolio-data'

export default function ResumePage() {
  return <Resume data={resume} />
}
```

---

### Anti-Pattern 3: Client Hooks in Server Components

**Don't:**
```typescript
export default async function ContactForm() {
  const [sent, setSent] = useState(false) // ❌ Can't use hooks here
  return <form>...</form>
}
```

**Do:**
```typescript
'use client' // Mark as client component

export default function ContactForm() {
  const [sent, setSent] = useState(false) // ✓ OK in client component
  return <form action={submitContact}>...</form>
}
```

---

### Anti-Pattern 4: Navigation Triggering Full Page Reloads

**Don't:**
Create separate root layouts that trigger page reloads when switching between them.

**Do:**
Use route groups with single `app/layout.tsx`. Next.js keeps the root layout in the DOM.

---

### Anti-Pattern 5: Inline Styles for Responsive Design

**Don't:**
```typescript
<div style={{ fontSize: '1rem', paddingTop: '2rem' }} />
```

**Do:**
```css
.portfolio-hero {
  padding: clamp(2rem, 5vw, 5rem) 0;
  font-size: clamp(1.5rem, 5vw, 3rem);
}
```

---

## Scaling Considerations

| Scale | Action | Notes |
|-------|--------|-------|
| **0–100 users** | No changes | Vercel free tier handles both portfolio and shop. |
| **100–1k users** | Monitor build times | Case studies still few. Static generation is fast. |
| **1k–10k users** | Consider pagination | If case studies grow to 30+, add pagination or categories. |
| **10k+ users** | Separate portfolio site | Move shop to separate domain/repo if builds become slow. |

---

## Implementation Checklist

- [ ] Create `(portfolio)` route group folder
- [ ] Create `(portfolio)/layout.tsx`
- [ ] Create portfolio components (Navigation, Footer, CaseStudyCard, SkillBadge, ContactForm)
- [ ] Create `lib/portfolio-data.ts` with types and initial data
- [ ] Create `lib/contact.ts` Server Action
- [ ] Create portfolio pages (/, /engineering, /resume, /contact)
- [ ] Create case study pages (/case-studies, /case-studies/[slug])
- [ ] Add `portfolio-*` CSS to globals.css
- [ ] Test `next build` (static generation)
- [ ] Test navigation (no full page reloads)
- [ ] Implement contact form Server Action
- [ ] Test Resend email delivery
- [ ] Deploy to Vercel
- [ ] Verify on production

---

## Sources

- [Next.js 15 Route Groups](https://nextjs.org/docs/app/api-reference/file-conventions/route-groups)
- [Next.js Layouts and Pages](https://nextjs.org/docs/app/getting-started/layouts-and-pages)
- [Next.js Dynamic Routes with generateStaticParams](https://nextjs.org/docs/app/api-reference/functions/generate-static-params)
- [Next.js ISR (Incremental Static Regeneration)](https://nextjs.org/docs/app/guides/incremental-static-regeneration)
- [Next.js Server Actions and Forms](https://nextjs.org/docs/app/guides/forms)
- [Next.js 15 Blog](https://nextjs.org/blog/next-15)

---

*Architecture research for: Rails-focused portfolio site with integrated e-commerce*
*Researched: 2026-03-04*
*Confidence: HIGH*
