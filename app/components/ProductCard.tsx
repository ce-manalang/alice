import Link from 'next/link'
import Image from 'next/image'
import type { Product } from '@/app/lib/types'

interface ProductCardProps {
  product: Product
  priority?: boolean
}

/** Format a numeric price from DatoCMS (stored as Float) into a display string */
function formatPrice(price: number): string {
  // Prices are stored as whole numbers in PHP (e.g. 300 = PHP 300)
  return `PHP ${price.toFixed(0)}`
}

export default function ProductCard({ product, priority = false }: ProductCardProps) {
  // available defaults to true until the field is added to DatoCMS
  const isSoldOut = product.available === false
  // Use slug for cleaner URLs when available, fall back to id
  const href = `/shop/${product.slug ?? product.id}`

  return (
    <Link
      href={href}
      className={`shop-product-card${isSoldOut ? ' sold-out' : ''}`}
    >
      <div className="shop-product-card__image">
        {product.images && product.images.length > 0 ? (
          <Image
            src={product.images[0].url}
            alt={product.images[0].alt || product.alt || product.name}
            width={400}
            height={400}
            priority={priority}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        ) : (
          <div
            style={{
              width: '100%',
              height: '100%',
              backgroundColor: '#f3f4f6',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <span style={{ color: '#9ca3af', fontSize: '0.875rem' }}>No image</span>
          </div>
        )}
      </div>
      <div className="shop-product-card__body">
        <h3 className="shop-product-card__name">{product.name}</h3>
        <p className="shop-product-card__price">{formatPrice(product.price)}</p>
        {isSoldOut && (
          <span className="shop-product-card__badge shop-product-card__badge--sold-out">
            Sold Out
          </span>
        )}
      </div>
    </Link>
  )
}
