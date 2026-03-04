# Stack Research: Portfolio Features (v2.0 Additions)

**Domain:** Professional Rails engineer portfolio with case studies, static content, contact forms
**Researched:** 2026-03-04
**Confidence:** HIGH
**Scope:** New dependencies for portfolio pages only (not re-researching v1.0 shop stack)

---

## Executive Summary

The v2.0 portfolio requires **minimal stack additions** to the existing Next.js 15 + TypeScript + Tailwind CSS + Resend foundation. All core capabilities are already present; new features leverage existing patterns.

### What's Already Handled
- ✓ Next.js 15 App Router with Server Components
- ✓ TypeScript for type safety
- ✓ Tailwind CSS for responsive design
- ✓ Resend for email delivery (reuse for contact form)
- ✓ Server Actions for secure form submission
- ✓ DatoCMS integration (proven pattern)

### What's NEW (Minimal)
1. **Contact form validation** — React Hook Form + Zod (same pattern as checkout)
2. **Architecture diagrams** — Mermaid 11.x (optional, use when needed)
3. **Japanese typography** — Font package only, no JS
4. **Static case study content** — Use built-in `@next/mdx`, no new packages
5. **Portfolio SEO** — Use Next.js built-in JSON-LD and sitemap, no packages

**Total new dependencies: 2 core, 2 optional** (form handling mandatory, diagrams + font optional)

---

## New Dependencies Only

### Required: Form Handling

| Library | Version | Purpose | Why Recommended |
|---------|---------|---------|-----------------|
| `react-hook-form` | 7.71.x | Contact form state management | Same library used in checkout. Lightweight (8.6 KB gzipped). Integrates with Server Actions. Already familiar pattern. |
| `zod` | 3.x+ | Schema validation (client + server) | Already used in shop checkout. Single validation schema for contact form, reusable across client/server. TypeScript inference. |

**Rationale:** These are ALREADY dependencies in the existing shop. No new packages to install.

```bash
# These should already be installed from shop:
pnpm ls react-hook-form zod
```

### Optional: Architecture Diagrams

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| `mermaid` | 11.12.x | Text-based diagram rendering | Only on case study pages that need architecture diagrams. Not on homepage. |
| `react-x-mermaid` | 2.x | React component wrapper for Mermaid | Safer than raw `mermaid.run()` in Server Components. Handles SSR/SSG correctly. |

**Usage:** Only add if case studies include architecture diagrams. Safe to defer.

```bash
# Optional install:
pnpm add mermaid react-x-mermaid
```

### Optional: Japanese Typography

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| `@fontsource-variable/noto-sans-jp` | 5.x | Self-hosted variable font for Japanese | Improves Japanese text rendering and performance vs. Google Fonts CDN. Optional if not targeting Japanese readers. |

**Usage:** CSS-only import in global styles. No JavaScript overhead.

```bash
# Optional install:
pnpm add @fontsource-variable/noto-sans-jp
```

---

## What Does NOT Need New Packages

### 1. Static Case Study Content

**Option:** Use local `.mdx` files with `@next/mdx` (already built into Next.js)

```bash
# Already bundled with Next.js 15, no install needed
# Enable in next.config.js:
withMDX({
  extension: /\.mdx?$/,
})
```

**Why:** Case studies are static/rarely change. Compiling at build time is faster than runtime serialization (would need `next-mdx-remote`).

### 2. Portfolio SEO

**Option:** Use Next.js built-in metadata API + Server Components for JSON-LD

```bash
# Built-in, no packages needed
# Features available:
# - generateMetadata() API
# - Next.js metadata export (title, description, openGraph)
# - <script type="application/ld+json"> in Server Components
# - generateSitemaps() function for dynamic sitemap
```

**File structure:**
```
app/
├── sitemap.ts          # generateSitemaps() for /sitemap.xml
├── layout.tsx          # JSON-LD Person/WebSite schema
└── case-studies/
    └── [slug]/
        └── page.tsx    # JSON-LD Article schema per post
```

### 3. Contact Form Submission

**Option:** Reuse existing Resend integration + Server Actions

