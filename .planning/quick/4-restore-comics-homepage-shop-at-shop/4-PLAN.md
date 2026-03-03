---
phase: quick-4
plan: 4
type: execute
wave: 1
depends_on: []
files_modified:
  - app/page.tsx
  - app/shop/page.tsx
  - app/[slug]/page.tsx
autonomous: true
requirements: []
must_haves:
  truths:
    - "Visiting / shows the comics listing with pagination"
    - "Visiting /shop shows the hero + product grid (not just the grid)"
    - "The shop nav link in the comics [slug] page points to /shop, not Instagram"
    - "No existing routes (/about, /faq, /cart, /shop/[slug]) are broken"
  artifacts:
    - path: "app/page.tsx"
      provides: "Comics homepage — paginated listing using getPosts"
    - path: "app/shop/page.tsx"
      provides: "Shop landing — hero section above category nav + product grid"
    - path: "app/[slug]/page.tsx"
      provides: "Comic detail page with corrected shop nav link"
  key_links:
    - from: "app/page.tsx"
      to: "app/lib/posts.ts"
      via: "getPosts import"
    - from: "app/shop/page.tsx"
      to: "app/lib/datocms-queries.ts"
      via: "FEATURED_PRODUCTS_QUERY + PRODUCTS_QUERY"
---

<objective>
Restore route responsibilities to their intended state: / is the comics homepage, /shop is the shop landing page (hero + grid).

Purpose: The shop hero was placed at / during Phase 1 to build the shop first. Now the comics listing needs its homepage back, and the shop needs a proper landing entry point.
Output: app/page.tsx (comics listing), app/shop/page.tsx (hero + grid), app/[slug]/page.tsx (shop link fixed)
</objective>

<context>
@.planning/STATE.md

Key facts from reading the codebase:
- app/page.tsx currently: shop hero ("CS education, made with care.") + featured products row
- app/shop/page.tsx currently: "Shop" heading + product count + category nav + ProductGrid (no hero)
- app/[slug]/page.tsx: comics detail page with old nav — shop link points to Instagram, not /shop
- app/components/Navigation.tsx: shop nav link already points to /shop — NO CHANGES NEEDED
- The original homepage from git commit 5624b7e already has shop link pointing to /shop (not Instagram)
- app/lib/posts.ts: exports getPosts(page), Post type, formatDate used by original homepage
- app/components/pagination.tsx: Pagination component used by original homepage
</context>

<tasks>

<task type="auto">
  <name>Task 1: Restore comics homepage at /</name>
  <files>app/page.tsx</files>
  <action>
Replace the entire contents of app/page.tsx with the original comics listing from git commit 5624b7e. The content to write is exactly:

```tsx
import Image from "next/image";
import Link from "next/link";
import { getPosts, type Post } from "@/app/lib/posts";
import { Suspense } from "react";
import { Pagination } from "./components/pagination";
import { LoadingSkeleton } from "./components/loading-skeleton";
import type { Metadata } from "next"
import { formatDate } from "@/app/lib/utils";

export const metadata: Metadata = {
  title: "centimentalcomics",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "centimentalcomics",
    description: "some comics about art and internet",
  },
}

interface HomeProps {
  searchParams: Promise<{ page?: string }>
}

export default async function Home({ searchParams }: HomeProps) {
  const params = await searchParams
  const currentPage = params.page ? Number.parseInt(params.page) : 1

  return (
    <div className="container">
      <header className="header">
        <h1 className="title">
          <a href="/">centimentalcomics</a>
        </h1>
        <h2>some comics about art and internet</h2>
        <div className="value-props row"></div>
      </header>
      <div className="navbar-spacer"></div>
      <nav className="navbar">
        <div className="container">
          <ul className="navbar-list">
            <li className="navbar-item">
              <a className="navbar-link" href="/">
                home
              </a>
            </li>
            <li className="navbar-item">
              <a className="navbar-link" href="/shop">
                shop
              </a>
            </li>
            <li className="navbar-item">
              <a className="navbar-link" href="about">
                about
              </a>
            </li>
          </ul>
        </div>
      </nav>

      <Suspense fallback={<LoadingSkeleton />}>
        <ComicsList page={currentPage} />
      </Suspense>

      <section className="footer">
        <h3 className="u-text-center">© 2025 | made in ph 💘</h3>
      </section>
    </div>
  );
}

async function ComicsList({ page }: { page: number }) {
  const { posts, totalPages, currentPage } = await getPosts(page);

  return (
    <>
      {posts.map((post: Post, index: number) => (
        <article key={index} className="docs-section">
          {
            post.image_urls.map((image_url, index) => (
              <div key={index}>
                <Link href={`/${post.slug}`}>
                  <Image
                    src={image_url}
                    alt={post.title}
                    width="0"
                    height="0"
                    sizes="100vw"
                    priority={index === 0}
                    style={{ width: "100%", height: "auto" }}
                  />
                </Link>
              </div>
            ))
          }
          <h3 className="u-pull-right">
            <strong>{formatDate(post.date)}</strong>
          </h3>
          <h2 className="docs-header">
            <Link href={`/${post.slug}`}>{post.title}</Link>
          </h2>
          <div dangerouslySetInnerHTML={{ __html: post.blurb.replace('</p>', ' <a href="/' + post.slug + '">read more</a></p>') }} />
        </article>
      ))}

      <Pagination currentPage={currentPage} totalPages={totalPages} />
    </>
  );
}
```

