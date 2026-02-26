import type { Metadata } from 'next'
import Link from 'next/link'
import { datocmsRequest } from '@/app/lib/datocms'
import { FEATURED_PRODUCTS_QUERY, PRODUCTS_QUERY } from '@/app/lib/datocms-queries'
import ProductCard from '@/app/components/ProductCard'
import type { Product } from '@/app/lib/types'
import { FEATURED_PRODUCT_COUNT } from '@/app/lib/constants'

export const revalidate = 3600

export const metadata: Metadata = {
  title: 'centimentalcomics',
  description: 'Educational CS products with personality — zines, pins, stationery, and apparel for CS students and educators.',
  alternates: { canonical: '/' },
  openGraph: {
    title: 'centimentalcomics',
    description: 'Educational CS products with personality.',
    url: '/',
  },
}

async function getFeaturedProducts(): Promise<Product[]> {
  try {
    // Try to fetch products marked as featured in DatoCMS.
    // FEATURED_PRODUCTS_QUERY currently returns most-recent products (featured field not yet in DatoCMS schema).
    const data = await datocmsRequest<{ allProducts: Product[] }>(FEATURED_PRODUCTS_QUERY, {
      first: FEATURED_PRODUCT_COUNT,
    })
    if (data.allProducts && data.allProducts.length > 0) {
      return data.allProducts
    }
  } catch {
    // Featured field may not exist in DatoCMS schema yet — fall through to fallback
  }

  // Fallback: use first N products from all products query
  try {
    const data = await datocmsRequest<{ allProducts: Product[] }>(PRODUCTS_QUERY)
    return (data.allProducts || []).slice(0, FEATURED_PRODUCT_COUNT)
  } catch {
    return []
  }
}

export default async function HomePage() {
  const featuredProducts = await getFeaturedProducts()

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
              margin: '0 0 2rem',
              lineHeight: 1.6,
            }}>
              Zines, pins, stationery, and apparel that make computer science feel human — for students, educators, and curious minds.
            </p>
            <Link
              href="/shop"
              style={{
                display: 'inline-block',
                padding: '0.75rem 1.75rem',
                backgroundColor: '#ec4899',
                color: '#ffffff',
                textDecoration: 'none',
                borderRadius: '6px',
                fontFamily: "'Inter', system-ui, sans-serif",
                fontWeight: 600,
                fontSize: '0.9375rem',
                letterSpacing: '-0.01em',
              }}
            >
              Browse the shop
            </Link>
          </div>
        </div>
      </section>

      {/* Featured products section */}
      {featuredProducts.length > 0 && (
        <section style={{ padding: '3rem 0 4rem' }}>
          <div className="shop-container">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '1.5rem' }}>
              <h2 style={{
                fontFamily: "'Inter', system-ui, sans-serif",
                fontSize: '1rem',
                fontWeight: 700,
                color: '#111111',
                margin: 0,
                letterSpacing: '-0.01em',
              }}>
                Featured
              </h2>
              <Link
                href="/shop"
                style={{
                  fontFamily: "'Inter', system-ui, sans-serif",
                  fontSize: '0.875rem',
                  color: '#6b7280',
                  textDecoration: 'none',
                }}
              >
                View all →
              </Link>
            </div>

            {/* Horizontal row of featured product cards */}
            <div className="featured-row">
              {featuredProducts.map((product, idx) => (
                <ProductCard key={product.id} product={product} priority={idx === 0} />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  )
}
