import Image from 'next/image'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { datocmsRequest } from '@/app/lib/datocms'
import {
  PRODUCTS_BY_CATEGORY_QUERY,
  ALL_PRODUCT_IDS_QUERY,
} from '@/app/lib/datocms-queries'
import ProductGrid from '@/app/components/ProductGrid'
import type { Product, ProductCategory } from '@/app/lib/types'
import { CATEGORIES, CATEGORY_LABELS, SITE_URL } from '@/app/lib/constants'

export const revalidate = 3600

// Query for a single product by slug
const PRODUCT_BY_SLUG_QUERY = `
  query ProductBySlug($slug: String!) {
    product(filter: { slug: { eq: $slug } }) {
      id
      name
      price
      slug
      alt(markdown: false)
      images {
        url
        alt
      }
      description(markdown: true)
    }
  }
`

interface PageProps {
  params: Promise<{ slug: string }>
}

// Pre-generate static pages for all 4 categories and all product slugs
export async function generateStaticParams() {
  const categoryParams = CATEGORIES.map((category) => ({ slug: category }))

  try {
    const data = await datocmsRequest<{ allProducts: { id: string; slug: string | null }[] }>(
      ALL_PRODUCT_IDS_QUERY,
    )
    const productParams = (data.allProducts || [])
      .filter((p) => p.slug)
      .map((p) => ({ slug: p.slug as string }))
    return [...categoryParams, ...productParams]
  } catch {
    return categoryParams
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params

  if (CATEGORIES.includes(slug as ProductCategory)) {
    const label = CATEGORY_LABELS[slug as ProductCategory]
    return {
      title: label,
      description: `Browse ${label.toLowerCase()} from centimentalcomics — educational CS products with personality.`,
      alternates: { canonical: `/shop/${slug}` },
      openGraph: {
        title: `${label} | centimentalcomics shop`,
        description: `Browse ${label.toLowerCase()} from centimentalcomics.`,
        url: `/shop/${slug}`,
      },
    }
  }

  try {
    const data = await datocmsRequest<{ product: Product | null }>(PRODUCT_BY_SLUG_QUERY, {
      slug,
    })
    if (!data.product) return { title: 'Product Not Found | centimentalcomics' }

    const product = data.product
    const description = product.alt || `${product.name} from centimentalcomics shop`
    const ogImage = product.images?.[0]?.url

    return {
      title: product.name,
      description: description.substring(0, 160),
      alternates: { canonical: `/shop/${slug}` },
      openGraph: {
        title: `${product.name} | centimentalcomics`,
        description: description.substring(0, 160),
        url: `${SITE_URL}/shop/${slug}`,
        type: 'website',
        images: ogImage
          ? [{ url: ogImage, width: 1200, height: 630, alt: product.name }]
          : [],
      },
      twitter: {
        card: 'summary_large_image',
        title: `${product.name} | centimentalcomics`,
        description: description.substring(0, 160),
        images: ogImage ? [ogImage] : [],
      },
    }
  } catch {
    return {
      title: 'Product | centimentalcomics',
      description: 'Shop centimentalcomics merchandise and products',
    }
  }
}

function formatPrice(price: number): string {
  return `PHP ${price.toFixed(0)}`
}

export default async function ShopSlugPage({ params }: PageProps) {
  const { slug } = await params

  // --- Category page ---
  if (CATEGORIES.includes(slug as ProductCategory)) {
    const category = slug as ProductCategory
    const label = CATEGORY_LABELS[category]

    const data = await datocmsRequest<{ allProducts: Product[] }>(PRODUCTS_BY_CATEGORY_QUERY, {
      category: category.toUpperCase(),
    })
    const products = data.allProducts || []

    return (
      <div className="shop-page">
        <div className="shop-container" style={{ paddingTop: '2rem', paddingBottom: '4rem' }}>
          <div style={{ marginBottom: '2rem' }}>
            <h1
              style={{
                fontFamily: "'Inter', system-ui, sans-serif",
                fontSize: '1.5rem',
                fontWeight: 700,
                color: '#111111',
                margin: '0 0 0.5rem',
              }}
            >
              {label}
            </h1>
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

          <nav style={{ marginBottom: '2rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <Link
              href="/shop"
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
              All
            </Link>
            {CATEGORIES.map((cat) => (
              <Link
                key={cat}
                href={`/shop/${cat}`}
                style={{
                  fontFamily: "'Inter', system-ui, sans-serif",
                  fontSize: '0.875rem',
                  fontWeight: cat === category ? 600 : 500,
                  padding: '0.375rem 0.875rem',
                  borderRadius: '9999px',
                  border: `1.5px solid ${cat === category ? '#111111' : '#e5e7eb'}`,
                  background: cat === category ? '#111111' : '#ffffff',
                  color: cat === category ? '#ffffff' : '#374151',
                  textDecoration: 'none',
                }}
              >
                {CATEGORY_LABELS[cat]}
              </Link>
            ))}
          </nav>

          <ProductGrid
            products={products}
            emptyMessage={`No ${label.toLowerCase()} available yet. Check back soon!`}
          />
        </div>
      </div>
    )
  }

  // --- Product detail page ---
  let product: Product

  try {
    const data = await datocmsRequest<{ product: Product | null }>(PRODUCT_BY_SLUG_QUERY, {
      slug,
    })

    if (!data.product) {
      notFound()
    }

    product = data.product
  } catch {
    notFound()
  }

  const isSoldOut = product.available === false

  return (
    <div className="shop-page">
      <div className="shop-container" style={{ paddingTop: '2rem', paddingBottom: '4rem' }}>
        {/* Breadcrumb */}
        <nav style={{ marginBottom: '1.5rem', fontFamily: "'Inter', system-ui, sans-serif" }}>
          <Link href="/shop" style={{ fontSize: '0.875rem', color: '#6b7280', textDecoration: 'none' }}>
            &larr; Back to Shop
          </Link>
        </nav>

        {/* Product layout: image left, info right */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr',
            gap: '2rem',
          }}
          className="product-detail-grid"
        >
          {/* Images column */}
          <div>
            {/* Main image */}
            {product.images && product.images.length > 0 ? (
              <div
                style={{
                  borderRadius: '8px',
                  overflow: 'hidden',
                  background: '#f9fafb',
                  aspectRatio: '1',
                  position: 'relative',
                }}
              >
                <Image
                  src={product.images[0].url}
                  alt={product.images[0].alt || product.alt || product.name}
                  fill
                  priority
                  sizes="(max-width: 768px) 100vw, 50vw"
                  style={{ objectFit: 'cover' }}
                />
              </div>
            ) : (
              <div
                style={{
                  borderRadius: '8px',
                  background: '#f3f4f6',
                  aspectRatio: '1',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <span style={{ color: '#9ca3af', fontFamily: "'Inter', system-ui, sans-serif" }}>
                  No image available
                </span>
              </div>
            )}

            {/* Thumbnail strip (additional images) */}
            {product.images && product.images.length > 1 && (
              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.75rem', flexWrap: 'wrap' }}>
                {product.images.slice(1).map((img, idx) => (
                  <div
                    key={idx}
                    style={{
                      width: '72px',
                      height: '72px',
                      borderRadius: '6px',
                      overflow: 'hidden',
                      border: '1.5px solid #e5e7eb',
                      flexShrink: 0,
                      position: 'relative',
                    }}
                  >
                    <Image
                      src={img.url}
                      alt={img.alt || `${product.name} image ${idx + 2}`}
                      fill
                      sizes="72px"
                      style={{ objectFit: 'cover' }}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Info column */}
          <div style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
            <h1
              style={{
                fontSize: '1.5rem',
                fontWeight: 700,
                color: '#111111',
                margin: '0 0 0.5rem',
                lineHeight: 1.2,
              }}
            >
              {product.name}
            </h1>

            <p style={{ fontSize: '1.25rem', fontWeight: 600, color: '#111111', margin: '0 0 1rem' }}>
              {formatPrice(product.price)}
            </p>

            {/* Availability badge */}
            {isSoldOut && (
              <span
                className="shop-product-card__badge shop-product-card__badge--sold-out"
                style={{ marginBottom: '1rem', display: 'inline-block' }}
              >
                Sold Out
              </span>
            )}

            {/* Description */}
            {product.description && (
              <div style={{ marginTop: '1.5rem' }}>
                <h2
                  style={{
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    color: '#6b7280',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    margin: '0 0 0.75rem',
                  }}
                >
                  Description
                </h2>
                <div
                  style={{ fontSize: '0.9375rem', color: '#374151', lineHeight: 1.6 }}
                  dangerouslySetInnerHTML={{ __html: product.description }}
                />
              </div>
            )}

            {/* Add to cart placeholder — Phase 2 will replace this with functional cart */}
            <div style={{ marginTop: '2rem' }}>
              <button
                disabled={isSoldOut}
                style={{
                  width: '100%',
                  padding: '0.875rem 1.5rem',
                  backgroundColor: isSoldOut ? '#9ca3af' : '#ec4899',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '6px',
                  fontSize: '1rem',
                  fontWeight: 600,
                  cursor: isSoldOut ? 'not-allowed' : 'pointer',
                  fontFamily: "'Inter', system-ui, sans-serif",
                }}
              >
                {isSoldOut ? 'Sold Out' : 'Add to Cart'}
              </button>
              {isSoldOut && (
                <p
                  style={{
                    fontSize: '0.8125rem',
                    color: '#6b7280',
                    marginTop: '0.5rem',
                    textAlign: 'center',
                  }}
                >
                  This item is currently unavailable.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Responsive styles for product detail grid */}
      <style>{`
        @media (min-width: 768px) {
          .product-detail-grid {
            grid-template-columns: 1fr 1fr !important;
          }
        }
      `}</style>
    </div>
  )
}