Note: The large block of commented-out share section from the original has been omitted — it was dead code. The nav already points to /shop (not Instagram). The shop link in the nav is /shop as required.
  </action>
  <verify>
    <automated>cd /Volumes/Workspace/weekend/alice && npx tsc --noEmit --project tsconfig.json 2>&1 | grep "app/page.tsx" | head -5 || echo "no type errors in page.tsx"</automated>
  </verify>
  <done>/ renders the comics listing: paginated comic images with prev/next links. No shop hero content visible at /.</done>
</task>

<task type="auto">
  <name>Task 2: Add hero to shop page at /shop</name>
  <files>app/shop/page.tsx</files>
  <action>
Replace app/shop/page.tsx with a version that prepends the hero section (from the current app/page.tsx) above the existing product grid content. The "Browse the shop" CTA button is removed since the user is already on /shop. The featured products row is also not included — /shop shows the full catalog grid, not a subset. The hero just provides brand context at the top.

Write the file as:

```tsx
import type { Metadata } from 'next'
import { datocmsRequest } from '@/app/lib/datocms'
import { PRODUCTS_QUERY } from '@/app/lib/datocms-queries'
import ProductGrid from '@/app/components/ProductGrid'
import type { Product } from '@/app/lib/types'
import { CATEGORIES, CATEGORY_LABELS } from '@/app/lib/constants'
import Link from 'next/link'

export const revalidate = 3600

export const metadata: Metadata = {
  title: 'Shop',
  description:
    'Browse centimentalcomics merchandise — zines, apparel, stationery, and pins for CS students and educators.',
  alternates: { canonical: '/shop' },
  openGraph: {
    title: 'Shop | centimentalcomics',
    description: 'Browse centimentalcomics merchandise — zines, apparel, stationery, and pins.',
    url: '/shop',
  },
}

export default async function ShopPage() {
  const data = await datocmsRequest<{ allProducts: Product[] }>(PRODUCTS_QUERY)
  const products = data.allProducts || []

  return (
    <div className="shop-page">
      {/* Hero section */}
      <section style={{
        padding: '5rem 0 3rem',
        borderBottom: '1px solid #e5e7eb',
      }}>
        <div className="shop-container">
          <div style={{ maxWidth: '560px' }}>
            <h1 style={{
              fontFamily: "'Inter', system-ui, sans-serif",
              fontSize: 'clamp(2rem, 5vw, 3rem)',
              fontWeight: 700,
              color: '#111111',
              margin: '0 0 1rem',
              lineHeight: 1.1,
              letterSpacing: '-0.02em',
            }}>
              CS education, made with care.
            </h1>
            <p style={{
              fontFamily: "'Inter', system-ui, sans-serif",
              fontSize: '1.0625rem',
              color: '#6b7280',
              margin: 0,
              lineHeight: 1.6,
            }}>
              Zines, pins, stationery, and apparel that make computer science feel human — for students, educators, and curious minds.
            </p>
          </div>
        </div>
      </section>

      {/* Product catalog */}
      <div className="shop-container" style={{ paddingTop: '2rem', paddingBottom: '4rem' }}>
        {/* Product count */}
        <div style={{ marginBottom: '2rem' }}>
          <p
            style={{
              fontFamily: "'Inter', system-ui, sans-serif",
              color: '#6b7280',
              fontSize: '0.9375rem',
              margin: 0,
            }}
          >
            {products.length} product{products.length !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Category navigation */}
        <nav style={{ marginBottom: '2rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <Link
            href="/shop"
            style={{
              fontFamily: "'Inter', system-ui, sans-serif",
              fontSize: '0.875rem',
              fontWeight: 600,
              padding: '0.375rem 0.875rem',
              borderRadius: '9999px',
              border: '1.5px solid #111111',
              background: '#111111',
              color: '#ffffff',
              textDecoration: 'none',
            }}
          >
            All
          </Link>
          {CATEGORIES.map((cat) => (
            <Link
              key={cat}
              href={`/shop/${cat}`}
              style={{
                fontFamily: "'Inter', system-ui, sans-serif",
                fontSize: '0.875rem',
                fontWeight: 500,
                padding: '0.375rem 0.875rem',
                borderRadius: '9999px',
                border: '1.5px solid #e5e7eb',
                background: '#ffffff',
                color: '#374151',
                textDecoration: 'none',
              }}
            >
              {CATEGORY_LABELS[cat]}
            </Link>
          ))}
        </nav>

        <ProductGrid
          products={products}
          emptyMessage="No products available yet. Check back soon!"
        />
      </div>
    </div>
  )
}
```