```typescript
// app/actions/contact.ts (same pattern as checkout)
'use server'

import { contactFormSchema } from '@/shared/schemas'
import { Resend } from 'resend'

export async function submitContact(formData: unknown) {
  const result = contactFormSchema.safeParse(formData)
  if (!result.success) {
    return { error: result.error.flatten() }
  }

  const resend = new Resend(process.env.RESEND_API_KEY)
  // Send email using existing Resend setup
}
```

**Why:** Same Resend API key already configured. No new email service needed.

---

## Installation (Full List)

```bash
# REQUIRED (if not already installed from shop):
pnpm add react-hook-form zod

# OPTIONAL (for diagrams):
pnpm add mermaid react-x-mermaid

# OPTIONAL (for Japanese typography):
pnpm add @fontsource-variable/noto-sans-jp
```

**Check existing dependencies:**
```bash
pnpm ls react-hook-form zod
# If already in package.json, skip installation
```

---

## Integration Points (v1.0 Shop → v2.0 Portfolio)

| Feature | Reuses From Shop | Portfolio Adaptation |
|---------|------------------|----------------------|
| Contact form validation | Zod schema pattern from checkout | New `contactFormSchema`, same validation approach |
| Contact form submission | Server Actions pattern from checkout | New `submitContact()` action, same Resend integration |
| Email delivery | Resend (existing API key) | Use same `RESEND_API_KEY` environment variable |
| Case study content | None (new) | Use `@next/mdx` with local `.mdx` files |
| Portfolio SEO | Next.js metadata API (already used) | New JSON-LD schemas (Person, Article, WebSite) |
| Responsive layout | Tailwind CSS (existing) | Extend with portfolio-specific utility classes |
| Typography | Tailwind font-family stack (existing) | Add Noto Sans JP to font-family fallback |

**No conflicts:** All new additions are compatible with existing shop functionality.

---

## Recommended File Structure

```
app/
├── (portfolio)/                # New portfolio route group
│   ├── layout.tsx             # Portfolio-only layout, JSON-LD schema
│   ├── page.tsx               # Homepage with hero, featured case studies
│   ├── engineering/
│   │   └── page.tsx           # Engineering stack page
│   ├── case-studies/
│   │   └── [slug]/
│   │       └── page.tsx       # Dynamic case study pages
│   ├── resume/
│   │   └── page.tsx           # Resume page
│   └── contact/
│       └── page.tsx           # Contact form page
├── actions/
│   ├── contact.ts             # NEW: submitContact() Server Action
│   └── checkout.ts            # EXISTING: submitOrder() (shop)
├── components/
│   ├── portfolio/
│   │   ├── Mermaid.tsx        # NEW: Mermaid diagram wrapper
│   │   ├── CaseStudyCard.tsx  # NEW: Featured case study card
│   │   └── ...
│   └── shop/                  # EXISTING: shop components (unchanged)
├── content/
│   └── case-studies/
│       ├── case-1.mdx         # NEW: Case study content
│       ├── case-2.mdx
│       └── ...
└── lib/
    └── schemas/
        ├── contact.ts         # NEW: Zod contactFormSchema
        └── order.ts           # EXISTING: Zod orderSchema (shop)
```

---

## Stack Additions Summary

### Core Dependencies (Likely Existing)
```json
{
  "react-hook-form": "^7.71.0",
  "zod": "^3.24.0"
}
```

### Optional Dependencies (Add as Needed)
```json
{
  "mermaid": "^11.12.0",
  "react-x-mermaid": "^2.0.0",
  "@fontsource-variable/noto-sans-jp": "^5.0.0"
}
```

### Built-in (No Installation)
```
- @next/mdx (bundled with Next.js)
- Next.js metadata API (built-in)
- Resend (already installed v0.x)
- Server Actions (built-in)
```

---

## Patterns: Portfolio-Specific

### Pattern 1: Contact Form (Server Actions + Zod)

```typescript
// lib/schemas/contact.ts
import { z } from 'zod'

export const contactFormSchema = z.object({
  name: z.string().min(1, 'Name required'),
  email: z.string().email('Invalid email'),
  message: z.string().min(10, 'Message too short'),
})

export type ContactFormData = z.infer<typeof contactFormSchema>
```

