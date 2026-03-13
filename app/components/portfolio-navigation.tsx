import Link from 'next/link'

export default function PortfolioNavigation() {
  return (
    <header className="portfolio-nav-header">
      <div className="portfolio-container">
        <nav className="portfolio-nav" aria-label="Portfolio navigation">
          <div className="portfolio-nav-brand">
            <Link href="/portfolio" className="portfolio-nav-brand-link">
              centimentalcomics
            </Link>
          </div>
          <ul className="portfolio-nav-list">
            <li>
              <Link href="/portfolio" className="portfolio-nav-link">home</Link>
            </li>
            <li>
              <Link href="/engineering" className="portfolio-nav-link">engineering</Link>
            </li>
            <li>
              <Link href="/case-studies" className="portfolio-nav-link">case studies</Link>
            </li>
            <li>
              <Link href="/resume" className="portfolio-nav-link">resume</Link>
            </li>
            <li>
              <Link href="/contact" className="portfolio-nav-link">contact</Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  )
}
