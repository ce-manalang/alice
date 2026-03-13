import Link from 'next/link'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { caseStudies, getCaseStudyBySlug } from '@/app/lib/portfolio-data'

type CaseStudyPageProps = {
  params: Promise<{
    slug: string
  }>
}

export async function generateStaticParams() {
  return caseStudies.map((caseStudy) => ({ slug: caseStudy.slug }))
}

export async function generateMetadata({ params }: CaseStudyPageProps): Promise<Metadata> {
  const { slug } = await params
  const caseStudy = getCaseStudyBySlug(slug)

  if (!caseStudy) {
    return {
      title: 'Case Study Not Found',
      description: 'This case study is not available.',
    }
  }

  const title = `${caseStudy.title} | Case Studies`

  return {
    title,
    description: caseStudy.problemSummary,
    openGraph: {
      title,
      description: caseStudy.measurableOutcomeSummary,
    },
  }
}

export default async function CaseStudyDetailPage({ params }: CaseStudyPageProps) {
  const { slug } = await params
  const caseStudy = getCaseStudyBySlug(slug)

  if (!caseStudy) {
    notFound()
  }

  return (
    <div className="portfolio-page">
      <section className="portfolio-section">
        <div className="portfolio-container">
          <p className="portfolio-text-muted">Case Study</p>
          <h1 className="portfolio-heading-1">{caseStudy.title}</h1>
          <p>{caseStudy.problemSummary}</p>
        </div>
      </section>

      <section className="portfolio-section">
        <div className="portfolio-container">
          <h2 className="portfolio-heading-2">Context</h2>
          <p>{caseStudy.context}</p>
        </div>
      </section>

      <section className="portfolio-section">
        <div className="portfolio-container">
          <h2 className="portfolio-heading-2">Technical Challenges</h2>
          <ul>
            {caseStudy.technicalChallenges.map((challenge) => (
              <li key={challenge}>{challenge}</li>
            ))}
          </ul>
        </div>
      </section>

      <section className="portfolio-section">
        <div className="portfolio-container">
          <h2 className="portfolio-heading-2">Decisions</h2>
          <ul>
            {caseStudy.decisions.map((decision) => (
              <li key={decision.title}>
                <strong>{decision.title}:</strong> {decision.decision} Tradeoff: {decision.tradeoff}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="portfolio-section">
        <div className="portfolio-container">
          <h2 className="portfolio-heading-2">Outcomes</h2>
          <p>
            <strong>Measured impact:</strong> {caseStudy.measurableOutcomeSummary}
          </p>
          <ul>
            {caseStudy.outcomes.map((outcome) => (
              <li key={outcome}>{outcome}</li>
            ))}
          </ul>
        </div>
      </section>

      <section className="portfolio-section">
        <div className="portfolio-container">
          <h2 className="portfolio-heading-2">Reflection</h2>
          <p>{caseStudy.reflection}</p>
          <p>
            <Link href={caseStudy.cta.href} className="portfolio-button-primary">
              {caseStudy.cta.label}
            </Link>
          </p>
        </div>
      </section>
    </div>
  )
}
