import type { Metadata } from 'next'
import Link from 'next/link'
import { getPublishedCaseStudies } from '@/app/lib/portfolio-data'

export const metadata: Metadata = {
  title: 'Case Studies',
  description: 'Production Rails case studies with measurable technical outcomes and implementation decisions.',
  openGraph: {
    title: 'Case Studies | Rails Engineer',
    description: 'Production Rails case studies with measurable technical outcomes and implementation decisions.',
  },
}

export default function CaseStudiesPage() {
  const studies = getPublishedCaseStudies()

  return (
    <div className="portfolio-page">
      <section className="portfolio-section">
        <div className="portfolio-container">
          <h1 className="portfolio-heading-1">Case Studies</h1>
          <p className="portfolio-text-muted">
            Production Rails delivery work with concrete context, decisions, and measurable outcomes.
          </p>
          <div className="portfolio-case-study-grid">
            {studies.map((study) => (
              <article className="portfolio-card portfolio-case-study-card" key={study.slug}>
                <h2 className="portfolio-heading-3 portfolio-case-study-title">{study.title}</h2>
                <p className="portfolio-case-study-label">Problem</p>
                <p className="portfolio-text-muted portfolio-case-study-body">{study.problemSummary}</p>
                <p className="portfolio-case-study-label">Measured Outcome</p>
                <p className="portfolio-text-muted portfolio-case-study-body">{study.measurableOutcomeSummary}</p>
                <Link className="portfolio-link" href={`/case-studies/${study.slug}`}>
                  View full case study
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
