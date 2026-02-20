# Coding Conventions

**Analysis Date:** 2026-02-20

## Naming Patterns

**Files:**
- PascalCase for React component files: `Pagination.tsx`, `LoadingSkeleton.tsx`, `ComicNavigation.tsx`
- camelCase for utility and library files: `utils.ts`, `posts.ts`, `database.ts`, `datocms.ts`, `markdown.ts`
- Snake_case for segment directories and dynamic routes: `[slug]`, `[id]`, `(main)`

**Functions:**
- camelCase for regular functions: `formatDate()`, `fetchAllPosts()`, `mapDatoComicToPost()`
- camelCase for async functions: `getPosts()`, `getPost()`, `fetchData()`
- camelCase for exported utility functions: `clearPostsCache()`, `datocmsRequest()`
- PascalCase for React components: `Pagination`, `LoadingSkeleton`, `ComicNavigation`
- camelCase with prefix for handler functions: `handleError()`

**Variables:**
- camelCase for all variables: `currentPage`, `totalPages`, `imageArray`, `decodedBody`
- UPPER_SNAKE_CASE for constants: `API_URL`, `ITEMS_PER_PAGE`, `DATOCMS_API_URL`
- Destructured parameters use camelCase: `{ currentPage, totalPages }`

**Types/Interfaces:**
- PascalCase for all interfaces and types: `Post`, `Product`, `DatocmsGraphQLError`, `DatocmsGraphQLResponse`
- Generic type parameters use single letters or descriptive PascalCase: `<T>`, `<Database>`
- Optional fields use `?`: `id?: string`, `next_comic_slug?: string`

## Code Style

**Formatting:**
- No explicit linter config file found (no .eslintrc or prettier config)
- TypeScript strict mode enabled in `tsconfig.json`
- 2-space indentation is used (observed in code)
- Semicolons present in most code
- Double quotes used for strings in JSX attributes and most imports
- Single quotes used in some cases (GraphQL queries, inline strings)

**Linting:**
- No detected ESLint or Prettier configuration
- Code follows Next.js conventions implicitly
- TypeScript strict checks enforced: `"strict": true`
- No unused variables allowed by TypeScript strict mode

## Import Organization

**Order:**
1. External library imports (React, Next.js, third-party)
2. Type imports (`import type`)
3. Internal app imports (`import ... from "@/app/..."`)
4. Relative imports (rare in this codebase)

**Examples:**
```typescript
// External libraries first
import Image from "next/image"
import Link from "next/link"
import type React from "react"
import type { Metadata } from "next"

// Internal imports from @/app
import { getPosts, type Post } from "@/app/lib/posts"
import { Pagination } from "./components/pagination"
import { formatDate } from "@/app/lib/utils"

// Type imports separated
import type { Post } from "@/app/lib/posts"
```

**Path Aliases:**
- Uses `@/*` alias pointing to project root (defined in `tsconfig.json`)
- All internal imports use `@/app/...` prefix
- Examples: `@/app/lib/posts`, `@/app/lib/datocms`, `@/app/components/pagination`

## Error Handling

**Patterns:**
- Try-catch blocks wrapping async operations
- Console.error() for logging errors: `console.error("Error fetching posts from DatoCMS:", error)`
- Detailed error messages with context: `Error fetching product: ${error}`
- Generic error handler function used for database operations

**Error Handler Example:**
```typescript
const handleError = (error: any, operation: string) => {
  console.error(`Database ${operation} error:`, error)
  throw new Error(`Failed to ${operation}: ${error.message}`)
}
```

**Fallback Returns:**
- Return empty arrays on fetch errors: `return [] as T[]`
- Return null on single record errors: `return null`
- Return false on delete/file operation errors: `return false`
- Early returns for validation: `if (!comic) { notFound() }`

**Input Validation:**
- GraphQL errors checked explicitly: `if (json.errors && json.errors.length > 0)`
- Response data validated before use: `if (!json.data) { throw new Error(...) }`
- Environment variables validated at module load: `if (!supabaseUrl || !supabaseAnonKey) { throw ... }`

