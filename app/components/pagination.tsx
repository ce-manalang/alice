import Link from "next/link"

export function Pagination({
  currentPage,
  totalPages,
}: {
  currentPage: number
  totalPages: number
}) {
  return (
    <section className="docs-share">
      <p className="u-text-center u-margin-0">
        {currentPage > 1 && <Link href={`/?page=${currentPage - 1}`}>&lt;&lt; newer </Link>}

        {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
          <span key={pageNum}>
            {pageNum === currentPage ? <strong>{pageNum}</strong> : <Link href={`/?page=${pageNum}`}>{pageNum}</Link>}
            {pageNum < totalPages ? " " : ""}
          </span>
        ))}

        {currentPage < totalPages && <Link href={`/?page=${currentPage + 1}`}> older &gt;&gt;</Link>}
      </p>
    </section>
  )
}

