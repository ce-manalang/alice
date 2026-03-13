import type { Metadata } from 'next'
import { resumeExperience, resumeSelectedOutcomes, resumeSkillGroups, resumeSummary } from '@/app/lib/portfolio-data'

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
          <p className="portfolio-text-muted resume-summary">{resumeSummary}</p>
        </div>
      </section>

      <section className="portfolio-section resume-section">
        <div className="portfolio-container">
          <h2 className="portfolio-heading-2">Experience</h2>
          <ol className="resume-experience-list">
            {resumeExperience.map((entry) => (
              <li className="resume-experience-item" key={`${entry.period}-${entry.company}`}>
                <div className="resume-experience-header">
                  <p className="resume-period">{entry.period}</p>
                  <h3 className="portfolio-heading-3">{entry.role}</h3>
                  <p className="portfolio-text-muted">{entry.company}</p>
                </div>
                <ul className="resume-bullet-list">
                  {entry.bullets.map((bullet) => (
                    <li key={bullet}>{bullet}</li>
                  ))}
                </ul>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="portfolio-section resume-section">
        <div className="portfolio-container">
          <h2 className="portfolio-heading-2">Skills</h2>
          <div className="resume-skills-grid">
            {resumeSkillGroups.map((group) => (
              <article className="portfolio-card" key={group.category}>
                <h3 className="portfolio-heading-3">{group.category}</h3>
                <ul className="resume-chip-list">
                  {group.items.map((item) => (
                    <li className="resume-chip" key={item}>
                      {item}
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="portfolio-section resume-section">
        <div className="portfolio-container">
          <h2 className="portfolio-heading-2">Selected Outcomes</h2>
          <ul className="resume-bullet-list">
            {resumeSelectedOutcomes.map((outcome) => (
              <li key={outcome}>{outcome}</li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  )
}
