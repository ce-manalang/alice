import Image from "next/image"
import Link from "next/link"
import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { datocmsRequest } from "@/app/lib/datocms"
import { SINGLE_PRODUCT_QUERY } from "@/app/lib/datocms-queries"

// Type for the product data
interface Product {
  id: string;
  name: string;
  price: string;
  images: {
    url: string;
    alt: string;
  }[];
  alt: string;
  description?: string;
}

interface PageProps {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params

  try {
    const data = await datocmsRequest<{ product: Product }>(SINGLE_PRODUCT_QUERY, { id })

    if (!data.product) {
      return {
        title: "Product Not Found | centimentalcomics",
      }
    }

    return {
      title: `${data.product.name} | centimentalcomics`,
      description: data.product.alt || `View ${data.product.name} from centimentalcomics shop`,
      openGraph: {
        title: `${data.product.name} | centimentalcomics`,
        description: data.product.alt || `View ${data.product.name} from centimentalcomics shop`,
        images: data.product.images?.length > 0 ? [data.product.images[0].url] : [],
      },
    }
  } catch (error) {
    return {
      title: "Product | centimentalcomics",
      description: "Shop centimentalcomics merchandise and products",
    }
  }
}

export default async function ProductPage({ params }: PageProps) {
  const { id } = await params

  try {
    const data = await datocmsRequest<{ product: Product }>(SINGLE_PRODUCT_QUERY, { id })

    if (!data.product) {
      notFound()
    }

    const product = data.product

    return (
      <div className="container">
        <header className="header">
          <h1 className="title"><Link href="/">centimentalcomics</Link></h1>
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
            {/* Back to shop link */}
            <div className="back-link">
              <Link href="/shop" className="back-link-text">
                ← Back to Shop
              </Link>
            </div>

            <div className="product-content">
              {/* Product Images */}
              <div className="product-images">
                {product.images && product.images.length > 0 ? (
                  <div className="main-image">
                    <Image
                      src={product.images[0].url}
                      alt={product.images[0].alt || product.alt}
                      width={600}
                      height={600}
                      style={{ width: '100%', height: 'auto' }}
                      priority
                    />
                  </div>
                ) : (
                  <div className="main-image placeholder">
                    <Image
                      src="/assets/images/placeholder.jpg"
                      alt="Product image placeholder"
                      width={600}
                      height={600}
                      style={{ width: '100%', height: 'auto' }}
                    />
                  </div>
                )}

                {/* Additional images if available */}
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

              {/* Product Info */}
              <div className="product-info-detail">
                <h1 className="product-title">{product.name}</h1>

                <div className="product-price-section">
                  <span className="product-price">{product.price}</span>
                </div>

                {product.description && (
                  <div className="product-description">
                    <h3>Description</h3>
                    <div dangerouslySetInnerHTML={{ __html: product.description }} />
                  </div>
                )}

                {/* Add to cart button */}
                <div className="product-actions">
                  <Link 
                    href={`/checkout?productId=${product.id}&productName=${encodeURIComponent(product.name)}&productPrice=${encodeURIComponent(product.price)}&productImage=${encodeURIComponent(product.images?.[0]?.url || '/assets/images/placeholder.jpg')}`}
                    className="add-to-cart-btn"
                  >
                    Add to Cart
                  </Link>
                </div>

                {/* Product details */}
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
  } catch (error) {
    console.error('Error fetching product:', error)
    notFound()
  }
}