Key changes from original shop page:
- Hero section added at top (hero h1 + p, NO "Browse the shop" button — user is already here)
- The old "Shop" h1 heading removed (hero h1 now serves this purpose)
- Product count p moved below hero, product count label kept
- All other content (category nav, ProductGrid) unchanged
  </action>
  <verify>
    <automated>cd /Volumes/Workspace/weekend/alice && npx tsc --noEmit --project tsconfig.json 2>&1 | grep "app/shop/page.tsx" | head -5 || echo "no type errors in shop/page.tsx"</automated>
  </verify>
  <done>/shop renders: hero with "CS education, made with care." heading and tagline (no button), then product count, then category nav, then product grid. No "Browse the shop" button present.</done>
</task>

<task type="auto">
  <name>Task 3: Fix shop nav link in comics detail page</name>
  <files>app/[slug]/page.tsx</files>
  <action>
In app/[slug]/page.tsx, find the nav list item with the Instagram shop link and change it to point to /shop.

Current code (lines 86-90):
```tsx
<li className="navbar-item">
  <a className="navbar-link" href="https://www.instagram.com/centimentalcomics?utm_source=shop">
    shop
  </a>
</li>
```

Replace with:
```tsx
<li className="navbar-item">
  <a className="navbar-link" href="/shop">
    shop
  </a>
</li>
```

No other changes to this file.
  </action>
  <verify>
    <automated>cd /Volumes/Workspace/weekend/alice && grep -n "instagram.com" app/\[slug\]/page.tsx && echo "FAIL: Instagram link still present" || echo "PASS: Instagram link removed"</automated>
  </verify>
  <done>The "shop" link in the comics detail page nav points to /shop. Visiting any comic at /[slug] and clicking "shop" navigates to /shop, not Instagram.</done>
</task>

</tasks>

<verification>
After all tasks complete:
1. `pnpm build` completes without TypeScript errors
2. Visit / — comics listing loads with paginated posts
3. Visit /shop — hero section visible above the product grid
4. Visit any comic (/[slug]) — "shop" nav link goes to /shop
5. All existing routes still work: /about, /faq, /cart, /shop/[slug] (product detail), /shop/[category]
</verification>

<success_criteria>
- / shows comics listing (not shop hero)
- /shop shows hero + product catalog
- Comics detail page shop link points to /shop
- Build passes with no new type errors
</success_criteria>

<output>
After completion, update .planning/STATE.md Quick Tasks Completed table to add:
| 4 | Restore comics homepage and move shop hero to /shop | 2026-03-03 | {commit} | [4-restore-comics-homepage-shop-at-shop](./quick/4-restore-comics-homepage-shop-at-shop/) |
</output>
