import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Resume',
  description: 'Experience, skills, and career progression as a Rails engineer.',
  openGraph: {
    title: 'Resume | Rails Engineer',
    description: 'Experience, skills, and career progression as a Rails engineer.',
  },
}

export default function ResumePage() {
  return (
    <div className="portfolio-page">
      <section className="portfolio-section">
        <div className="portfolio-container">
          <h1 className="portfolio-heading-1">Resume</h1>
          <p className="portfolio-text-muted">Experience and skills. Content coming in Phase 5.</p>
        </div>
      </section>
    </div>
  )
}
