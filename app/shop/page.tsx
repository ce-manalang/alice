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
