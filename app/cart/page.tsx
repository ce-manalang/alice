'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useCartStore } from '@/app/lib/store/cartStore'
import { datocmsRequest } from '@/app/lib/datocms'
import type { Product, CartItem } from '@/app/lib/types'

// DatoCMS query — fetches only the fields needed for the cart display
const CART_PRODUCTS_QUERY = `
  query CartProducts($ids: [ItemId]!) {
    allProducts(filter: { id: { in: $ids } }) {
      id
      name
      price
      slug
      images { url alt }
      available
    }
  }
`

function formatPrice(price: number): string {
  return `PHP ${price.toFixed(0)}`
}

// ─── Quantity stepper (inline, no external library) ─────────────────────────

interface QtyStepperProps {
  quantity: number
  onDecrement: () => void
  onIncrement: () => void
  productName: string
}

function QtyStepper({ quantity, onDecrement, onIncrement, productName }: QtyStepperProps) {
  return (
    <div className="shop-qty-stepper" role="group" aria-label={`Quantity for ${productName}`}>
      <button
        className="shop-qty-stepper__btn"
        onClick={onDecrement}
        aria-label={quantity === 1 ? `Remove ${productName} from cart` : `Decrease quantity of ${productName}`}
      >
        −
      </button>
      <span className="shop-qty-stepper__value" aria-live="polite">{quantity}</span>
      <button
        className="shop-qty-stepper__btn"
        onClick={onIncrement}
        aria-label={`Increase quantity of ${productName}`}
      >
        +
      </button>
    </div>
  )
}

// ─── Cart item row ────────────────────────────────────────────────────────────

interface CartItemRowProps {
  item: CartItem
  product: Product
}

