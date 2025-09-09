import Image from "next/image"
import Link from "next/link"
import { getPost } from "@/app/lib/posts"
import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { LoadingSkeleton } from "@/app/components/loading-skeleton"
import { Suspense } from "react"
import { formatDate } from "@/app/lib/utils"

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata(props: PageProps): Promise<Metadata> {
  const params = await props.params
  const comic = await getPost(params.slug)

  if (!comic) {
    return {
      title: "Comic Not Found",
    }
  }

  // Get the first image URL for OG image
  const ogImage = comic.image_urls[0] || "/assets/images/og-image.jpg"

  return {
    title: comic.title,
    description: comic.blurb,
    alternates: {
      canonical: `/${comic.slug}`,
    },
    openGraph: {
      title: `centimentalcomics: ${comic.title}`,
      description: comic.blurb,
      url: `/${comic.slug}`,
      type: "article",
      publishedTime: comic.date,
      images: [
        {
          url: ogImage,
          width: 706,
          height: 832,
          alt: comic.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `centimentalcomics: ${comic.title}`,
      description: comic.blurb,
      images: [ogImage],
    },
  }
}

export default async function ComicPage(props: PageProps) {
  const params = await props.params
  const comic = await getPost(params.slug)

  if (!comic) {
    notFound()
  }

  // The HTML entities are now decoded in the posts.ts file
  const contentHtml = comic.body

  return (
    <div className="container">
      <header className="header">
        <h1 className="title">
          <Link href="/">centimentalcomics</Link>
        </h1>
        <h2>some comics about art and internet</h2>
        <div className="value-props row"></div>
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
              <a className="navbar-link" href="https://www.instagram.com/centimentalcomics?utm_source=shop">
                shop
              </a>
            </li>
            <li className="navbar-item">
              <a className="navbar-link" href="about">
                about
              </a>
            </li>
            {/*<li className="navbar-item">
              <a className="navbar-link" href="#" data-popover="#codeNavPopover">stories</a>
              <div id="codeNavPopover" className="popover">
                <ul className="popover-list">
                  <li className="popover-item">
                    <a className="popover-link">you asked for space</a>
                  </li>
                  <li className="popover-item">
                    <a className="popover-link">love letter to ruby</a>
                  </li>
                </ul>
              </div>
            </li>
            <li className="navbar-item">
              <a className="navbar-link" href="subscribe">more</a>
            </li>*/}
          </ul>
        </div>
      </nav>

      <Suspense fallback={<LoadingSkeleton />}>
        <article className="docs-section">
          {comic.image_urls.map((image_url, index) => (
            <div key={index}>
              <Link href={`/${comic.slug}`}>
                <Image
                  src={image_url}
                  alt={comic.title}
                  width="0"
									height="0"
									sizes="100vw"
                  style={{ width: "100%", height: "auto" }}
                />
              </Link>
            </div>
          ))}
          <h3 className="u-pull-right">
						<strong>{formatDate(comic.date)}</strong>
          </h3>
          <h2 className="docs-header">
            <Link href={`/${comic.slug}`}>{comic.title}</Link>
          </h2>
          {/* <p>{comic.body}</p> */}
          <div className="comic-content" dangerouslySetInnerHTML={{ __html: contentHtml }} />
        </article>
      </Suspense>

      <div>
        <p className="u-text-center">
          missed some stories? jump to the&nbsp;
          <Link href={`/${comic.prev_comic_slug}`}>previous day</Link>
          {comic.next_comic_slug ? (
            <>
              &nbsp;or the&nbsp;
              <Link href={`/${comic.next_comic_slug}`}>next day</Link>
            </>
          ) : (
            <></>
          )}
        </p>
      </div>

      <footer className="footer">
        <h3 className="u-text-center">© 2025 | made in ph 💘</h3>
      </footer>
    </div>
  )
}

