'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { useCartStore } from '@/app/lib/store/cartStore'

const SHOP_ROUTES = ['/shop', '/shop/about', '/faq', '/cart', '/checkout']

function CartIcon() {
  const [isMounted, setIsMounted] = useState(false)
  const totalItems = useCartStore((state) => state.getTotalItems())

  useEffect(() => {
    setIsMounted(true)
  }, [])

  return (
    <Link
      href="/cart"
      aria-label={`Cart${isMounted && totalItems > 0 ? `, ${totalItems} item${totalItems === 1 ? '' : 's'}` : ''}`}
      style={{ position: 'relative', display: 'flex', alignItems: 'center', color: '#374151', textDecoration: 'none' }}
    >
      {/* Shopping bag icon */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
        <line x1="3" y1="6" x2="21" y2="6" />
        <path d="M16 10a4 4 0 0 1-8 0" />
      </svg>

      {/* Item count badge — only rendered after client hydration */}
      {isMounted && totalItems > 0 && (
        <span
          style={{
            position: 'absolute',
            top: '-8px',
            right: '-8px',
            backgroundColor: '#ec4899',
            color: '#ffffff',
            borderRadius: '9999px',
            width: '18px',
            height: '18px',
            fontSize: '0.6875rem',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            lineHeight: 1,
          }}
        >
          {totalItems > 99 ? '99+' : totalItems}
        </span>
      )}
    </Link>
  )
}

export default function Navigation() {
  const pathname = usePathname()
  const isShopRoute = SHOP_ROUTES.some((route) => pathname === route || pathname.startsWith(route + '/'))

  if (!isShopRoute) return null

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
      <div className="shop-container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '3.5rem' }}>
          <Link
            href="/"
            style={{ fontWeight: 700, fontSize: '1rem', letterSpacing: '-0.02em', color: '#111111', textDecoration: 'none' }}
          >
            centimentalcomics
          </Link>
          <nav>
            <ul style={{ display: 'flex', gap: '1.5rem', listStyle: 'none', margin: 0, padding: 0, alignItems: 'center' }}>
              <li>
                <Link href="/shop" style={{ fontSize: '0.9rem', color: '#374151', textDecoration: 'none', fontWeight: 500 }}
                  className="hover:text-accent">
                  shop
                </Link>
              </li>
              <li>
                <Link href="/shop/about" style={{ fontSize: '0.9rem', color: '#374151', textDecoration: 'none', fontWeight: 500 }}
                  className="hover:text-accent">
                  about
                </Link>
              </li>
              <li>
                <Link href="/faq" style={{ fontSize: '0.9rem', color: '#374151', textDecoration: 'none', fontWeight: 500 }}
                  className="hover:text-accent">
                  faq
                </Link>
              </li>
              <li style={{ marginLeft: '0.5rem' }}>
                <CartIcon />
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </header>
  )
}