function CartItemRow({ item, product }: CartItemRowProps) {
  const removeFromCart = useCartStore((state) => state.removeFromCart)
  const updateQuantity = useCartStore((state) => state.updateQuantity)

  const subtotal = product.price * item.quantity

  const handleDecrement = () => {
    if (item.quantity === 1) {
      // Remove the item when decrementing below 1
      removeFromCart(item.productId)
    } else {
      updateQuantity(item.productId, item.quantity - 1)
    }
  }

  const handleIncrement = () => {
    updateQuantity(item.productId, item.quantity + 1)
  }

  return (
    <div className="shop-cart-item">
      {/* Thumbnail */}
      <div className="shop-cart-item__image">
        {product.images?.[0] ? (
          <Image
            src={product.images[0].url}
            alt={product.images[0].alt || product.name}
            fill
            sizes="80px"
            style={{ objectFit: 'cover' }}
          />
        ) : (
          <div style={{ width: '100%', height: '100%', backgroundColor: '#f3f4f6' }} />
        )}
      </div>

      {/* Details */}
      <div className="shop-cart-item__details">
        <h3 className="shop-cart-item__name">{product.name}</h3>
        <p className="shop-cart-item__price">{formatPrice(product.price)}</p>
        <QtyStepper
          quantity={item.quantity}
          onDecrement={handleDecrement}
          onIncrement={handleIncrement}
          productName={product.name}
        />
      </div>

      {/* Subtotal */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.5rem' }}>
        <span className="shop-cart-item__subtotal">{formatPrice(subtotal)}</span>
        {/* Remove button */}
        <button
          className="shop-cart-item__remove"
          onClick={() => removeFromCart(item.productId)}
          aria-label={`Remove ${product.name} from cart`}
          title="Remove item"
        >
          {/* X icon */}
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>
    </div>
  )
}

// ─── Main cart page ───────────────────────────────────────────────────────────

export default function CartPage() {
  const items = useCartStore((state) => state.items)
  const clearCart = useCartStore((state) => state.clearCart)
  const removeFromCart = useCartStore((state) => state.removeFromCart)

  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [removedNames, setRemovedNames] = useState<string[]>([])
  const [showNotice, setShowNotice] = useState(false)

  useEffect(() => {
    // Fetch fresh product data from DatoCMS on every cart page load
    // This ensures accurate names, prices, and availability
    async function loadProducts() {
      if (items.length === 0) {
        setProducts([])
        setIsLoading(false)
        return
      }

      try {
        const ids = items.map((item) => item.productId)
        const data = await datocmsRequest<{ allProducts: Product[] }>(CART_PRODUCTS_QUERY, { ids })
        const fetched = data.allProducts || []

        // Detect and auto-remove sold-out or missing items
        const fetchedIds = new Set(fetched.map((p) => p.id))
        const soldOutIds = new Set(
          fetched.filter((p) => p.available === false).map((p) => p.id)
        )

        const removedItems: string[] = []

        items.forEach((item) => {
          if (!fetchedIds.has(item.productId) || soldOutIds.has(item.productId)) {
            const product = fetched.find((p) => p.id === item.productId)
            removedItems.push(product?.name || 'A product')
            removeFromCart(item.productId)
          }
        })

        if (removedItems.length > 0) {
          setRemovedNames(removedItems)
          setShowNotice(true)
        }

        // Only show products that are available and still in cart
        setProducts(fetched.filter((p) => p.available !== false && fetchedIds.has(p.id)))
      } catch (error) {
        console.error('Failed to fetch cart products:', error)
        setProducts([])
      } finally {
        setIsLoading(false)
      }
    }

    loadProducts()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // Run once on mount — items from store are stable at load time

  // Build a product map for O(1) lookup
  const productMap = new Map(products.map((p) => [p.id, p]))

  // Calculate total from current cart items and fetched prices
  const total = items.reduce((sum, item) => {
    const product = productMap.get(item.productId)
    return sum + (product?.price ?? 0) * item.quantity
  }, 0)

  // Loading state
  if (isLoading) {
    return (
      <div className="shop-page shop-cart-page">
        <div className="shop-container">
          <h1 className="shop-cart-title">Cart</h1>
          <p style={{ color: '#6b7280', fontSize: '0.9375rem' }}>Loading your cart…</p>
        </div>
      </div>
    )
  }

  // Empty cart state
  if (items.length === 0) {
    return (
      <div className="shop-page shop-cart-page">
        <div className="shop-container">
          {showNotice && removedNames.length > 0 && (
            <div className="shop-cart-notice" role="alert">
              <span>
                {removedNames.join(', ')} {removedNames.length === 1 ? 'has' : 'have'} sold out and {removedNames.length === 1 ? 'was' : 'were'} removed from your cart.
              </span>
              <button
                className="shop-cart-notice__dismiss"
                onClick={() => setShowNotice(false)}
                aria-label="Dismiss notice"
              >
                ×
              </button>
            </div>
          )}
          <div className="shop-cart-empty">
            <h1 className="shop-cart-empty__title">Your cart is empty</h1>
            <p className="shop-cart-empty__text">Add some products from the shop to get started.</p>
            <Link href="/shop" className="shop-cart-empty__link">
              Browse the shop
            </Link>
          </div>
        </div>
      </div>
    )
  }

  // Cart with items
  return (
    <div className="shop-page shop-cart-page">
      <div className="shop-container">
        <h1 className="shop-cart-title">Cart</h1>

        {/* Sold-out removal notice */}
        {showNotice && removedNames.length > 0 && (
          <div className="shop-cart-notice" role="alert">
            <span>
              {removedNames.join(', ')} {removedNames.length === 1 ? 'has' : 'have'} sold out and {removedNames.length === 1 ? 'was' : 'were'} removed from your cart.
            </span>
            <button
              className="shop-cart-notice__dismiss"
              onClick={() => setShowNotice(false)}
              aria-label="Dismiss notice"
            >
              ×
            </button>
          </div>
        )}

        {/* Item list */}
        <div>
          {items.map((item) => {
            const product = productMap.get(item.productId)
            if (!product) return null // Skip items whose product wasn't found
            return (
              <CartItemRow key={item.productId} item={item} product={product} />
            )
          })}
        </div>

        {/* Cart summary: subtotal + checkout */}
        <div className="shop-cart-summary">
          <div className="shop-cart-summary__row">
            <span className="shop-cart-summary__label">Subtotal</span>
            <span className="shop-cart-summary__amount">{formatPrice(total)}</span>
          </div>
          <div className="shop-cart-actions">
            {/* Proceed to Checkout — links to /checkout (Phase 3 will build that page) */}
            <Link href="/checkout" className="shop-btn-primary">
              Proceed to Checkout
            </Link>
            {/* Clear cart */}
            <button
              className="shop-btn-secondary"
              onClick={() => clearCart()}
            >
              Clear Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
