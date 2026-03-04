# Portfolio Stack: Decision Summary

**Date:** 2026-03-04
**For:** v2.0 Portfolio milestone (Rails engineer portfolio with case studies)

---

## The Question

What stack additions/changes are needed for a professional Rails engineer portfolio with case study pages, engineering stack page, resume page, and contact form? Considerations: static content rendering, optional architecture diagrams (Mermaid/SVG), contact form handling, SEO for portfolio sites, Japanese text rendering.

## The Answer (TL;DR)

**NO major changes. Add 2 libraries (probably already installed):**

```bash
# These should already be in package.json from shop:
pnpm add react-hook-form zod

# Optional (only if case studies have architecture diagrams):
pnpm add mermaid react-x-mermaid

# Optional (for Japanese section):
pnpm add @fontsource-variable/noto-sans-jp
```

**Everything else uses existing Next.js 15 capabilities:**
- Static content: Use `@next/mdx` (built-in)
- Contact form: Reuse Server Actions + Resend (proven pattern)
- SEO: Use Next.js JSON-LD + sitemap APIs (built-in)
- Japanese fonts: CSS-only configuration

---

## Why Minimal Changes

1. **Contact form = checkout form pattern**
   Checkout already uses Server Actions + Zod validation. Portfolio contact form uses identical approach. React Hook Form handles the UI.

2. **Static case studies = build-time content**
   Case studies written as `.mdx` files. Compiled at build time by `@next/mdx`. No runtime complexity like `next-mdx-remote`.

3. **SEO = built-in to Next.js 15**
   JSON-LD, sitemap, robots.txt all generated via Server Components and Next.js APIs. No package needed.

4. **Japanese text = font-stack CSS**
   Variable font package is optional. Core rendering works with system fonts; Noto Sans JP improves aesthetics/consistency for Tokyo market.

---

## Stack Comparison: Shop vs. Portfolio

### What's Shared (No Changes)
```
Next.js 15 ✓
TypeScript 5.x ✓
Tailwind CSS 4 ✓
Resend (email) ✓
Server Actions ✓
React Hook Form ✓
Zod (validation) ✓
```

### What's New (Minimal)
```
Mermaid 11.x (optional, diagrams only)
react-x-mermaid 2.x (optional, diagram wrapper)
@fontsource-variable/noto-sans-jp (optional, typography)
```

### What's Built-in (Zero Install)
```
@next/mdx (case studies)
Next.js JSON-LD API (portfolio SEO)
Next.js sitemap API (search indexing)
Server Components (schema markup)
```

---

## Specific Recommendations

### Contact Form
- **Library:** React Hook Form 7.71.x (already have) + Zod 3.x (already have)
- **Pattern:** Server Action + Resend (same as checkout)
- **Effort:** 2 hours (reuse checkout pattern)

### Case Studies
- **Format:** `.mdx` files in `/content/case-studies/`
- **Library:** `@next/mdx` (built-in, no install)
- **Rendering:** Static at build time, revalidate on redeploy
- **Effort:** 4 hours per case study (writing content)

### Architecture Diagrams
- **Library:** Mermaid 11.12.x + react-x-mermaid 2.x (optional)
- **Usage:** Embed in case study `.mdx` via `<Mermaid>` component
- **Fallback:** Use PNG/SVG if adding Mermaid feels like scope creep
- **Effort:** 30 minutes (component wrapper) + 15 min per diagram

### Portfolio SEO
- **JSON-LD:** Schema.org Person + Article (Server Components, no package)
- **Sitemap:** `app/sitemap.ts` with `generateSitemaps()` (built-in)
- **Metadata:** Next.js `generateMetadata()` API (built-in)
- **Effort:** 3 hours (setup once, reusable)

### Japanese Typography
- **Recommendation:** `@fontsource-variable/noto-sans-jp` (optional)
- **Why:** Performance (variable font = 1 file vs. 5). Self-hosted (no CDN). Professional appearance.
- **Fallback:** System font stack works fine without it
- **Effort:** 15 minutes (CSS import + font-family)

---

## Installation Order

### Phase 1: Prerequisite Check (5 min)
```bash
pnpm ls react-hook-form zod
# If not installed, add them
pnpm add react-hook-form zod
```

