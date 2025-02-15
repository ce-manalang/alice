import Link from "next/link"
import type { Post } from "@/app/lib/posts"

export function ComicNavigation({
  prev,
  next,
}: {
  prev: Post | null
  next: Post | null
}) {
  return (
    <nav className="comic-navigation">
      {prev && (
        <Link href={`/${prev.slug}`} className="comic-nav-link prev">
          ← {prev.title}
        </Link>
      )}

      <Link href="/" className="comic-nav-link home">
        All Comics
      </Link>

      {next && (
        <Link href={`/${next.slug}`} className="comic-nav-link next">
          {next.title} →
        </Link>
      )}
    </nav>
  )
}