```typescript
// app/actions/contact.ts
'use server'

import { contactFormSchema } from '@/lib/schemas/contact'
import { Resend } from 'resend'

export async function submitContact(formData: unknown) {
  const result = contactFormSchema.safeParse(formData)

  if (!result.success) {
    return { error: result.error.flatten().fieldErrors }
  }

  const resend = new Resend(process.env.RESEND_API_KEY)

  try {
    await resend.emails.send({
      from: 'contact@centimentalcomics.com',
      to: result.data.email,
      replyTo: result.data.email,
      subject: `Message from ${result.data.name}`,
      html: `<p>${result.data.message}</p>`,
    })

    return { success: true }
  } catch (error) {
    return { error: 'Failed to send message' }
  }
}
```

```typescript
// app/(portfolio)/contact/page.tsx
'use client'

import { useActionState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { contactFormSchema, type ContactFormData } from '@/lib/schemas/contact'
import { submitContact } from '@/app/actions/contact'

export default function ContactPage() {
  const [state, formAction, isPending] = useActionState(submitContact, null)
  const { register, formState: { errors } } = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
  })

  return (
    <form action={formAction} className="max-w-md mx-auto">
      <input
        {...register('name')}
        placeholder="Name"
        className="w-full mb-4 p-2 border rounded"
      />
      {errors.name && <p className="text-red-500">{errors.name.message}</p>}

      <input
        {...register('email')}
        placeholder="Email"
        className="w-full mb-4 p-2 border rounded"
      />
      {errors.email && <p className="text-red-500">{errors.email.message}</p>}

      <textarea
        {...register('message')}
        placeholder="Message"
        className="w-full mb-4 p-2 border rounded"
      />
      {errors.message && <p className="text-red-500">{errors.message.message}</p>}

      <button
        type="submit"
        disabled={isPending}
        className="w-full bg-blue-600 text-white p-2 rounded disabled:opacity-50"
      >
        {isPending ? 'Sending...' : 'Send'}
      </button>

      {state?.success && <p className="text-green-600 mt-4">Message sent!</p>}
      {state?.error && <p className="text-red-600 mt-4">{state.error}</p>}
    </form>
  )
}
```

### Pattern 2: Mermaid Diagram in MDX Case Study

```jsx
// components/portfolio/Mermaid.tsx
'use client'

import { useEffect, useRef } from 'react'
import mermaid from 'mermaid'

interface MermaidProps {
  diagram: string
}

export function Mermaid({ diagram }: MermaidProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (ref.current) {
      mermaid.contentLoaded()
    }
  }, [])

  return (
    <div ref={ref} className="mermaid">
      {diagram}
    </div>
  )
}
```

```mdx
<!-- content/case-studies/rails-performance-optimization.mdx -->

---
title: Rails Performance Optimization at SaaS Startup
date: 2025-01-15
---

## Architecture

<Mermaid diagram={`
graph TD
  A[Rails API] -->|Active Job| B[Sidekiq]
  A --> C[PostgreSQL]
  A -->|Cache| D[Redis]
  E[Next.js Frontend] --> A
  B --> C
`} />

## Challenges

- Database query N+1 problems
- Slow Sidekiq job processing
- ...
```

### Pattern 3: Portfolio JSON-LD Schema

```typescript
// app/(portfolio)/layout.tsx
import { ReactNode } from 'react'

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Your Name',
  jobTitle: 'Rails Engineer',
  url: 'https://centimentalcomics.com',
  sameAs: [
    'https://github.com/yourname',
    'https://twitter.com/yourname',
  ],
}

export default function PortfolioLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {children}
    </>
  )
}
```

### Pattern 4: Case Study Page with JSON-LD

```typescript
// app/(portfolio)/case-studies/[slug]/page.tsx
import { notFound } from 'next/navigation'
import { getCaseStudy } from '@/lib/case-studies'

interface CaseStudyPageProps {
  params: { slug: string }
}

export async function generateMetadata({ params }: CaseStudyPageProps) {
  const study = getCaseStudy(params.slug)
  if (!study) return {}

  return {
    title: study.title,
    description: study.summary,
    openGraph: {
      title: study.title,
      description: study.summary,
      type: 'article',
      url: `https://centimentalcomics.com/case-studies/${params.slug}`,
    },
  }
}

