import { SOCIAL_LINKS } from '@/app/lib/constants'

export default function Footer() {
  return (
    <footer
      style={{
        borderTop: '1px solid #e5e7eb',
        paddingTop: '2rem',
        paddingBottom: '2rem',
        marginTop: 'auto',
        fontFamily: "'Inter', system-ui, sans-serif",
      }}
    >
      <div className="shop-container">
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ display: 'flex', gap: '1.25rem' }}>
            <a
              href={SOCIAL_LINKS.instagram}
              target="_blank"
              rel="noopener noreferrer"
              style={{ fontSize: '0.875rem', color: '#6b7280', textDecoration: 'none' }}
              className="hover:text-accent"
            >
              instagram
            </a>
            <a
              href={SOCIAL_LINKS.twitter}
              target="_blank"
              rel="noopener noreferrer"
              style={{ fontSize: '0.875rem', color: '#6b7280', textDecoration: 'none' }}
              className="hover:text-accent"
            >
              twitter
            </a>
          </div>
          <p style={{ fontSize: '0.8rem', color: '#9ca3af', margin: 0 }}>
            &copy; {new Date().getFullYear()} centimentalcomics &middot; made in ph
          </p>
        </div>
      </div>
    </footer>
  )
}
