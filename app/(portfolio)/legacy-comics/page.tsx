import Image from "next/image";
import Link from "next/link";
import { getPosts, type Post } from "@/app/lib/posts";
import { Suspense } from "react";
import { Pagination } from "@/app/components/pagination";
import { LoadingSkeleton } from "@/app/components/loading-skeleton";
import type { Metadata } from "next";
import { formatDate } from "@/app/lib/utils";

export const metadata: Metadata = {
  title: "Legacy Comics",
  description: "Archive of the original centimentalcomics homepage content.",
  alternates: {
    canonical: "/legacy-comics",
  },
  openGraph: {
    title: "Legacy Comics",
    description: "Archive of the original centimentalcomics homepage content.",
  },
};

interface LegacyComicsProps {
  searchParams: Promise<{ page?: string }>;
}

export default async function LegacyComicsPage({ searchParams }: LegacyComicsProps) {
  const params = await searchParams;
  const currentPage = params.page ? Number.parseInt(params.page, 10) : 1;

  return (
    <div className="container">
      <header className="header">
        <h1 className="title">
          <a href="/legacy-comics">centimentalcomics</a>
        </h1>
        <h2>some comics about art and internet</h2>
        <div className="value-props row"></div>
      </header>
      <div className="navbar-spacer"></div>
      <nav className="navbar">
        <div className="container">
          <ul className="navbar-list">
            <li className="navbar-item">
              <a className="navbar-link" href="/legacy-comics">
                home
              </a>
            </li>
            <li className="navbar-item">
              <a className="navbar-link" href="https://instagram.com/centimentalcomics" target="_blank" rel="noopener noreferrer">
                shop
              </a>
            </li>
            <li className="navbar-item">
              <a className="navbar-link" href="/about">
                about
              </a>
            </li>
          </ul>
        </div>
      </nav>

      <Suspense fallback={<LoadingSkeleton />}>
        <ComicsList page={currentPage} />
      </Suspense>

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
          {post.image_urls.map((image_url, imageIndex) => (
            <div key={imageIndex}>
              <Link href={`/${post.slug}`}>
                <Image
                  src={image_url}
                  alt={post.title}
                  width="0"
                  height="0"
                  sizes="100vw"
                  priority={imageIndex === 0}
                  style={{ width: "100%", height: "auto" }}
                />
              </Link>
            </div>
          ))}
          <h3 className="u-pull-right">
            <strong>{formatDate(post.date)}</strong>
          </h3>
          <h2 className="docs-header">
            <Link href={`/${post.slug}`}>{post.title}</Link>
          </h2>
          <div dangerouslySetInnerHTML={{ __html: post.blurb.replace("</p>", ` <a href="/${post.slug}">read more</a></p>`) }} />
        </article>
      ))}

      <Pagination currentPage={currentPage} totalPages={totalPages} />
    </>
  );
}
