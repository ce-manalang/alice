import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'About',
  description: 'centimentalcomics creates educational CS products — zines, pins, and stationery — that make computer science feel human and accessible.',
  alternates: { canonical: '/shop/about' },
  openGraph: {
    title: 'About | centimentalcomics',
    description: 'centimentalcomics creates educational CS products — zines, pins, and stationery — that make computer science feel human and accessible.',
    url: '/shop/about',
  },
}

export default function AboutPage() {
  return (
    <div className="shop-page">
      <div className="shop-container" style={{ paddingTop: '3rem', paddingBottom: '5rem', maxWidth: '720px' }}>
        <h1 style={{ fontFamily: "'Inter', system-ui, sans-serif", fontSize: '2rem', fontWeight: 700, color: '#111111', margin: '0 0 2rem', lineHeight: 1.1 }}>
          About
        </h1>

        <div style={{ fontFamily: "'Inter', system-ui, sans-serif", fontSize: '1rem', color: '#374151', lineHeight: 1.75, display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <p>
            centimentalcomics is an independent studio making educational CS products that feel human — zines, stationery, and pins that bring warmth and personality to computer science learning.
          </p>
          <p>
            Founded by ce manalang, centimentalcomics started as a way to fill a gap in CS education: the gap between dry textbook content and the playful, curious spirit that actually brings people into programming. Every product is designed to be a small encouragement — a reminder that CS is creative, collaborative, and deeply human.
          </p>
          <p>
            The shop focuses on work that can live on a desk, in a notebook, or on a laptop. Products are made in small batches, sold at meetups and through this shop, and fulfilled in person wherever possible.
          </p>
          <p>
            centimentalcomics donates a portion of proceeds to CS education initiatives in underserved communities in the Philippines.
          </p>

          <div style={{ marginTop: '1rem', paddingTop: '1.5rem', borderTop: '1px solid #e5e7eb' }}>
            <p style={{ marginBottom: '0.5rem' }}>
              Questions? Reach out at{' '}
              <a href="mailto:cm@centimentalcomics.com" style={{ color: '#ec4899', textDecoration: 'none' }}>
                cm@centimentalcomics.com
              </a>
            </p>
            <p style={{ margin: 0 }}>
              <Link href="/shop" style={{ color: '#ec4899', textDecoration: 'none', fontWeight: 500 }}>
                Browse the shop →
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
