# Portfolio v2.0 Research Summary

**Project:** Professional Rails Engineer Portfolio (Tokyo Market Focus)
**Domain:** Portfolio + E-Commerce Integration (Next.js 15)
**Researched:** 2026-03-04
**Confidence:** HIGH

---

## Executive Summary

The v2.0 portfolio milestone adds a professional portfolio section to an existing Next.js 15 e-commerce shop with minimal stack additions and moderate architectural complexity. **The core challenge is integration, not implementation.** The recommended approach is to use Next.js route groups to cleanly separate portfolio and shop as distinct hierarchies, preventing route/slug conflicts while maintaining a single global layout and CSS bundle.

All core technologies already exist in the shop (Next.js 15, TypeScript, Tailwind CSS, Resend). Portfolio additions require only 2-3 form libraries (react-hook-form, zod—already in the shop) and optional diagram support (mermaid). No new data sources needed; portfolio content is hardcoded in TypeScript. The highest risks are **route conflicts between product and case study slugs**, **navigation confusion** (hiring vs. shopping context), **SEO turbulence** from shifting site primary purpose, and **tone misalignment** with Japanese hiring culture that demands precise, metrics-driven case studies.

Success depends on: (1) explicit routing architecture established in Phase 1, (2) conditional navigation showing portfolio/shop UI separately, (3) careful SEO migration planning before launch, and (4) case studies written with metrics and technical depth (no vague claims).

---

## Key Findings

### Recommended Stack

The portfolio requires **minimal stack additions** to the existing Next.js 15 + TypeScript + Tailwind + Resend foundation. All required capabilities exist.

**Core dependencies (already in shop, reuse):**
- **React Hook Form 7.71.x** — Contact form state management. Lightweight (8.6 KB gzipped), same library used in checkout, pattern proven.
- **Zod 3.x** — Schema validation for contact form. Already in shop, single validation schema reusable across client/server.
- **Next.js 15 App Router** — Portfolio pages use Server Components, static generation via `generateStaticParams`, Server Actions for contact form submission.

**Built-in capabilities (no packages needed):**
- `@next/mdx` — For optional case study markdown if needed (but TypeScript objects recommended instead).
- Next.js metadata API — JSON-LD schemas, dynamic sitemap generation, OpenGraph tags.
- Resend v0.x (existing) — Contact form email delivery, same API key.

**Optional additions (add only if needed):**
- **Mermaid 11.12.x** — Text-based architecture diagrams for case studies (100 KB gzipped, loaded only on relevant pages).
- **@fontsource-variable/noto-sans-jp 5.x** — Self-hosted variable font for Japanese text rendering (200 KB, CSS-only, no JS overhead).

**Portfolio data storage:** Hardcoded TypeScript objects in `lib/portfolio-data.ts` (no CMS needed—content is stable). Type-safe, version-controlled, no external dependencies.

**Total homepage bundle impact:** ~0 KB additional JavaScript. Portfolio pages add ~140 KB gzipped across form and diagram libraries, spread across pages (not homepage).

### Expected Features

**Must have (table stakes for credible Rails portfolio targeting Tokyo market):**
- Professional homepage with clear Rails positioning and 30-second clarity (hiring managers spend 30 seconds evaluating)
- 2-3 production case studies with context, challenges, architecture, and measurable outcomes
- Engineering/Stack page organized by layer (backend: Rails, PostgreSQL; frontend: React; DevOps: Docker, etc.)
- Single-page resume (structured, concise, no PDF)
- Contact page with email visible + contact form (low friction for recruiter outreach)
- Clear navigation (Home → Engineering → Case Studies → Resume → Contact)
- Social credibility signals (GitHub link, LinkedIn link, professional tone)

