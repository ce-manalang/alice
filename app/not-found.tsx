import Link from "next/link"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Page Not Found",
  description: "Sorry, the page you are looking for does not exist.",
}

export default function NotFound() {
  return (
    <div className="container">
      <header className="header">
        <h1 className="title">
          <Link href="/">centimentalcomics</Link>
        </h1>
        <h2>some comics about art and internet</h2>
      </header>
      <div className="navbar-spacer"></div>
      <nav className="navbar">
        <div className="container">
          <ul className="navbar-list">
            <li className="navbar-item">
              <a className="navbar-link" href="/">
                home
              </a>
            </li>
            <li className="navbar-item">
              <a className="navbar-link" href="about">
                about
              </a>
            </li>
          </ul>
        </div>
      </nav>

      <div className="docs-section">
        <h2 className="docs-header">Page Not Found</h2>
        <p>Sorry, the comic or page you're looking for doesn't exist.</p>
        <p>
          <Link href="/" className="button">
            Return to Home
          </Link>
        </p>
      </div>

      <footer className="footer">
        <h3 className="u-text-center">© 2023 | made in ph 💘</h3>
      </footer>
    </div>
  )
}

