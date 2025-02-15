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

// Cache the posts data to avoid unnecessary API calls
let cachedPosts: Post[] | null = null

// Helper function to fetch all posts from the API
async function fetchAllPosts(): Promise<Post[]> {
  if (cachedPosts) return cachedPosts

  try {
    const response = await fetch(`${API_URL}/comics`)

    if (!response.ok) {
      throw new Error(`Failed to fetch posts: ${response.status}`)
    }

    const data = await response.json()
    cachedPosts = data.posts || []
    return cachedPosts as Post[]
  } catch (error) {
    console.error("Error fetching posts:", error)
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
  try {
    const response = await fetch(`${API_URL}/comics?page=${page}?per_page=${ITEMS_PER_PAGE}`)

    if (!response.ok) {
      throw new Error(`Failed to fetch posts: ${response.status}`)
    }

    const data = await response.json()

    return {
      posts: data.posts || [],
      totalPages: data.pagination?.total_pages || 1,
      currentPage: data.pagination?.current_page || 1,
    }
  } catch (error) {
    console.error("Error fetching posts:", error)
    return {
      posts: [],
      totalPages: 1,
      currentPage: 1,
    }
  }
}

export async function getPost(slug: string): Promise<Post | null> {
  try {
    // Make a direct API call to get the specific post
    const response = await fetch(`${API_URL}/comics/${slug}`)

    if (!response.ok) {
      // If the response is not OK (e.g., 404), return null
      if (response.status === 404) {
        return null
      }
      throw new Error(`Failed to fetch post: ${response.status}`)
    }

    const post = await response.json()
    return post
  } catch (error) {
    console.error(`Error fetching post with slug "${slug}":`, error)
    return null
  }
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

