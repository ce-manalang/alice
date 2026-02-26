import Link from 'next/link'
import Image from 'next/image'
import type { Product } from '@/app/lib/types'

interface ProductCardProps {
  product: Product
  priority?: boolean
}

export default function ProductCard({ product, priority = false }: ProductCardProps) {
  const isSoldOut = !product.available

  return (
    <Link
      href={`/shop/${product.id}`}
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
        <p className="shop-product-card__price">{product.price}</p>
        {isSoldOut && (
          <span className="shop-product-card__badge shop-product-card__badge--sold-out">
            Sold Out
          </span>
        )}
      </div>
    </Link>
  )
}
