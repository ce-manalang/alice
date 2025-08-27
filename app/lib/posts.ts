import { datocmsRequest } from "@/app/lib/datocms"
import { ALL_COMICS_QUERY } from "@/app/lib/datocms-queries"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"

export interface Post {
  slug: string
  title: string
  image_urls: Array<string>
  date: string
  blurb: string
  body: string
  prev_comic_slug: string
  next_comic_slug?: string
  id?: string
}

// Cache disabled for debugging
// let cachedPosts: Post[] | null = null

// Function to clear the cache (useful for debugging)
export function clearPostsCache() {
  // cachedPosts = null
  console.log("Posts cache cleared (disabled)")
}

// Helper to convert DatoCMS comic records to Post shape used by the app
function mapDatoComicToPost(comic: {
  id: string
  title: string
  image: { alt: string | null; url: string }[] | { alt: string | null; url: string } | null
  nextComic?: { slug: string } | null
  prevComic?: { slug: string } | null
  slug: string
  blurb?: string | null
  body?: string | null
  date?: string | null
}): Post {
  const imageArray = Array.isArray(comic.image) ? comic.image : comic.image ? [comic.image] : []
  
  // Decode HTML entities in body and blurb
  let decodedBody = comic.body || ""
  let decodedBlurb = comic.blurb || ""
  
  if (decodedBody) {
    decodedBody = decodedBody
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/&nbsp;/g, ' ')
      .replace(/&#x27;/g, "'")
      .replace(/&#x2F;/g, '/')
      .replace(/&#x60;/g, '`')
      .replace(/&#x3D;/g, '=')
      .replace(/&#x2B;/g, '+')
      .replace(/&#x23;/g, '#')
      .replace(/&#x25;/g, '%')
      .replace(/&#x40;/g, '@')
      .replace(/&#x5B;/g, '[')
      .replace(/&#x5D;/g, ']')
      .replace(/&#x5E;/g, '^')
      .replace(/&#x7B;/g, '{')
      .replace(/&#x7D;/g, '}')
      .replace(/&#x7C;/g, '|')
      .replace(/&#x7E;/g, '~')
      .replace(/&#x3C;/g, '<')
      .replace(/&#x3E;/g, '>')
    
    // Handle numeric HTML entities
    decodedBody = decodedBody.replace(/&#(\d+);/g, (match, dec) => {
      return String.fromCharCode(dec)
    })
    
    // Handle hex HTML entities
    decodedBody = decodedBody.replace(/&#x([0-9a-fA-F]+);/g, (match, hex) => {
      return String.fromCharCode(parseInt(hex, 16))
    })
  }
  
  if (decodedBlurb) {
    decodedBlurb = decodedBlurb
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/&nbsp;/g, ' ')
      .replace(/&#x27;/g, "'")
      .replace(/&#x2F;/g, '/')
      .replace(/&#x60;/g, '`')
      .replace(/&#x3D;/g, '=')
      .replace(/&#x2B;/g, '+')
      .replace(/&#x23;/g, '#')
      .replace(/&#x25;/g, '%')
      .replace(/&#x40;/g, '@')
      .replace(/&#x5B;/g, '[')
      .replace(/&#x5D;/g, ']')
      .replace(/&#x5E;/g, '^')
      .replace(/&#x7B;/g, '{')
      .replace(/&#x7D;/g, '}')
      .replace(/&#x7C;/g, '|')
      .replace(/&#x7E;/g, '~')
      .replace(/&#x3C;/g, '<')
      .replace(/&#x3E;/g, '>')
    
    // Handle numeric HTML entities
    decodedBlurb = decodedBlurb.replace(/&#(\d+);/g, (match, dec) => {
      return String.fromCharCode(dec)
    })
    
    // Handle hex HTML entities
    decodedBlurb = decodedBlurb.replace(/&#x([0-9a-fA-F]+);/g, (match, hex) => {
      return String.fromCharCode(parseInt(hex, 16))
    })
  }
  
  return {
    id: comic.id,
    slug: comic.slug,
    title: comic.title,
    image_urls: imageArray.map((img) => img.url),
    date: comic.date || "",
    blurb: decodedBlurb,
    body: decodedBody,
    prev_comic_slug: comic.prevComic?.slug || "",
    next_comic_slug: comic.nextComic?.slug || undefined,
  }
}

// Fetch all comics from DatoCMS (no caching)
async function fetchAllPosts(): Promise<Post[]> {
  try {
    const data = await datocmsRequest<{
      allComics: Array<{
        id: string
        title: string
        image: { alt: string | null; url: string }[] | { alt: string | null; url: string } | null
        nextComic?: { slug: string } | null
        prevComic?: { slug: string } | null
        slug: string
        blurb?: string | null
        body?: string | null
        date?: string | null
      }>
      _allComicsMeta: { count: number }
    }>(ALL_COMICS_QUERY)

    return data.allComics.map(mapDatoComicToPost)
  } catch (error) {
    console.error("Error fetching posts from DatoCMS:", error)
    console.error("Error details:", error)
    return []
  }
}

const ITEMS_PER_PAGE = 10

// Update the getPosts function to work with the API pagination
export async function getPosts(page = 1): Promise<{
  posts: Post[]
  totalPages: number
  currentPage: number
}> {
  const all = await fetchAllPosts()
  
  const start = (page - 1) * ITEMS_PER_PAGE
  const end = start + ITEMS_PER_PAGE
  const slice = all.slice(start, end)
  
  const totalPages = Math.max(1, Math.ceil(all.length / ITEMS_PER_PAGE))
  
  return { posts: slice, totalPages, currentPage: page }
}

export async function getPost(slug: string): Promise<Post | null> {
  const all = await fetchAllPosts()
  const found = all.find((p) => p.slug === slug)
  return found || null
}

export async function getNextPrevPosts(slug: string): Promise<{
  next: Post | null
  prev: Post | null
}> {
  const allPosts = await fetchAllPosts()
  const currentIndex = allPosts.findIndex((post) => post.slug === slug)

  return {
    prev: currentIndex > 0 ? allPosts[currentIndex - 1] : null,
    next: currentIndex < allPosts.length - 1 ? allPosts[currentIndex + 1] : null,
  }
}

export async function getAllSlugs(): Promise<string[]> {
  const allPosts = await fetchAllPosts()
  return allPosts.map((post) => post.slug)
}

