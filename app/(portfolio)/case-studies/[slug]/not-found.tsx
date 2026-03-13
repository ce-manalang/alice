import Link from 'next/link'

export default function CaseStudyNotFound() {
  return (
    <div className="portfolio-page">
      <section className="portfolio-section">
        <div className="portfolio-container">
          <h1 className="portfolio-heading-1">Case Study Not Found</h1>
          <p className="portfolio-text-muted">
            The requested case study does not exist or is no longer published.
          </p>
          <p>
            <Link href="/case-studies" className="portfolio-button-secondary">
              Back to Case Studies
            </Link>
          </p>
        </div>
      </section>
    </div>
  )
}
