import Link from 'next/link'

export default function PortfolioFooter() {
  return (
    <footer className="portfolio-footer">
      <div className="portfolio-container">
        <div className="portfolio-footer-inner">
          <div className="portfolio-footer-links">
            <Link href="/shop" className="portfolio-footer-link">shop</Link>
            <a
              href="https://github.com/centimentalcomics"
              target="_blank"
              rel="noopener noreferrer"
              className="portfolio-footer-link"
            >
              github
            </a>
          </div>
          <p className="portfolio-footer-copy">&copy; {new Date().getFullYear()} ce manalang</p>
        </div>
      </div>
    </footer>
  )
}
