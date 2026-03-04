'use client'

import Link from 'next/link'
import { useActionState, useEffect, useRef, useState } from 'react'
import { useCartStore } from '@/app/lib/store/cartStore'
import { submitOrder } from '@/app/(shop)/checkout/actions'
import type { Product } from '@/app/lib/types'

function formatPrice(price: number): string {
  return `PHP ${price.toFixed(0)}`
}

interface DisplayItem {
  productId: string
  productName: string
  quantity: number
  unitPrice: number
}

interface CartSummaryProps {
  items: DisplayItem[]
  total: number
  isLoading: boolean
}

function CartSummary({ items, total, isLoading }: CartSummaryProps) {
  return (
    <aside className="shop-checkout-summary">
      <h2 className="shop-checkout-summary__title">Order Summary</h2>

      {isLoading ? (
        <p style={{ color: '#9ca3af', fontSize: '0.875rem' }}>Loading order summary...</p>
      ) : (
        <>
          {items.map((item) => (
            <div key={item.productId} className="shop-checkout-summary__item">
              <span className="shop-checkout-summary__item-name">{item.productName}</span>
              <span className="shop-checkout-summary__item-qty">× {item.quantity}</span>
              <span className="shop-checkout-summary__item-price">
                {formatPrice(item.unitPrice * item.quantity)}
              </span>
            </div>
          ))}
          <div className="shop-checkout-summary__total">
            <span>Total</span>
            <span>{formatPrice(total)}</span>
          </div>
        </>
      )}

      <Link href="/cart" className="shop-checkout-summary__edit-link">
        Edit cart
      </Link>
    </aside>
  )
}

export default function CheckoutPage() {
  const items = useCartStore((state) => state.items)
  const clearCart = useCartStore((state) => state.clearCart)
  const hasHydrated = useCartStore((state) => state.hasHydrated)

  const [products, setProducts] = useState<Product[]>([])
  const [isSummaryLoading, setIsSummaryLoading] = useState(true)
  const [state, formAction, isPending] = useActionState(submitOrder, null)
  const hasCleared = useRef(false)

  // Fetch fresh product data for the order summary display
  useEffect(() => {
    if (!hasHydrated) return
    if (items.length === 0) {
      setIsSummaryLoading(false)
      return
    }

    const ids = items.map((item) => item.productId)
    fetch('/api/cart-products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ids }),
    })
      .then((res) => res.json())
      .then((data: { allProducts: Product[] }) => {
        setProducts(data.allProducts || [])
      })
      .catch((err) => {
        console.error('Failed to fetch checkout product data:', err)
      })
      .finally(() => {
        setIsSummaryLoading(false)
      })
  }, [hasHydrated, items])

  // Clear cart after successful order submission (redirect fires from server action)
  useEffect(() => {
    if (state && 'success' in state && state.success && !hasCleared.current) {
      hasCleared.current = true
      clearCart()
    }
  }, [state, clearCart])

  // Build display items from fetched products
  const productMap = new Map(products.map((p) => [p.id, p]))
  const displayItems: DisplayItem[] = items
    .map((item) => {
      const product = productMap.get(item.productId)
      return {
        productId: item.productId,
        productName: product?.name ?? 'Unknown product',
        quantity: item.quantity,
        unitPrice: product?.price ?? 0,
      }
    })
    .filter((item) => item.unitPrice > 0 || isSummaryLoading)

  const total = displayItems.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0)

  // Serialize cart items (productId + quantity only) for server action
  const cartItemsJson = JSON.stringify(items.map((i) => ({ productId: i.productId, quantity: i.quantity })))

  // Empty cart guard (after hydration)
  if (hasHydrated && items.length === 0 && !isPending) {
    return (
      <div className="shop-page shop-checkout-page">
        <div className="shop-container">
          <h1 className="shop-checkout-title">Checkout</h1>
          <p style={{ color: '#6b7280', marginBottom: '1.5rem' }}>
            Your cart is empty. Add some items before checking out.
          </p>
          <Link href="/shop" className="shop-btn-primary" style={{ display: 'inline-block', width: 'auto' }}>
            Browse the shop
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="shop-page shop-checkout-page">
      <div className="shop-container">
        <h1 className="shop-checkout-title">Checkout</h1>

        <div className="shop-checkout-layout">
          {/* Left: contact form */}
          <div>
            <form action={formAction} className="shop-checkout-form">
              <input type="hidden" name="cartItems" value={cartItemsJson} />

              {state && 'error' in state && state.error && (
                <div className="shop-checkout-form__error" role="alert">
                  {state.error}
                </div>
              )}

              <div className="shop-checkout-field">
                <label htmlFor="checkout-name">Full Name *</label>
                <input
                  id="checkout-name"
                  type="text"
                  name="name"
                  placeholder="Your full name"
                  required
                  autoComplete="name"
                  defaultValue={state && 'formData' in state ? (state.formData?.name as string) || '' : ''}
                />
              </div>

              <div className="shop-checkout-field">
                <label htmlFor="checkout-email">Email *</label>
                <input
                  id="checkout-email"
                  type="email"
                  name="email"
                  placeholder="your@email.com"
                  required
                  autoComplete="email"
                  defaultValue={state && 'formData' in state ? (state.formData?.email as string) || '' : ''}
                />
              </div>

              <div className="shop-checkout-field">
                <label htmlFor="checkout-phone">
                  Phone{' '}
                  <span style={{ color: '#9ca3af', fontWeight: 400 }}>(optional)</span>
                </label>
                <input
                  id="checkout-phone"
                  type="tel"
                  name="phone"
                  placeholder="+63 9XX XXX XXXX"
                  autoComplete="tel"
                  defaultValue={state && 'formData' in state ? (state.formData?.phone as string) || '' : ''}
                />
                <p className="shop-checkout-field__hint">For meetup coordination</p>
              </div>

              <div className="shop-checkout-field">
                <label htmlFor="checkout-notes">
                  Notes{' '}
                  <span style={{ color: '#9ca3af', fontWeight: 400 }}>(optional)</span>
                </label>
                <textarea
                  id="checkout-notes"
                  name="notes"
                  placeholder="Any questions or special requests..."
                  defaultValue={state && 'formData' in state ? (state.formData?.notes as string) || '' : ''}
                />
              </div>

              <button type="submit" disabled={isPending} className="shop-btn-primary">
                {isPending ? 'Placing order...' : 'Place Order'}
              </button>

              <p style={{ fontSize: '0.8125rem', color: '#9ca3af', textAlign: 'center', margin: 0 }}>
                No payment needed — orders are fulfilled via meetup
              </p>
            </form>
          </div>

          {/* Right: order summary */}
          <CartSummary items={displayItems} total={total} isLoading={isSummaryLoading} />
        </div>
      </div>
    </div>
  )
}
