'use client'

import { useState } from 'react'
import { useCartStore } from '@/app/lib/store/cartStore'

interface AddToCartSectionProps {
  productId: string
  productName: string
  isSoldOut: boolean
}

export default function AddToCartSection({ productId, productName, isSoldOut }: AddToCartSectionProps) {
  const [quantity, setQuantity] = useState(1)
  const [feedback, setFeedback] = useState<'idle' | 'added'>('idle')
  const addToCart = useCartStore((state) => state.addToCart)

  const handleAdd = () => {
    if (isSoldOut) return
    addToCart(productId, quantity)
    setFeedback('added')
    setTimeout(() => setFeedback('idle'), 1500)
  }

  const handleDecrement = () => {
    setQuantity((q) => Math.max(1, q - 1))
  }

  const handleIncrement = () => {
    setQuantity((q) => Math.min(99, q + 1))
  }

  if (isSoldOut) {
    return (
      <div style={{ marginTop: '2rem' }}>
        <button
          disabled
          style={{
            width: '100%',
            padding: '0.875rem 1.5rem',
            backgroundColor: '#9ca3af',
            color: '#ffffff',
            border: 'none',
            borderRadius: '6px',
            fontSize: '1rem',
            fontWeight: 600,
            cursor: 'not-allowed',
            fontFamily: "'Inter', system-ui, sans-serif",
          }}
        >
          Sold Out
        </button>
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
      </div>
    )
  }

  return (
    <div style={{ marginTop: '2rem' }}>
      {/* Quantity picker stepper */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
        <span
          style={{
            fontSize: '0.875rem',
            fontWeight: 500,
            color: '#374151',
            fontFamily: "'Inter', system-ui, sans-serif",
          }}
        >
          Qty
        </span>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            border: '1.5px solid #e5e7eb',
            borderRadius: '6px',
            overflow: 'hidden',
          }}
          role="group"
          aria-label={`Quantity for ${productName}`}
        >
          <button
            onClick={handleDecrement}
            disabled={quantity <= 1}
            aria-label="Decrease quantity"
            style={{
              width: '36px',
              height: '40px',
              background: 'none',
              border: 'none',
              cursor: quantity <= 1 ? 'not-allowed' : 'pointer',
              fontSize: '1.125rem',
              color: quantity <= 1 ? '#9ca3af' : '#374151',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'background-color 0.15s',
            }}
            onMouseEnter={(e) => {
              if (quantity > 1) (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#f3f4f6'
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'transparent'
            }}
          >
            −
          </button>
          <span
            style={{
              width: '40px',
              textAlign: 'center',
              fontSize: '0.9375rem',
              fontWeight: 600,
              color: '#111111',
              borderLeft: '1.5px solid #e5e7eb',
              borderRight: '1.5px solid #e5e7eb',
              lineHeight: '40px',
              fontFamily: "'Inter', system-ui, sans-serif",
            }}
            aria-live="polite"
          >
            {quantity}
          </span>
          <button
            onClick={handleIncrement}
            disabled={quantity >= 99}
            aria-label="Increase quantity"
            style={{
              width: '36px',
              height: '40px',
              background: 'none',
              border: 'none',
              cursor: quantity >= 99 ? 'not-allowed' : 'pointer',
              fontSize: '1.125rem',
              color: quantity >= 99 ? '#9ca3af' : '#374151',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'background-color 0.15s',
            }}
            onMouseEnter={(e) => {
              if (quantity < 99) (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#f3f4f6'
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'transparent'
            }}
          >
            +
          </button>
        </div>
      </div>

      {/* Add to Cart button */}
      <button
        onClick={handleAdd}
        style={{
          width: '100%',
          padding: '0.875rem 1.5rem',
          backgroundColor: feedback === 'added' ? '#16a34a' : '#ec4899',
          color: '#ffffff',
          border: 'none',
          borderRadius: '6px',
          fontSize: '1rem',
          fontWeight: 600,
          cursor: 'pointer',
          fontFamily: "'Inter', system-ui, sans-serif",
          transition: 'background-color 0.2s',
        }}
        aria-label={
          feedback === 'added'
            ? `${productName} added to cart`
            : `Add ${quantity} ${quantity === 1 ? 'unit' : 'units'} of ${productName} to cart`
        }
      >
        {feedback === 'added' ? '✓ Added to Cart!' : 'Add to Cart'}
      </button>
    </div>
  )
}
