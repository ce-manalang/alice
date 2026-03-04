import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Get in touch about Rails engineering work.',
  openGraph: {
    title: 'Contact | Rails Engineer',
    description: 'Get in touch about Rails engineering work.',
  },
}

export default function ContactPage() {
  return (
    <div className="portfolio-page">
      <section className="portfolio-section">
        <div className="portfolio-container">
          <h1 className="portfolio-heading-1">Contact</h1>
          <p className="portfolio-text-muted">Contact form coming in Phase 6.</p>
        </div>
      </section>
    </div>
  )
}
