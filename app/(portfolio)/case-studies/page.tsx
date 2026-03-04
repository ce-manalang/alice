import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Case Studies',
  description: 'Production Rails case studies with specific technical outcomes.',
  openGraph: {
    title: 'Case Studies | Rails Engineer',
    description: 'Production Rails case studies with specific technical outcomes.',
  },
}

export default function CaseStudiesPage() {
  return (
    <div className="portfolio-page">
      <section className="portfolio-section">
        <div className="portfolio-container">
          <h1 className="portfolio-heading-1">Case Studies</h1>
          <p className="portfolio-text-muted">Production case studies. Content coming in Phase 6.</p>
        </div>
      </section>
    </div>
  )
}