### Phase 2: Core Portfolio (Mandatory, no new packages)
- ✓ Set up `/content/case-studies/` directory
- ✓ Create first `.mdx` case study file
- ✓ Build `CaseStudyPage` component
- ✓ Create `submitContact()` Server Action
- ✓ Add JSON-LD schemas to layout
- ✓ Create `app/sitemap.ts`

### Phase 3: Optional Enhancements (Pick as needed)
- Optional: Add `mermaid` + `react-x-mermaid` if case studies need diagrams
- Optional: Add `@fontsource-variable/noto-sans-jp` if targeting Japanese readers

---

## Implementation Confidence

| Feature | Confidence | Risk Level |
|---------|-----------|-----------|
| Contact form (RHF + Zod + Server Actions) | HIGH | LOW — Exact pattern used in shop v1.0 |
| Case studies (MDX static content) | HIGH | LOW — Standard Next.js pattern, compile-time |
| Portfolio SEO (JSON-LD + sitemap) | HIGH | LOW — Built-in APIs, straightforward |
| Mermaid diagrams (optional) | HIGH | LOW — Stable library, optional feature |
| Japanese typography (optional) | HIGH | LOW — Pure CSS, no runtime risk |

**Overall:** This is a low-risk stack addition. No experimental features, no unproven libraries, no breaking changes to shop.

---

## What NOT to Do

| Avoid | Why | Impact if Done |
|-------|-----|---------|
| ~~Use `next-mdx-remote`~~ | Unnecessary for static content. Adds runtime serialization overhead. | +100ms page load time |
| ~~Build CMS for case studies~~ | Over-engineered. Content changes rarely. | +5 hours setup, ongoing maintenance burden |
| ~~Use Stripe/payment~~ | Out of scope. Shop is separate. | Scope creep, distraction |
| ~~Animate portfolio~~ | Professional tone requires clean design. | Performance penalty, unprofessional appearance |
| ~~Google Fonts for Japanese~~ | CDN latency + variable font saves bandwidth. | Slower load, worse UX in Tokyo |
| ~~Multiple validation libraries~~ | Zod is already the standard. Mixing approaches = maintenance burden. | Technical debt |

---

## Deployment Checklist

- [ ] React Hook Form + Zod installed (check package.json)
- [ ] Contact form Server Action created with Resend integration
- [ ] Zod schema exported for client/server validation
- [ ] Mermaid library added (if using diagrams)
- [ ] Mermaid component wrapper created (if using diagrams)
- [ ] Case study `.mdx` files created in `/content/case-studies/`
- [ ] Case study page route created with dynamic slug
- [ ] JSON-LD Person schema added to portfolio layout
- [ ] JSON-LD Article schema added to case study pages
- [ ] `app/sitemap.ts` created with `generateSitemaps()`
- [ ] Japanese font package added to CSS (if targeting Japanese readers)
- [ ] Contact page linked from navigation
- [ ] Case studies featured on homepage
- [ ] Engineering page lists tech stack
- [ ] Resume page displays cleanly
- [ ] SEO metadata verified (title, description, OG image)
- [ ] Core Web Vitals tested (Lighthouse)
- [ ] Vercel deployment configured with env vars

---

## File Reference

**Primary research:** `/Volumes/Workspace/weekend/alice/.planning/research/STACK-PORTFOLIO-ADDITIONS.md`

Contains:
- Detailed dependency analysis
- Full implementation patterns (code examples)
- Integration points with shop v1.0
- Performance impact analysis
- Version compatibility matrix
- Confidence assessment by feature

---

## Recommendation: Quick Start Approach

1. **Start with contact form** (2 hours)
   - Reuse React Hook Form + Zod patterns
   - Connect to existing Resend setup
   - Test form submission

2. **Add one case study** (4 hours)
   - Write `.mdx` file
   - Build CaseStudyPage component
   - Test static rendering and deployment

3. **Add portfolio SEO** (3 hours)
   - JSON-LD schemas
   - Sitemap generation
   - Metadata API

4. **Defer optional features** (later)
   - Mermaid diagrams (only if case studies need them)
   - Japanese font (only if targeting Japanese readers)

**Total MVP effort:** ~9 hours (5-6 hours code, rest writing case studies)

---

*Portfolio stack research — v2.0 milestone*
*Generated: 2026-03-04*
