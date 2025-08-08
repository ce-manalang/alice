import Image from "next/image";
import Link from "next/link";
import { getPosts, type Post } from "@/app/lib/posts";
import { Suspense } from "react";
import { Pagination } from "./components/pagination";
import { LoadingSkeleton } from "./components/loading-skeleton";
import type { Metadata } from "next"

// Function to format date as "Month Day, Year"
function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const month = date.toLocaleDateString('en-US', { month: 'long' });
  const day = date.getDate(); // This gives us the day without leading zero
  const year = date.getFullYear();
  return `${month} ${day}, ${year}`;
}

export const metadata: Metadata = {
  title: "centimentalcomics",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "centimentalcomics",
    description: "some comics about art and internet",
  },
}

interface HomeProps {
  searchParams: Promise<{ page?: string }>
}

export default async function Home({ searchParams }: HomeProps) {
  const params = await searchParams
  const currentPage = params.page ? Number.parseInt(params.page) : 1

  return (
    <div className="container">
      <header className="header">
        <h1 className="title">
          <a href="/">centimentalcomics</a>
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
        <ComicsList page={currentPage} />
      </Suspense>

      {/* <section className="docs-share"> */}
      {/* <p className="u-text-center u-margin-0"> */}
      {/* &lt;&lt; newer 1<a href="pages-2">2</a> */}
      {/* <a href="pages-3">3</a> */}
      {/* <a href="pages-4">4</a> */}
      {/* <a href="pages-5">5</a> */}
      {/* <a href="pages-2">older &gt;&gt;</a> */}
      {/* </p> */}
      {/* <span class="docs-header">further reading</span> */}
      {/* <a class="button docs-button docs-button-share docs-bg-instagram" href="https://instagram.com/centimentalcomics" target="_blank" alt="centimentalcomics instagram" title="https://instagram.com/centimentalcomics">instagram</a> */}
      {/* <a class="button docs-button docs-button-share docs-bg-twitter" href="https://twitter.com/centimentalcomx" target="_blank" alt="centimentalcomics twitter" title="https://twitter.com/centimentalcomx">twitter</a> */}
      {/* <a class="button docs-button docs-button-share docs-bg-facebook" href="https://facebook.com/centimentalcomics" target="_blank" alt="centimentalcomics facebook" title="https://facebook.com/centimentalcomics">facebook</a> */}
      {/* <a class="button docs-button docs-button-share docs-bg-tumblr" href="https://centimentalcomics.tumblr.com" target="_blank" alt="centimentalcomics facebook" title="https://centimentalcomics.tumblr.com">tumblr</a> */}
      {/* <a class="button docs-button docs-button-share docs-bg-email" href="mailto:cm@centimentalcomics.com" target="_blank" alt="centimentalcomics email" title="mailto:cm@centimentalcomics.com">email</a> */}
      {/* </section> */}

      <section className="footer">
        <h3 className="u-text-center">© 2025 | made in ph 💘</h3>
      </section>
    </div>
  );
}

async function ComicsList({ page }: { page: number }) {
  const { posts, totalPages, currentPage } = await getPosts(page);

  return (
    <>
      {posts.map((post: Post, index: number) => (
        <article key={index} className="docs-section">
          {
						post.image_urls.map((image_url, index) => (
							<div key={index}>
								<Link href={`/${post.slug}`}>
									<Image
										src={image_url}
										alt={post.title}
										width="0"
										height="0"
										sizes="100vw"
										priority={index === 0}
										style={{ width: "100%", height: "auto" }}
									/>
								</Link>
							</div>
						))
          }
          <h3 className="u-pull-right">
            <strong>{formatDate(post.date)}</strong>
          </h3>
          <h2 className="docs-header">
            <Link href={`/${post.slug}`}>{post.title}</Link>
          </h2>
          <div dangerouslySetInnerHTML={{ __html: post.blurb.replace('</p>', ' <a href="/' + post.slug + '">read more</a></p>') }} />
        </article>
      ))}

      <Pagination currentPage={currentPage} totalPages={totalPages} />
    </>
  );
}