**Should have (competitive differentiators, implement in v2.1-2.x):**
- Technical depth in case studies: architecture diagrams + code examples + rationale (separates competent engineers from great ones)
- Measurable impact/outcomes: "Reduced N+1 queries by 40%" vs. "Optimized database" (Tokyo hiring emphasizes quantifiable results)
- Code quality signals: GitHub repos with visible test suite, documentation (Rails community values testing + maintainability)
- Brief Japanese language intro (optional, signals Tokyo market intent and respect for local hiring culture)
- Career progression clarity (deliberate trajectory, not job-hopping; show Rails expertise depth over breadth)
- Problem-solving narrative (show diagnosis process, options evaluated, chosen approach with tradeoff analysis)

**Defer to v3+ (scope creep, maintenance burden):**
- Blog/writing section (stale content = abandoned site; medium/dev.to links instead)
- Interactive project demos (distracts from assessment purpose)
- PDF resume download (HTML single-page with print-to-PDF better, always current)
- Animations/design flourishes (engineering portfolio ≠ design portfolio; Tokyo values simplicity)
- Testimonials (not credible on self-hosted site; LinkedIn recommendations credible instead)
- Full site multi-language support (English + light Japanese greeting sufficient, 200-300 words max)

### Architecture Approach

Use **Next.js route groups** to separate portfolio `(portfolio)` and shop `(shop)` as independent layout hierarchies sharing a single `app/layout.tsx`. This prevents route collisions, allows conditional navigation per section, and maintains single global CSS bundle with prefixed utilities (`portfolio-*` vs `shop-*`).

**Architecture structure:**
- `app/layout.tsx` — Root: metadata, providers, GTM, global styles
- `(portfolio)/layout.tsx` — Portfolio section: nav, footer, typography
- `(shop)/layout.tsx` — Shop section: existing, unchanged
- `(portfolio)/*` — Routes: `/`, `/engineering`, `/case-studies/[slug]`, `/resume`, `/contact`
- `(shop)/*` — Routes: `/shop`, `/shop/[slug]`, `/shop/about` (existing, unmoved)
- `app/lib/portfolio-data.ts` — Hardcoded case studies, resume, stack (TypeScript objects, type-safe)
- `app/lib/contact.ts` — Server Action for contact form submission + Resend email

**Key components:**
1. PortfolioNavigation — Route-aware nav showing only on portfolio pages
2. PortfolioFooter — Footer with GitHub/LinkedIn links, shop link relegated to footer
3. CaseStudyCard — Featured case study preview
4. ContactForm — Client component wrapping Server Action
5. SkillBadge — Tech stack tag component

**Patterns:**
- Static generation with `generateStaticParams()` for case study pages (known at build time)
- Server Actions for contact form (no separate API route, progressive enhancement)
- Hardcoded content in TypeScript (no CMS, version-controlled, type-safe)
- CSS prefixing (`portfolio-*`, `shop-*`) to prevent Tailwind collisions
- Route-aware conditional rendering for nav/footer (portfolio pages show portfolio nav, shop pages show shop nav)

### Critical Pitfalls

**Top 7 pitfalls identified with prevention strategies:**

1. **Route/Slug Conflicts Between Portfolio and Products** (CRITICAL)
   - Problem: Without explicit separation, case study slugs collide with product slugs (both at `[slug]`).
   - Prevention: Use route groups—products at `/shop/[slug]`, case studies at `/case-studies/[slug]`. Test matrix of case study slugs vs. existing product slugs before deployment.

2. **Navigation Confusion—Hiring vs. Shopping Context** (CRITICAL)
   - Problem: Portfolio pages display "Add to Cart" buttons or shop language, confusing hiring managers about site purpose.
   - Prevention: Implement conditional navigation logic—portfolio routes show `PortfolioNavigation`, shop routes show `ShopNavigation`. Cart icon hidden on portfolio pages.

3. **CSS/Tailwind Style Conflicts** (HIGH)
   - Problem: Shop and portfolio have different design systems. Tailwind utilities collide (h2 styling differs, responsive breakpoints conflict).
   - Prevention: Use `portfolio-*` prefix convention for all portfolio classes, maintain `shop-*` for shop. Consider CSS Modules for portfolio if conflicts persist.

