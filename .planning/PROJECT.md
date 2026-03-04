# Centimentalcomics Shop

## What This Is

An online store for centimentalcomics (shop.centimentalcomics.com) selling educational zines about computer science concepts, along with apparel, stationery, pins, and accessories. The shop makes technical topics approachable and fun for ages 8-100, with a playful illustrated aesthetic inspired by shop.bubblesort.io.

## Core Value

Customers can browse the product catalog and submit orders for educational CS products — if nothing else works, browsing and ordering must.

## Requirements

### Validated

<!-- Rebuilding from scratch — nothing validated yet. Existing codebase serves as reference only. -->

(None yet — ship to validate)

### Active

- [ ] Product catalog with categories (Zines, Apparel, Stationery, Pins)
- [ ] Product detail pages with images, price, description, availability
- [ ] Featured products on homepage
- [ ] Product filtering by category and availability
- [ ] Order form (name, contact info, items) with meetup-based fulfillment
- [ ] Shopping cart with item list and total
- [ ] About page with brand story and mission
- [ ] FAQ page with product availability, pre-order info, and philosophy
- [ ] Social media links (Instagram, Twitter) and event promotion
- [ ] SEO metadata and Open Graph support
- [ ] Responsive design with playful, illustrated, zine-like aesthetic

### Out of Scope

- Online payment processing (Stripe, PayPal, etc.) — meetup-based for now
- Newsletter / email collection — deferred to v2
- Inventory tracking / back-in-stock notifications — deferred to v2
- User accounts / authentication — public shop, no login needed
- Admin panel / CMS — products managed via external spreadsheet/Notion
- Multi-language support — future enhancement
- Mobile app / PWA — web-first
- Real-time chat or support — not needed at this scale

## Context

**Existing codebase (reference only — rebuilding from scratch):**
- Next.js 15 app with DatoCMS integration for comics and products
- Supabase configured but minimally used
- Product pages and shop routes exist but don't match the vision
- About page exists as static content
- Google Analytics and GTM integration present

**Product catalog:**
- Under 20 products, managed via spreadsheet/Notion
- Categories: Zines, Apparel, Stationery, Pins
- Products have physical and digital format options

**Fulfillment model:**
- Order form collects name + contact + items
- Fulfillment via in-person meetup — no shipping for now

**Brand inspiration:**
- shop.bubblesort.io — playful visual style, great product presentation, educational-yet-fun overall feel
- Comics, diagrams, and stories that explain CS concepts

## Constraints

- **Tech stack**: Next.js 15 + TypeScript + Tailwind CSS — keeping current stack, rebuilding implementation
- **Content source**: DatoCMS for product data (existing integration pattern)
- **Hosting**: Vercel deployment (existing setup)
- **Package manager**: pnpm
- **No payment gateway**: Orders collected via form, fulfilled via meetup
- **Small catalog**: Under 20 products — keep architecture simple

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Rebuild from scratch | Current codebase doesn't match vision | — Pending |
| Keep Next.js/TS/Tailwind stack | Familiar stack, good for SSG/SSR shop | — Pending |
| Order form + meetup checkout | Simplest fulfillment model, no payment integration needed | — Pending |
| Defer newsletter to v2 | Focus on core shop experience first | — Pending |
| DatoCMS for product data | Existing integration, no need to change content source | — Pending |
| No user accounts | Public shop, no login needed at this scale | — Pending |

---
*Last updated: 2026-02-20 after initialization*
