import type { Metadata } from "next"
import Link from "next/link"
import { featuredCaseStudies, professionalTimeline } from "@/app/lib/portfolio-data"

export const metadata: Metadata = {
  title: "Portfolio Home",
  description: "Rails engineer portfolio with case studies, engineering details, and resume.",
  alternates: {
    canonical: "/portfolio",
  },
  openGraph: {
    title: "Rails Engineer Portfolio",
    description: "Rails engineer portfolio with case studies, engineering details, and resume.",
  },
}

export default function PortfolioHomePage() {
  return (
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
            {featuredCaseStudies.map((caseStudy) => (
              <article className="portfolio-card" key={caseStudy.title}>
                <h3 className="portfolio-heading-3">{caseStudy.title}</h3>
                <p className="portfolio-text-muted">{caseStudy.description}</p>
                <Link className="portfolio-link" href={caseStudy.href}>
                  {caseStudy.linkLabel}
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="timeline" className="portfolio-section">
        <div className="portfolio-container">
          <h2 className="portfolio-heading-2">Professional Timeline</h2>
          <ul className="portfolio-timeline-list">
            {professionalTimeline.map((entry) => (
              <li className="portfolio-timeline-item" key={entry.title}>
                <p className="portfolio-timeline-period">{entry.period}</p>
                <h3 className="portfolio-heading-3">{entry.title}</h3>
                <p className="portfolio-text-muted">{entry.summary}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </main>
  )
}
