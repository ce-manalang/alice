import Link from 'next/link'

export default function Navigation() {
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
                <Link href="/about" style={{ fontSize: '0.9rem', color: '#374151', textDecoration: 'none', fontWeight: 500 }}
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
            </ul>
          </nav>
        </div>
      </div>
    </header>
  )
}
