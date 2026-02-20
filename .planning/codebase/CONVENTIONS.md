# Coding Conventions

**Analysis Date:** 2026-02-20

## Naming Patterns

**Files:**
- React components in `app/components/`: kebab-case (e.g., `comic-navigation.tsx`, `loading-skeleton.tsx`)
- Page components: kebab-case in dynamic route folders (e.g., `[slug]/page.tsx`, `[id]/page.tsx`)
- Utility/lib files: camelCase (e.g., `posts.ts`, `supabase.ts`, `datocms.ts`, `useSupabase.ts`)
- Configuration files: camelCase (e.g., `tailwind.config.ts`, `next.config.ts`)

**Functions:**
- React components (PascalCase): `Pagination`, `LoadingSkeleton`, `ComicNavigation`, `SupabaseExample`
- Utility functions (camelCase): `formatDate`, `fetchAllPosts`, `getPosts`, `getPost`, `mapDatoComicToPost`, `datocmsRequest`
- Hook functions (camelCase with `use` prefix): `useAuth`, `useSupabaseQuery`, `useSupabaseRecord`, `useSupabaseMutation`
- Private/helper functions (camelCase): `mapDatoComicToPost`, `fetchAllPosts`, `handleError`

**Variables:**
- State variables (camelCase): `formData`, `currentPage`, `isSignUp`, `user`, `loading`
- Constants (UPPER_SNAKE_CASE for API configs): `API_URL`, `ITEMS_PER_PAGE`, `DATOCMS_API_URL`
- React props (camelCase): `currentPage`, `totalPages`, `searchParams`

**Types/Interfaces:**
- PascalCase for all type definitions: `Post`, `Product`, `PageProps`, `HomeProps`, `CheckoutPageProps`
- Extend with more specific suffixes when needed: `DatocmsGraphQLResponse<T>`, `DatocmsGraphQLError`
- Database types also PascalCase: `Database`

## Code Style

**Formatting:**
- No ESLint or Prettier config detected - follows implicit Next.js/TypeScript defaults
- Indentation: 2 spaces (observed consistently across all files)
- Line length: No strict enforcement, varies but most lines under 100 characters
- Quote style: Double quotes for strings (JavaScript/JSX)

**Linting:**
- TypeScript strict mode enabled in `tsconfig.json` (strict: true)
- Module resolution: bundler
- JSX: preserve mode (uses React 19)
- No external linter detected - relies on TypeScript for type checking

## Import Organization

**Order:**
1. Next.js core imports (`next/image`, `next/link`, `next/navigation`, `next/font/google`)
2. Third-party libraries (`@supabase/supabase-js`, `react`, `use-debounce`)
3. Next.js provided libraries (`@next/third-parties/google`)
4. Internal app imports (using `@/` alias)
5. Type imports (using `type` keyword)

**Path Aliases:**
- `@/*` maps to project root (defined in `tsconfig.json`)
- Used consistently across all files: `@/app/lib/posts`, `@/app/components/pagination`
- Single alias pattern, not multiple variants

**Example import structure from `app/[slug]/page.tsx`:**
```typescript
import Image from "next/image"
import Link from "next/link"
import { getPost } from "@/app/lib/posts"
import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { LoadingSkeleton } from "@/app/components/loading-skeleton"
import { Suspense } from "react"
import { formatDate } from "@/app/lib/utils"
```

## Error Handling

**Patterns:**
- Try-catch blocks for async operations in server components (e.g., `app/shop/[id]/page.tsx`)
- Supabase operations use destructured error returns: `const { error } = await operation`
- Console.error logging for development: `console.error("Error fetching posts from DatoCMS:", error)`
- Throwing errors with descriptive messages: `throw new Error("Missing DATOCMS_API_TOKEN...")`
- Next.js `notFound()` function for 404 cases in dynamic routes
- Fallback data structures when errors occur: `return [] as T[]`, `return null`

**Error handling in library functions (`app/lib/database.ts`):**
```typescript
const handleError = (error: any, operation: string) => {
  console.error(`Database ${operation} error:`, error)
  throw new Error(`Failed to ${operation}: ${error.message}`)
}
```

