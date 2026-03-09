import type { Metadata } from 'next'
import { engineeringCategories } from '@/app/lib/portfolio-data'

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
          <p className="portfolio-text-muted">
            Operationally grounded stack decisions across backend, frontend, infrastructure, and day-to-day tooling.
          </p>
        </div>
      </section>

      <section className="portfolio-section portfolio-section-tight">
        <div className="portfolio-container">
          <div className="portfolio-engineering-category-grid">
            {engineeringCategories.map((category) => (
              <article className="portfolio-card portfolio-engineering-category" key={category.key}>
                <h2 className="portfolio-heading-2 portfolio-engineering-category-title">{category.label}</h2>
                <p className="portfolio-text-muted portfolio-engineering-category-summary">{category.summary}</p>
                <ul className="portfolio-engineering-capability-list">
                  {category.capabilities.map((item) => (
                    <li className="portfolio-engineering-capability-item" key={item.name}>
                      <h3 className="portfolio-heading-3">{item.name}</h3>
                      <p className="portfolio-engineering-capability-capability">{item.capability}</p>
                      <p className="portfolio-text-muted portfolio-engineering-capability-note">{item.usageNote}</p>
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