export default async function CaseStudyPage({ params }: CaseStudyPageProps) {
  const study = getCaseStudy(params.slug)
  if (!study) notFound()

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: study.title,
    description: study.summary,
    author: {
      '@type': 'Person',
      name: 'Your Name',
    },
    datePublished: study.date,
    url: `https://centimentalcomics.com/case-studies/${params.slug}`,
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <article>
        <h1>{study.title}</h1>
        <p>{study.summary}</p>
        {/* Render case study content */}
      </article>
    </>
  )
}
```

### Pattern 5: Dynamic Sitemap (Next.js 15 Built-in)

```typescript
// app/sitemap.ts
import { MetadataRoute } from 'next'

export async function generateSitemaps() {
  return [{ id: 0 }]
}

export default function sitemap({ id }: { id: number }): MetadataRoute.Sitemap {
  const baseUrl = 'https://centimentalcomics.com'

  // Portfolio pages
  const portfolioPages = [
    { url: '/', priority: 1.0, changefreq: 'monthly' as const },
    { url: '/engineering', priority: 0.9, changefreq: 'monthly' as const },
    { url: '/resume', priority: 0.8, changefreq: 'monthly' as const },
    { url: '/contact', priority: 0.7, changefreq: 'yearly' as const },
  ]

  // Case study pages (from /content/case-studies)
  const caseStudies = getCaseStudies().map(study => ({
    url: `/case-studies/${study.slug}`,
    priority: 0.7,
    changefreq: 'yearly' as const,
    lastModified: new Date(study.date),
  }))

  // Shop pages (existing)
  const shopPages = [
    { url: '/shop', priority: 0.6, changefreq: 'weekly' as const },
  ]

  return [...portfolioPages, ...caseStudies, ...shopPages].map(page => ({
    url: `${baseUrl}${page.url}`,
    ...page,
  }))
}
```

---

## What NOT to Add (Portfolio-Specific)

| Avoid | Why | Use Instead |
|-------|-----|-------------|
| `next-mdx-remote` | Case studies are static/rarely change. Overkill for local `.mdx` files. | Use built-in `@next/mdx` with local files, compile at build time |
| Database for case studies | Over-engineered. Content doesn't change frequently. | Hardcode as `.mdx` files, version control alongside code |
| Sanity/Contentful CMS | Too complex for static portfolio content. Already using DatoCMS for shop. | Keep case studies as `.mdx`. Reuse DatoCMS only for shop products |
| Stripe/payment processing | Not in scope. Portfolio only. | N/A |
| Animation libraries (Framer Motion) | Professional tone requires clean, fast design. No unnecessary JS. | Use Tailwind CSS only. Precision over emotion. |
| External diagram tools (Lucidchart API) | Adds runtime complexity. Diagrams not version-controlled. | Use Mermaid text diagrams, commit to git |
| Google Fonts for Japanese | External CDN request adds latency. | Use `@fontsource-variable/noto-sans-jp` (self-hosted, variable font) |
| Context API for contact form state | Over-engineered, context causes unnecessary re-renders. | React Hook Form (already standard in checkout) |

---

## Performance Impact

| Addition | File Size | When Loaded | Impact |
|----------|-----------|-------------|--------|
| React Hook Form (8.6 KB gzipped) | Negligible | Contact page only | Minimal |
| Zod (30 KB gzipped) | Minimal | All form pages | Shared, tree-shakable |
| Mermaid (100 KB gzipped) | Moderate | Case study pages only | Not on homepage |
| Noto Sans JP variable font (200 KB) | Moderate | All portfolio pages | Pre-loaded, font-display: swap |
| JSON-LD schemas | None | All pages (inlined) | No additional request |
| Sitemap generation | None | Build time only | Static, served as file |

**Total homepage bundle increase:** ~0 KB (no new JS)
**Total portfolio pages bundle increase:** ~140 KB gzipped (form libs + diagram lib, spread across pages)

---

## Version Compatibility (Portfolio Additions)

| Package | Next.js 15 | React 19 | TypeScript 5 | Notes |
|---------|-----------|---------|--------------|-------|
| react-hook-form 7.71.x | ✓ | ✓ | ✓ | Already used in shop, no conflicts |
| zod 3.x | ✓ | ✓ | ✓ | Already used in shop, no breaking changes |
| mermaid 11.12.x | ✓ | ✓ | ✓ | Pure JS, SSR-safe with react-x-mermaid wrapper |
| react-x-mermaid 2.x | ✓ | ✓ | ✓ | Lightweight wrapper, handles SSR correctly |
| @fontsource-variable/noto-sans-jp 5.x | ✓ | ✓ | ✓ | CSS-only import, zero JS conflicts |

---

## Confidence Assessment

| Category | Level | Reason |
|----------|-------|--------|
| Form handling (RHF + Zod) | HIGH | Already proven in shop v1.0. Next.js 15 Server Actions pattern well-documented. No changes needed. |
| Case study content (@next/mdx) | HIGH | Built-in to Next.js 15. Static content compilation is standard. No new packages. |
| Contact form + Resend | HIGH | Reuses existing Resend integration. Same Server Actions pattern as checkout. |
| Mermaid diagrams | HIGH | Text-based, version-controlled, proven in production. react-x-mermaid wrapper handles SSR. |
| Japanese typography | HIGH | Fontsource variable fonts are standard practice. CSS-only, no complexity. |
| Portfolio SEO (JSON-LD, sitemap) | HIGH | Next.js built-in APIs well-documented. No new packages. Straightforward implementation. |

**Overall confidence: HIGH** — All recommendations leverage existing patterns or well-established libraries. No experimental technologies.

---

## Sources

- [Next.js Guides: MDX](https://nextjs.org/docs/app/guides/mdx)
- [Next.js Guides: JSON-LD](https://nextjs.org/docs/app/guides/json-ld)
- [Next.js API Reference: generateSitemaps](https://nextjs.org/docs/app/api-reference/functions/generate-sitemaps)
- [Next.js Guides: Forms](https://nextjs.org/docs/app/guides/forms)
- [React Hook Form Documentation](https://react-hook-form.com/)
- [React Hook Form npm Package](https://www.npmjs.com/package/react-hook-form)
- [Type-Safe Form Validation in Next.js 15: Zod, RHF, & Server Actions](https://www.abstractapi.com/guides/email-validation/type-safe-form-validation-in-next-js-15-with-zod-and-react-hook-form)
- [Using react-hook-form with React 19, useActionState, and Next.js 15 App Router](https://markus.oberlehner.net/blog/using-react-hook-form-with-react-19-use-action-state-and-next-js-15-app-router/)
- [Mermaid Official Documentation](https://mermaid.js.org/)
- [Mermaid npm Package](https://www.npmjs.com/package/mermaid)
- [react-x-mermaid GitHub](https://github.com/navdeepm20/react-x-mermaid)
- [Mermaid.js: The Code-First Approach to Technical Diagrams](https://medium.com/@vaijrb/mermaid-js-the-code-first-approach-to-technical-diagrams-6a3c4247d842)
- [Noto Sans JP - Fontsource](https://fontsource.org/fonts/noto-sans-jp)
- [Noto Sans JP Variable - npm Package](https://www.npmjs.com/package/@fontsource-variable/noto-sans-jp)
- [Best Japanese CSS font-family in 2025](https://www.bloomstreet.jp/en/best-japanese-font-setting-for-websites/)
- [Japanese Typography on the Web](https://pavellaptev.medium.com/japanese-typography-on-the-web-tips-and-tricks-981f120ad20e)
- [Next.js SEO Optimization Guide (2026 Edition)](https://www.djamware.com/post/nextjs-seo-optimization-guide-2026-edition)
- [Resend Documentation](https://resend.com)
- [React Email: Integrations - Resend](https://react.email/docs/integrations/resend)

---

*Stack research for: Professional Rails engineer portfolio (v2.0) additions*
*Researched: 2026-03-04*
*Confidence: HIGH*
