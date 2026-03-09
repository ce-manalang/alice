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
            <h1 className="portfolio-heading-1">Rails Engineer Delivering Stable, Maintainable Production Systems</h1>
            <p className="portfolio-text-muted">I ship and operate Rails applications that stay reliable under growth, changing requirements, and day-to-day production pressure.</p>
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
            <ul className="portfolio-strengths-list">
              <li className="portfolio-strength-card">
                <h3 className="portfolio-heading-3">Rails</h3>
                <p className="portfolio-text-muted">Delivered Rails features from planning through production support with predictable release cadence.</p>
              </li>
              <li className="portfolio-strength-card">
                <h3 className="portfolio-heading-3">System Design</h3>
                <p className="portfolio-text-muted">Designed service boundaries and data flows that reduced complexity and improved team handoffs.</p>
              </li>
              <li className="portfolio-strength-card">
                <h3 className="portfolio-heading-3">Performance</h3>
                <p className="portfolio-text-muted">Improved request and query performance with targeted profiling, indexing, and caching decisions.</p>
              </li>
              <li className="portfolio-strength-card">
                <h3 className="portfolio-heading-3">Deployment</h3>
                <p className="portfolio-text-muted">Managed deployments and environment changes with rollback-ready practices and release safety checks.</p>
              </li>
              <li className="portfolio-strength-card">
                <h3 className="portfolio-heading-3">Maintenance</h3>
                <p className="portfolio-text-muted">Kept production systems healthy through incident response, bug triage, and long-term code stewardship.</p>
              </li>
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
