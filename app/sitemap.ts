import { getAllSlugs } from "./lib/posts"

export default async function sitemap() {
  const baseUrl = "https://centimentalcomics.com"

  // Get all comic slugs
  const slugs = await getAllSlugs()

  // Create entries for all comics
  const comicUrls = slugs.map((slug) => ({
    url: `${baseUrl}/${slug}`,
    lastModified: new Date(),
  }))

  // Add static pages
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
    },
  ]

  return [...staticPages, ...comicUrls]
}

