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
import { CATEGORIES, CATEGORY_LABELS } from '@/app/lib/constants'

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
    return {
      title: `${data.product.name} | centimentalcomics`,
      description: data.product.alt || `View ${data.product.name} from centimentalcomics shop`,
      openGraph: {
        title: `${data.product.name} | centimentalcomics`,
        description: data.product.alt || `View ${data.product.name} from centimentalcomics shop`,
        images: data.product.images?.length > 0 ? [data.product.images[0].url] : [],
      },
    }
  } catch {
    return { title: 'Product | centimentalcomics' }
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
  try {
    const data = await datocmsRequest<{ product: Product | null }>(PRODUCT_BY_SLUG_QUERY, {
      slug,
    })

    if (!data.product) {
      notFound()
    }

    const product = data.product

    return (
      <div className="container">
        <header className="header">
          <h1 className="title">
            <Link href="/">centimentalcomics</Link>
          </h1>
          <h2>some comics about art and internet</h2>
          <div className="value-props row"></div>
        </header>
        <div className="navbar-spacer"></div>
        <nav className="navbar">
          <div className="container">
            <ul className="navbar-list">
              <li className="navbar-item">
                <a className="navbar-link" href="/">home</a>
              </li>
              <li className="navbar-item">
                <a className="navbar-link" href="/shop">shop</a>
              </li>
              <li className="navbar-item">
                <a className="navbar-link" href="/about">about</a>
              </li>
            </ul>
          </div>
        </nav>

        <div className="docs-section">
          <div className="product-detail">
            <div className="back-link">
              <Link href="/shop" className="back-link-text">
                Back to Shop
              </Link>
            </div>

            <div className="product-content">
              <div className="product-images">
                {product.images && product.images.length > 0 ? (
                  <div className="main-image">
                    <Image
                      src={product.images[0].url}
                      alt={product.images[0].alt || product.alt || product.name}
                      width={600}
                      height={600}
                      style={{ width: '100%', height: 'auto' }}
                      priority
                    />
                  </div>
                ) : (
                  <div
                    className="main-image placeholder"
                    style={{
                      width: 600,
                      height: 600,
                      backgroundColor: '#f3f4f6',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <span style={{ color: '#9ca3af' }}>No image</span>
                  </div>
                )}

                {product.images && product.images.length > 1 && (
                  <div className="thumbnail-images">
                    {product.images.slice(1).map((image, index) => (
                      <div key={index} className="thumbnail">
                        <Image
                          src={image.url}
                          alt={image.alt || `${product.name} - Image ${index + 2}`}
                          width={150}
                          height={150}
                          style={{ width: '100%', height: 'auto' }}
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="product-info-detail">
                <h1 className="product-title">{product.name}</h1>

                <div className="product-price-section">
                  <span className="product-price">{formatPrice(product.price)}</span>
                </div>

                {product.available === false && (
                  <span
                    style={{
                      display: 'inline-block',
                      fontFamily: "'Inter', system-ui, sans-serif",
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      padding: '0.2rem 0.6rem',
                      borderRadius: '9999px',
                      background: '#f3f4f6',
                      color: '#6b7280',
                      border: '1px solid #e5e7eb',
                      marginBottom: '1rem',
                    }}
                  >
                    Sold Out
                  </span>
                )}

                {product.description && (
                  <div className="product-description">
                    <h3>Description</h3>
                    <div dangerouslySetInnerHTML={{ __html: product.description }} />
                  </div>
                )}

                <div className="product-actions">
                  <Link
                    href={`/checkout?productId=${product.id}&productName=${encodeURIComponent(product.name)}&productPrice=${encodeURIComponent(formatPrice(product.price))}&productImage=${encodeURIComponent(product.images?.[0]?.url || '')}`}
                    className="add-to-cart-btn"
                  >
                    Add to Cart
                  </Link>
                </div>

                <div className="product-meta">
                  <div className="meta-item">
                    <span className="meta-label">Product ID:</span>
                    <span className="meta-value">{product.id}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  } catch {
    notFound()
  }
}
