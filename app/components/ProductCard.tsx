'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import { useCartStore } from '@/app/lib/store/cartStore'
import type { Product } from '@/app/lib/types'

interface ProductCardProps {
  product: Product
  priority?: boolean
}

/** Format a numeric price from DatoCMS (stored as Float) into a display string */
function formatPrice(price: number): string {
  return `PHP ${price.toFixed(0)}`
}

interface QuickAddProps {
  productId: string
  productName: string
  isSoldOut: boolean
}

function QuickAdd({ productId, productName, isSoldOut }: QuickAddProps) {
  const [feedback, setFeedback] = useState<'idle' | 'added'>('idle')
  const addToCart = useCartStore((state) => state.addToCart)

  const handleClick = (e: React.MouseEvent) => {
    // Prevent the parent <Link> from navigating when the button is clicked
    e.preventDefault()
    e.stopPropagation()

    if (isSoldOut) return

    addToCart(productId, 1)
    setFeedback('added')
    setTimeout(() => setFeedback('idle'), 1500)
  }

  return (
    <button
      onClick={handleClick}
      disabled={isSoldOut}
      aria-label={
        isSoldOut
          ? `${productName} is sold out`
          : feedback === 'added'
          ? `${productName} added to cart`
          : `Add ${productName} to cart`
      }
      style={{
        marginTop: '0.5rem',
        width: '100%',
        padding: '0.5rem 0.75rem',
        backgroundColor: isSoldOut ? '#e5e7eb' : feedback === 'added' ? '#16a34a' : '#ec4899',
        color: isSoldOut ? '#9ca3af' : '#ffffff',
        border: 'none',
        borderRadius: '6px',
        fontSize: '0.8125rem',
        fontWeight: 600,
        cursor: isSoldOut ? 'not-allowed' : 'pointer',
        fontFamily: "'Inter', system-ui, sans-serif",
        transition: 'background-color 0.2s',
        letterSpacing: '0.01em',
      }}
    >
      {isSoldOut ? 'Sold Out' : feedback === 'added' ? '✓ Added!' : 'Add to Cart'}
    </button>
  )
}

export default function ProductCard({ product, priority = false }: ProductCardProps) {
  const isSoldOut = product.available === false
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
        {/* Quick-add: always rendered; handles its own sold-out state */}
        <QuickAdd
          productId={product.id}
          productName={product.name}
          isSoldOut={isSoldOut}
        />
      </div>
    </Link>
  )
}
