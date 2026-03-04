import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Engineering',
  description: 'Rails, system design, infrastructure, and tools used in production.',
  openGraph: {
    title: 'Engineering | Rails Engineer',
    description: 'Rails, system design, infrastructure, and tools used in production.',
  },
}

export default function EngineeringPage() {
  return (
    <div className="portfolio-page">
      <section className="portfolio-section">
        <div className="portfolio-container">
          <h1 className="portfolio-heading-1">Engineering</h1>
          <p className="portfolio-text-muted">Tech stack and engineering practices. Content coming in Phase 5.</p>
        </div>
      </section>
    </div>
  )
}