**Error handling in components (`app/components/SupabaseExample.tsx`):**
```typescript
const { error } = isSignUp
  ? await signUp(email, password)
  : await signIn(email, password)

if (error) {
  alert(`Authentication error: ${error.message}`)
}
```

## Logging

**Framework:** Console object (no logging framework detected)

**Patterns:**
- `console.error()` for errors with context: `console.error("Error fetching posts from DatoCMS:", error)`
- `console.log()` for debugging messages: `console.log("Posts cache cleared (disabled)")`
- Include operation context in messages: `Database ${operation} error:`
- Log errors twice for detailed context when available: `console.error("Error details:", error)`
- Prefix logs with domain/module name: `"Error fetching posts from DatoCMS"`, `"Database ${operation} error"`

## Comments

**When to Comment:**
- Function-level explanations for non-obvious logic
- Helper function descriptions explaining transformations
- Sections clarifying business logic or special handling

**Patterns observed:**
```typescript
// GraphQL query for products
const PRODUCTS_QUERY = `...`

// Type for the product data
interface Product { ... }

// Helper to convert DatoCMS comic records to Post shape used by the app
function mapDatoComicToPost(...) { ... }

// Decode HTML entities in body and blurb
let decodedBody = comic.body || ""

// Handle numeric HTML entities
decodedBody = decodedBody.replace(/&#(\d+);/g, ...)

// Hook for authentication state
export function useAuth() { ... }

// Example: Fetch posts
const { data: posts, ... } = useSupabaseQuery(...)
```

**JSDoc/TSDoc:**
- Not used - relies on TypeScript types and inline comments
- Function signatures fully typed with parameters and return types
- Type annotations preferred over documentation

## Function Design

**Size:** Functions are generally focused and under 50 lines
- Map/transform functions: 5-20 lines
- Component render functions: 20-100+ lines (complex layouts)
- Async data functions: 15-50 lines
- Utility helpers: 5-15 lines

**Parameters:**
- Props passed via object destructuring: `{ currentPage, totalPages }`
- React component props with interface definitions
- Query/search params unwrapped from Promise in Server Components: `const params = await searchParams`
- Optional parameters with defaults using spread operator defaults

**Return Values:**
- Explicit return types via TypeScript interfaces
- Functions return objects with metadata: `{ posts, totalPages, currentPage }`
- Nullable returns for optional data: `Post | null`, `T | null`
- Promise return types for async functions: `Promise<Post[]>`, `Promise<{ next: Post | null; prev: Post | null }>`

**Example from `app/lib/posts.ts`:**
```typescript
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
```

## Module Design

**Exports:**
- Named exports for functions, types, and components
- Default exports for React components in pages and components
- Example exports in library files:
  - `app/lib/posts.ts`: `export interface Post`, `export function clearPostsCache()`, `export async function getPosts()`
  - `app/lib/supabase.ts`: `export const supabase`, `export interface Database`, `export const typedSupabase`
  - `app/components/pagination.tsx`: `export function Pagination(...)`

**Barrel Files:**
- Not used - direct imports from specific files
- Each component/utility imported directly: `import { Pagination } from "./components/pagination"`

## Async/Await Pattern

**Server Components:**
- Async function syntax for page/layout components
- Props with `Promise` types: `params: Promise<{ slug: string }>`
- Await props before destructuring: `const params = await searchParams`
- Suspense boundaries with async components for streaming UI

**Client Components:**
- Use `'use client'` directive
- Hook-based async patterns with custom hooks: `useAuth()`, `useSupabaseQuery()`
- State management with `useState` for form data
- Callback functions for handlers: `const handleInputChange = (e: React.ChangeEvent<...>) => {...}`

## TypeScript Usage

**Strict Mode:**
- Enabled globally - all code uses strict type checking
- Types required for all function parameters and returns
- Generic types used for reusable components: `useSupabaseQuery<T>()`, `fetchData<T>()`
- Type assertions used sparingly with `as` keyword

**Generic Functions:**
```typescript
export async function datocmsRequest<T>(
  query: string,
  variables?: Record<string, unknown>,
): Promise<T> { ... }

export async function fetchData<T>(
  table: string,
  options?: {...}
): Promise<T[]> { ... }
```

---

*Convention analysis: 2026-02-20*