## Logging

**Framework:** Console (no external logging library used)

**Patterns:**
- `console.error()` for errors with descriptive context
- Errors logged with operation name and full error object
- Example: `console.error("Error fetching posts from DatoCMS:", error)`
- Detailed logging for debugging: `console.error("Error details:", error)`
- Info logs for cache clearing: `console.log("Posts cache cleared (disabled)")`

**When to Log:**
- Errors in try-catch blocks
- API request failures
- Cache operations
- NOT used for debug info in components

## Comments

**When to Comment:**
- HTML entity decoding regex blocks - complex logic documented
- GraphQL query constants documented with "GraphQL query for..." comment
- Cache-related code documented with "Cache disabled for debugging"
- Function purposes documented with single-line comments above function

**JSDoc/TSDoc:**
- Not systematically used in this codebase
- Comments use regular `//` style
- No @param, @returns documentation observed
- Type information provided through TypeScript instead

**Comment Examples:**
```typescript
// Cache disabled for debugging
// let cachedPosts: Post[] | null = null

// Helper to convert DatoCMS comic records to Post shape used by the app
function mapDatoComicToPost(comic: {...}): Post {
```

## Function Design

**Size:**
- Most functions are concise (10-30 lines)
- Complex logic (HTML entity decoding) reaches 80+ lines but contained in single function
- Generic database functions handle all CRUD operations with options object

**Parameters:**
- Positional parameters for simple functions: `formatDate(dateString: string)`
- Options object pattern for functions with multiple optional params:
```typescript
fetchData<T>(
  table: string,
  options?: {
    select?: string
    filters?: Record<string, any>
    orderBy?: { column: string; ascending?: boolean }
    limit?: number
  }
)
```
- Destructured parameters in React components:
```typescript
export function Pagination({ currentPage, totalPages }: { currentPage: number; totalPages: number })
```

**Return Values:**
- Functions return typed values with generics: `Promise<Post[]>`, `Promise<T>`
- Objects containing multiple values: `{ posts: Post[], totalPages: number, currentPage: number }`
- Nullable returns for optional data: `Post | null`
- Boolean for operation success: `Promise<boolean>`

## Module Design

**Exports:**
- Named exports for utility functions: `export function formatDate()`
- Named exports for components: `export function Pagination()`
- Default exports for page components: `export default function Home()`
- Exported interfaces for type sharing: `export interface Post`
- Exported constants: `export const DATOCMS_API_URL`

**Barrel Files:**
- Not used in this codebase
- Components imported directly: `import { Pagination } from "./components/pagination"`

**File Organization:**
- Each file has single responsibility
- Utility files contain pure functions
- API client files (datocms.ts, supabase.ts) handle external service communication
- Library files (posts.ts, database.ts) provide domain-specific operations
- Component files export single component

## Component Structure

**React Components:**
- Functional components using async when needed
- Props typed with inline object type annotations
- Components use destructuring for props
- Next.js page components are async by default
- Suspense boundaries used with fallback loading skeletons
- Dynamic route parameters accessed via `params` prop (Promise-wrapped in Next.js 15)

**Example Pattern:**
```typescript
export function Pagination({
  currentPage,
  totalPages,
}: {
  currentPage: number
  totalPages: number
}) {
  return (
    <section className="docs-share">
      {/* JSX content */}
    </section>
  )
}
```

## TypeScript Patterns

**Generics:**
- Used extensively for database functions: `fetchData<T>()`, `insertData<T>()`
- Response type inference: `datocmsRequest<{ allComics: Array<...> }>(query)`

**Type Aliases:**
- Inline type definitions in function signatures
- Interface usage for complex types: `interface Product`, `interface Post`
- Const assertions for GraphQL queries: `as const`

**Type Safety:**
- All variables properly typed
- Function return types explicitly declared
- Async functions return `Promise<Type>`
- Try-catch errors typed as `any` due to unknown error shapes

---

*Convention analysis: 2026-02-20*
