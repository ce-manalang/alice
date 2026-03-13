# Centimentalcomics

## What This Is

A professional Rails engineer portfolio at centimentalcomics.com targeting the Tokyo job market. Engineering competence is the headline — case studies, technical stack, and resume are primary. The creative/comics identity and shop become supporting layers (footer link). Built with Next.js 15 on the existing codebase.

## Core Value

Visitors (engineering managers, tech leads, CTOs in Tokyo) can quickly assess Rails engineering competence through clear case studies, structured resume, and technical documentation — if nothing else works, the case studies and resume must be compelling and accessible.

## Current Milestone: v2.0 Portfolio

**Goal:** Transform centimentalcomics.com into a Rails-focused portfolio with case studies, engineering page, resume, and contact — optimized for Tokyo hiring culture.

**Target features:**
- Homepage with professional hero, core strengths, featured case studies, timeline
- Engineering page with clear stack listing (backend, frontend, infra, tools)
- Case study pages with context, architecture, technical challenges, code quality, reflection
- Resume page (clean, structured, no illustration-heavy design)
- Contact page
- Japanese-language short intro (optional but impactful)
- Tone adjustment: precision over emotion, outcomes over ambition

## Requirements

### Validated

- ✓ Product catalog with categories (Zines, Apparel, Stationery, Pins) — v1.0
- ✓ Product detail pages with images, price, description, availability — v1.0
- ✓ Featured products on homepage — v1.0
- ✓ Shopping cart with item list, quantities, and running total — v1.0
- ✓ Cart persists across page navigation and browser refresh — v1.0
- ✓ Order form (name, contact info, items) with meetup-based fulfillment — v1.0
- ✓ Order confirmation with CC-XXXX reference and meetup instructions — v1.0
- ✓ About page with brand story and educational mission — v1.0
- ✓ FAQ page with ordering, fulfillment, and pre-order info — v1.0
- ✓ SEO metadata and Open Graph support — v1.0
- ✓ Responsive design with playful, zine-like aesthetic — v1.0
- ✓ Social media links (Instagram, Twitter) in header/footer — v1.0
- ✓ DatoCMS integration for product data via GraphQL — v1.0

### Active

- [ ] Professional homepage hero with Rails positioning and CTAs
- [ ] Core strengths section (Rails, system design, performance, deployment, maintenance)
- [ ] Featured case studies on homepage (2-3 max)
- [ ] Professional timeline (condensed)
- [ ] Engineering page with full stack listing (backend, frontend, infra, tools)
- [ ] Case study template: context, architecture, challenges, code quality, reflection
- [ ] 2-3 production case studies written
- [ ] Resume page at /resume (clean, structured)
- [ ] Contact page
- [ ] Site navigation restructure (Home, Engineering, Case Studies, Resume, Contact)
- [ ] Shop demoted to footer link
- [ ] Tone: precision over emotion, measurable outcomes, technical clarity
- [ ] Japanese-language intro section (optional)

### Out of Scope

- Online payment processing (Stripe, PayPal) — meetup-based fulfillment
- User accounts / authentication — public site
- Blog / writing section — focus on case studies for now
- CMS for case studies — hardcoded content, rarely changes
- Animation / interactive elements — clean and professional
- Multi-page resume / downloadable PDF — single page for now
- Portfolio of non-Rails work — Rails focus for Tokyo market

## Context

**Shipped v1.0** (shop) with 5,273 LOC TypeScript/CSS across 61 files.

**Tech stack:** Next.js 15 + TypeScript + Tailwind CSS + DatoCMS (GraphQL) + Zustand (cart) + Server Actions (checkout) + Supabase (orders) + Resend (email notifications)

**Existing architecture:**
- Shop lives at /shop/* routes (preserved, demoted)
- Comics pages at /[slug] routes (preserved)
- shop-* CSS prefix convention for shop styles
- Inter font scoped to shop pages

**Target audience (Tokyo market):**
- Primary: Engineering managers, Rails tech leads, CTOs at small-to-mid SaaS
- Secondary: Recruiters, HR
- Values: testing, code quality, documentation, career stability, precision

**Tone guidelines:**
- Remove: emotional writing, artistic ambiguity, abstract statements
- Add: clear outcomes, measurable impact, technical clarity
- Example: "Built and maintained production Rails applications" not "I love building meaningful software"

## Constraints

- **Tech stack**: Next.js 15 + TypeScript + Tailwind CSS (locked)
- **Content source**: DatoCMS for product data; case studies/resume hardcoded
- **Hosting**: Vercel deployment (existing setup)
- **Package manager**: pnpm
- **Shop preserved**: /shop/* routes remain functional, just demoted in nav
- **Tokyo market**: Professional tone, precision language, optional Japanese

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Rebuild from scratch | Current codebase didn't match vision | ✓ Good — clean architecture, shipped in 7 days |
| Keep Next.js/TS/Tailwind stack | Familiar stack, good for SSG/SSR shop | ✓ Good — leveraged existing knowledge |
| Order form + meetup checkout | Simplest fulfillment model, no payment integration | ✓ Good — shipped fast, validates demand |
| DatoCMS for product data | Existing integration, webhook revalidation | ✓ Good — proven pattern, cache tags work well |
| Zustand for cart state | Lightweight, built-in persist middleware | ✓ Good — simple API, localStorage sync works |
| Unified [slug] route | Handles categories and products in one route | ✓ Good — avoids Next.js dynamic segment conflicts |
| shop-* CSS prefix convention | Prevents collision with comics page styles | ✓ Good — clean separation of concerns |
| Portfolio as primary site purpose | Tokyo market values engineering competence over creative identity | — Pending |
| Case studies hardcoded (no CMS) | Content rarely changes, avoids CMS overhead | — Pending |
| Shop demoted to footer | Portfolio is primary; shop is supporting layer | — Pending |

---
*Last updated: 2026-03-04 after v2.0 milestone start*
