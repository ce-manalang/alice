# Centimentalcomics Shop

## What This Is

An online store for centimentalcomics (shop.centimentalcomics.com) selling educational zines about computer science concepts, along with apparel, stationery, pins, and accessories. Features a complete browse-to-order flow with product catalog, shopping cart, and meetup-based checkout. The shop makes technical topics approachable and fun for ages 8-100, with a playful illustrated aesthetic.

## Core Value

Customers can browse the product catalog and submit orders for educational CS products — if nothing else works, browsing and ordering must.

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

- [ ] Product filtering by category, price, and availability
- [ ] Newsletter / email collection for restock alerts
- [ ] Upcoming meetup events display
- [ ] Sample zine page previews
- [ ] Learning objectives per educational zine
- [ ] Customer testimonials and educator endorsements

### Out of Scope

- Online payment processing (Stripe, PayPal) — meetup-based fulfillment
- User accounts / authentication — public shop, no login needed at this scale
- Inventory tracking / admin dashboard — under 20 products, managed externally
- Abandoned cart recovery emails — over-engineering for indie shop
- Real-time chat / live support — FAQ covers common questions
- Multi-language support — English-only audience
- Mobile app / PWA — web-first
- Shipping calculator — not applicable for meetup fulfillment

## Context

**Shipped v1.0** with 5,273 LOC TypeScript/CSS across 61 files.

**Tech stack:** Next.js 15 + TypeScript + Tailwind CSS + DatoCMS (GraphQL) + Zustand (cart) + Server Actions (checkout) + Supabase (orders) + Resend (email notifications)

**Architecture:**
- Product data from DatoCMS with cache tags for on-demand revalidation
- Unified /shop/[slug] route handles both categories and product detail
- Zustand cart with localStorage persistence, SSR hydration guards
- Server Action checkout with server-side price re-fetch (fraud prevention)
- shop-* CSS prefix convention avoids collision with comics page styles
- Inter font scoped to shop pages via next/font/google

**Known technical debt:**
- DatoCMS schema missing `available` and `category` fields (checkout query workaround in place)
- No fallback for Safari Private mode / localStorage unavailable
- Product URL redirects not yet configured in next.config.js

## Constraints

- **Tech stack**: Next.js 15 + TypeScript + Tailwind CSS (locked)
- **Content source**: DatoCMS for product data (existing integration)
- **Hosting**: Vercel deployment (existing setup)
- **Package manager**: pnpm
- **No payment gateway**: Orders collected via form, fulfilled via meetup
- **Small catalog**: Under 20 products — keep architecture simple

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Rebuild from scratch | Current codebase didn't match vision | ✓ Good — clean architecture, shipped in 7 days |
| Keep Next.js/TS/Tailwind stack | Familiar stack, good for SSG/SSR shop | ✓ Good — leveraged existing knowledge |
| Order form + meetup checkout | Simplest fulfillment model, no payment integration | ✓ Good — shipped fast, validates demand |
| DatoCMS for product data | Existing integration, webhook revalidation | ✓ Good — proven pattern, cache tags work well |
| Zustand for cart state | Lightweight, built-in persist middleware | ✓ Good — simple API, localStorage sync works |
| Supabase for order storage | Already configured, service role for server inserts | ✓ Good — reliable, CC-XXXX reference format |
| Unified [slug] route | Handles categories and products in one route | ✓ Good — avoids Next.js dynamic segment conflicts |
| shop-* CSS prefix convention | Prevents collision with comics page styles | ✓ Good — clean separation of concerns |
| Fire-and-forget Resend email | Email failure never blocks order submission | ✓ Good — resilient checkout flow |
| No user accounts | Public shop, no login needed at this scale | — Pending review for v1.1 |

---
*Last updated: 2026-03-04 after v1.0 milestone*