4. **SEO Turbulence from Shifting Site Purpose** (HIGH)
   - Problem: Google sees site as e-commerce shop. When portfolio becomes primary, search authority redistributes; shop rankings drop 20-40% during recomputation (4-8 weeks).
   - Prevention: (a) Phase rollout—hide shop from crawl initially via `robots.txt`, monitor shop rankings in GSC, (b) Use explicit structured data (`@type: ProfilePage` for portfolio, `@type: Product` for shop), (c) Monitor GSC for 90+ days post-launch, (d) Document baseline shop rankings NOW.

5. **Tokyo Market Tone Misalignment** (HIGH)
   - Problem: Emotional language ("love building," "exciting journey") and vague outcomes ("improved performance") signal inexperience to Japanese CTOs. Precision and metrics are expected.
   - Prevention: (a) Template-driven case studies with measurable outcomes required ("Reduced p99 latency from 2400ms to 340ms"), (b) Specificity checklist before publishing (every case must have ≥1 metric, ≥1 technical decision with tradeoff, honest reflection), (c) Remove emotional language ("love," "amazing," "passion"), (d) Have Tokyo tech person review for tone.

6. **Contact Form Spam Targeting Professional Portfolio** (MEDIUM)
   - Problem: Contact form attracts recruitment spam, link-building spam, bot submissions flooding inbox.
   - Prevention: (a) Akismet API + server-side validation, (b) Rate-limiting (5 submissions/IP/day), (c) Honeypot field (hidden input to catch bots), (d) Email verification flow (real recruiters click link, bots don't).

7. **Case Study Content Too Vague or Overly Promotional** (MEDIUM)
   - Problem: "Improved reliability" without metrics, missing business context, promotional tone ("amazing team") instead of engineering rigor.
   - Prevention: Template-driven structure (context → challenge → approach → measurable results → reflection). Enforce presence of: specific metrics, business impact, technical tradeoffs, honest learnings about what didn't work.

---

## Implications for Roadmap

Based on research, recommend **4 distinct phases** with clear dependencies and milestones.

### Phase 1: Portfolio Foundation + Routing Architecture
**Rationale:** Establish routing separation before any portfolio pages written. Route conflicts will break launch if not resolved first. Navigation architecture sets tone for site identity.

**Delivers:**
- `(portfolio)` and `(shop)` route group structure (no route conflicts)
- PortfolioNavigation and PortfolioFooter components (conditional rendering based on route)
- `lib/portfolio-data.ts` skeleton with TypeScript interfaces (type-safe data structure ready)
- `lib/contact.ts` Server Action skeleton (form handling ready)
- CSS prefix convention documented and initial `portfolio-*` styles in globals.css
- SEO migration plan documented (baseline shop rankings captured in GSC)

**Addresses features:**
- Professional navigation/information architecture (table stakes)
- No route collisions with existing products

**Avoids pitfalls:**
- Route/slug conflicts (prevented by explicit `(portfolio)` and `(shop)` groups)
- Navigation confusion (conditional nav logic prevents shopping language on portfolio)
- SEO turbulence (baseline measured, migration plan ready)

**Research flag:** None—route group pattern is well-documented, standard Next.js 15 practice.

---

### Phase 2: Core Portfolio Pages + Case Study Template
**Rationale:** Write portfolio pages and establish case study template before authoring full content. Template enforces Tokyo market tone and metric requirements.

**Delivers:**
- Homepage (`/`) with hero, positioning, featured cases, timeline
- Engineering Stack page (`/engineering`) organized by layer (backend, frontend, DevOps, testing)
- Resume page (`/resume`) single-page, concise, metrics-driven
- Contact page (`/contact`) with form
- `/case-studies` grid/list page
- Case study template with required sections: context, technical challenge, approach, results (metrics), reflection
- Specificity checklist for case studies (metric requirement, tradeoff discussion, learnings)
- CSS styles for all portfolio components (`portfolio-hero`, `portfolio-nav`, `portfolio-case-card`, etc.)

**Addresses features:**
- Professional homepage (table stakes)
- Engineering/Stack page (table stakes)
- Resume page (table stakes)
- Contact form (table stakes)
- Navigation structure (table stakes)
- Template for measurable outcomes (differentiator, prevents vague claims)

**Avoids pitfalls:**
- Tokyo tone misalignment (template enforces metrics, eliminates emotional language)
- Case study vagueness (specificity checklist required before acceptance)
- Contact form spam (Akismet + rate-limiting + honeypot implemented)

**Research flag:** **Case study tone/structure** — Have someone from Tokyo tech community review first 2-3 case studies. Tokyo hiring norms differ from US; cultural review prevents tone misalignment.

---

### Phase 3: Case Studies + Dynamic Routing
**Rationale:** Write 2-3 production-quality case studies. Implement dynamic routing with static generation. Quality >> quantity; 2-3 strong cases better than 5 weak ones.

**Delivers:**
- 2-3 production case studies (Rails backend, full-stack, or DevOps focus) following template
- Each case study includes: context, technical decisions, measurable outcomes, reflection on learnings
- `/case-studies/[slug]` dynamic route with `generateStaticParams()` (all pages pre-rendered at build)
- generateMetadata per case study (OpenGraph tags for social sharing, SEO)
- Architecture diagrams in cases (optional, Mermaid if applicable; low priority if time-constrained)
- Case study content review & tone validation against Tokyo market standards

**Addresses features:**
- Case studies with technical depth (differentiator)
- Measurable impact documentation (differentiator)
- Optional: architecture diagrams (differentiator, Phase 2.1+)

**Avoids pitfalls:**
- Case study vagueness (template + review enforces specificity)
- Route collisions (route structure from Phase 1 ensures no overlaps)

**Research flag:** **Tokyo market validation** — Before shipping, have 1-2 Tokyo-based hiring managers or tech leads review cases for tone and credibility. Feedback on "does this convince you this engineer can ship?" is gold.

---

### Phase 4: Pre-Launch SEO + Contact Form Hardening
**Rationale:** Pre-launch integration testing, SEO preparation, and contact form spam filtering. Launch phase is highest-risk; prevent problems now.

**Delivers:**
- Contact form fully integrated: Resend email + Zod validation + error handling + success messages
- Akismet spam filtering + rate-limiting + honeypot field implemented and tested
- No full-page reloads when navigating between portfolio and shop (verify in dev tools)
- robots.txt strategy for phased SEO rollout (shop hidden from crawl initially, visible after stabilization)
- Google Search Console baseline captured: shop keyword rankings, shop page CTR recorded NOW
- Structured data (JSON-LD) for portfolio pages (`@type: Person`, `@type: ProfilePage`, `@type: Article` for cases)
- Canonical tags on all pages (avoid duplicate content warnings)
- Lighthouse audit on portfolio pages (performance, accessibility, SEO scores)
- Pre-launch QA: case study slug matrix tested against products, nav rendering verified on all routes, CSS conflicts resolved

**Addresses features:**
- Contact form (table stakes)
- SEO foundation (prevents migration disasters)

**Avoids pitfalls:**
- Contact form spam (Akismet + rate-limiting + honeypot)
- SEO turbulence (phased rollout, monitoring, baseline captured)
- Route/slug collisions (final validation before launch)
- Navigation confusion (nav rendering verified on all routes)

**Research flag:** None—SEO best practices are well-documented. Monitoring plan is standard practice.

---

### Phase Ordering Rationale

1. **Phase 1 first (Architecture):** Routing and navigation architecture must be locked down before portfolio content written. Moving routes after content exists creates rework risk.

2. **Phase 2 before Phase 3 (Pages before Case Studies):** Pages (home, engineering, resume, contact) establish portfolio identity. Case studies are secondary content that should fit the established structure. Template definition in Phase 2 prevents case study rework.

3. **Phase 3 before Phase 4 (Content before QA):** Case studies must exist to validate routing, test SEO, test static generation. Phase 3 produces content that Phase 4 validates.

4. **Phase 4 last (Pre-Launch):** Integration, SEO hardening, and monitoring setup happen after all content ready. Represents final validation before shipping to production.

### Research Flags

Phases needing deeper research during planning:

- **Phase 2: Tokyo market tone validation** — Have Tokyo-based senior engineer or hiring manager review proposed case study template. Tokyo and US hiring cultures differ in tone and metrics emphasis. Early validation prevents rework.

- **Phase 3: Case study content review** — First 2-3 case studies should undergo review with Tokyo market context. Feedback loop: write → review → refine → publish.

Phases with standard patterns (can proceed directly to planning, no additional research needed):

- **Phase 1: Route groups and Next.js patterns** — Well-documented, standard Next.js 15 practice. Proceed directly to design.
- **Phase 4: SEO and form validation** — Industry best practices established. Google Search Console monitoring standard. Proceed directly to implementation.

---

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Stack | HIGH | All technologies already in shop (Next.js 15, React, TypeScript, Tailwind, Resend). No experimental packages. react-hook-form + zod proven in checkout. Mermaid mature, optional. |
| Features | HIGH | Portfolio feature landscape well-researched via multiple 2026 sources. Tokyo hiring expectations validated with Japan Dev, CTO magazines, Tokyo SaaS hiring guides. Table stakes/differentiators clear. |
| Architecture | HIGH | Route groups and Next.js App Router patterns fully documented by Vercel. Static generation, Server Actions, dynamic routing all standard Next.js 15. No novel patterns. |
| Pitfalls | HIGH | Route conflicts, SEO migration, CSS collision, form spam—all well-known integration risks with documented solutions. Tokyo tone misalignment validated with cultural research. |

**Overall confidence: HIGH**

### Gaps to Address

1. **Tokyo hiring manager feedback on case study tone** — Research identifies Tokyo tone expectations, but real hiring manager validation during Phase 2 is needed. Action during Phase 2: Have 1-2 Tokyo CTOs or tech leads review case study templates and first 2-3 cases before Phase 3 completion.

2. **SEO baseline shop rankings** — Critical for measuring migration impact. Action during Phase 1: Capture shop keyword rankings in Google Search Console, export top 20 products by traffic. Use as baseline for Phase 4 monitoring.

3. **Contact form spam threshold** — Akismet configuration depends on actual spam patterns. Unknown until form deployed. Action during Phase 4: Monitor first 30 days aggressively. Adjust Akismet sensitivity and rate-limit thresholds based on real data.

4. **Route collision validation** — Theoretical risk, but must validate against actual shop data. Action during Phase 1: Export all product slugs, test against planned case study slugs. Generate matrix showing no collisions before writing any case study content.

---

## Sources

### Primary (HIGH confidence)
- **STACK-PORTFOLIO-ADDITIONS.md** — Comprehensive stack research including react-hook-form, zod, mermaid, font choices with version specificity and Next.js 15 compatibility notes
- **PORTFOLIO-FEATURES.md** — Feature landscape for Rails engineer portfolios targeting Tokyo market, including table stakes vs. differentiators, Tokyo-specific hiring signals, and competitor analysis
- **ARCHITECTURE.md** — Detailed architecture research for route groups, static generation, Server Actions, hardcoded content patterns, CSS strategy, implementation order
- **PITFALLS.md** — Critical pitfall identification: route conflicts (Strategy 1-3), navigation confusion (Strategy 1-4), CSS conflicts (Strategy 1-4), SEO migration (Strategy 1-5), Tokyo tone (Strategy 1-4), spam (Strategy 1-4), content vagueness (Strategy 1-2)

### Secondary (MEDIUM confidence, community sources)
- Next.js official docs (route groups, Server Actions, generateStaticParams)
- Resend documentation (email API, integration patterns)
- Tokyo hiring culture sources (Japan Dev, CTO Magazine, DEV Community posts on Japan work culture)
- 2026 portfolio best practices (Lovable, Elementor, Site Builder Report articles)

---

*Research synthesized: 2026-03-04*
*Status: Ready for roadmap and requirements definition*
