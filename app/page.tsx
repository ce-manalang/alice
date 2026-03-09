import type { Metadata } from 'next'
import Link from 'next/link'
import PortfolioNavigation from '@/app/components/portfolio-navigation'
import PortfolioFooter from '@/app/components/portfolio-footer'

export const metadata: Metadata = {
  title: 'Rails Engineer Portfolio',
  description: 'Rails engineer portfolio with case studies, engineering details, and resume.',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Rails Engineer Portfolio',
    description: 'Rails engineer portfolio with case studies, engineering details, and resume.',
  },
}

export default function HomePage() {
  return (
    <>
      <PortfolioNavigation />
      <main className="portfolio-page">
        <section id="hero" className="portfolio-section">
          <div className="portfolio-container">
            <h1 className="portfolio-heading-1">Rails Engineer for Production Systems</h1>
            <p className="portfolio-text-muted">
              I build and maintain Rails applications with clear architecture, measurable performance outcomes, and stable long-term operations.
            </p>
            <div className="portfolio-button-row">
              <Link className="portfolio-button-primary" href="/case-studies">
                View Case Studies
              </Link>
              <Link className="portfolio-button-secondary" href="/resume">
                View Resume
              </Link>
            </div>
          </div>
        </section>

        <section id="strengths" className="portfolio-section">
          <div className="portfolio-container">
            <h2 className="portfolio-heading-2">Core Strengths</h2>
            <ul className="portfolio-list">
              <li>Rails delivery from feature design through production support.</li>
              <li>System design focused on maintainability and predictable scaling.</li>
              <li>Performance optimization with practical profiling and query tuning.</li>
              <li>Deployment and operations across modern cloud infrastructure.</li>
              <li>Maintenance workflows that prioritize reliability and incident response.</li>
            </ul>
          </div>
        </section>

        <section id="featured-case-studies" className="portfolio-section">
          <div className="portfolio-container">
            <h2 className="portfolio-heading-2">Featured Case Studies</h2>
            <p className="portfolio-text-muted">Selected production projects and technical outcomes.</p>
            <div className="portfolio-grid">
              <article className="portfolio-card">
                <h3 className="portfolio-heading-3">Case Study 01</h3>
                <p className="portfolio-text-muted">End-to-end Rails delivery with checkout and fulfillment workflows.</p>
                <Link className="portfolio-link" href="/case-studies">
                  Read full case study
                </Link>
              </article>
              <article className="portfolio-card">
                <h3 className="portfolio-heading-3">Case Study 02</h3>
                <p className="portfolio-text-muted">Portfolio route architecture and SEO baseline migration.</p>
                <Link className="portfolio-link" href="/case-studies">
                  Read full case study
                </Link>
              </article>
              <article className="portfolio-card">
                <h3 className="portfolio-heading-3">Case Study 03</h3>
                <p className="portfolio-text-muted">Application maintenance practices for sustained production quality.</p>
                <Link className="portfolio-link" href="/case-studies">
                  Read full case study
                </Link>
              </article>
            </div>
          </div>
        </section>

        <section id="timeline" className="portfolio-section">
          <div className="portfolio-container">
            <h2 className="portfolio-heading-2">Professional Timeline</h2>
            <ul className="portfolio-list">
              <li>Early career: web fundamentals, delivery ownership, and client collaboration.</li>
              <li>Rails specialization: backend architecture, data modeling, and testing workflows.</li>
              <li>Current focus: production systems, portfolio case studies, and engineering rigor.</li>
            </ul>
          </div>
        </section>
      </main>
      <PortfolioFooter />
    </>
  )
}
