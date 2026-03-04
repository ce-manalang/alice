# Architecture

**Analysis Date:** 2026-02-20

## Pattern Overview

**Overall:** Server-Side Rendering (SSR) with Static Generation - Next.js 15 App Router pattern

**Key Characteristics:**
- Static site generation with server-side data fetching
- Headless CMS integration (DatoCMS) for content management
- Component-based UI with React Server Components
- Optional database layer for future features (Supabase configured but minimal current usage)
- Image optimization through Next.js Image component
- Type-safe API requests to external services

## Layers

**Presentation Layer:**
- Purpose: Render pages and components to users
- Location: `app/page.tsx`, `app/[slug]/page.tsx`, `app/shop/page.tsx`, `app/shop/[id]/page.tsx`, `app/about/page.tsx`, `app/components/`, `app/ui/`
- Contains: Page components (async functions returning JSX), reusable React components for UI patterns (Pagination, LoadingSkeleton, Navigation)
- Depends on: Data layer (posts, products), utilities for formatting
- Used by: Next.js router

**Data Layer:**
- Purpose: Fetch and transform data from external sources (DatoCMS, Supabase)
- Location: `app/lib/posts.ts`, `app/lib/datocms.ts`, `app/lib/database.ts`, `app/lib/supabase.ts`, `app/lib/datocms-queries.ts`
- Contains: GraphQL queries, API clients, data transformation/mapping functions, generic database helpers
- Depends on: Environment variables for API keys and URLs
- Used by: Page components, route handlers

**Utilities Layer:**
- Purpose: Shared helper functions for formatting, markdown processing, and type definitions
- Location: `app/lib/utils.ts`, `app/lib/markdown.ts`, `app/lib/useSupabase.ts`
- Contains: Date formatting functions, markdown-to-HTML conversion, hooks for client-side features
- Depends on: External libraries (remark, rehype, unist)
- Used by: Page components, data layer

**Layout Layer:**
- Purpose: Common UI structure across all pages (header, navigation, footer)
- Location: `app/layout.tsx`, global styles in `app/globals.css`
- Contains: Root metadata configuration, analytics setup (Google Tag Manager/Analytics), base HTML structure
- Depends on: Next.js metadata API, analytics libraries
- Used by: All routes via Next.js routing

## Data Flow

**Comic Display Flow:**

1. User requests page (e.g., `/`)
2. Next.js renders `app/page.tsx` (Server Component)
3. Page component calls `getPosts(page)` from `app/lib/posts.ts`
4. `getPosts` calls `datocmsRequest()` with `ALL_COMICS_QUERY`
5. GraphQL query fetches all comics from DatoCMS via `https://graphql.datocms.com/`
6. Response mapped through `mapDatoComicToPost()` to normalize shape
7. Posts sliced for pagination (10 items per page)
8. Server-rendered HTML with `<Image>` components returned
9. Browser receives fully-rendered HTML with image URLs from DatoCMS CDN

**Product Display Flow:**

1. User requests `/shop` or `/shop/[id]`
2. For shop listing: `datocmsRequest()` with inline `PRODUCTS_QUERY` in `app/shop/page.tsx`
3. For product detail: `SINGLE_PRODUCT_QUERY` fetched with product ID variable
4. Response includes product data, images, price, description
5. Server renders page with Next.js Image component for optimization
6. Metadata generation for SEO via `generateMetadata()` async function

**Individual Comic Page Flow:**

1. User navigates to `/{slug}`
2. `app/[slug]/page.tsx` calls `getPost(slug)`
3. Fetches all comics (no slug-specific query), finds match via `find()`
4. Renders comic images, title, body content
5. Previous/next navigation provided via nav links

**State Management:**

- No client-side state management (Redux, Zustand, etc.)
- All state is server-side or derived from URL params (pagination page number)
- Optional Supabase client available but not currently used in main flows
- Future state management can be added via React Context or hooks (e.g., `app/lib/useSupabase.ts` is available for client-side database calls)

## Key Abstractions

**DatoCMS Request Handler:**
- Purpose: Encapsulates GraphQL request logic and error handling
- Examples: `app/lib/datocms.ts`
- Pattern: `datocmsRequest<T>(query, variables)` - Generic function with type parameter for response shape

**Post Mapper:**
- Purpose: Transform DatoCMS comic record into application-specific Post interface
- Examples: `mapDatoComicToPost()` in `app/lib/posts.ts`
- Pattern: Handles HTML entity decoding (comprehensive entity replacement + regex for numeric/hex entities), normalizes image arrays, maps related comic slugs

**Database Helpers:**
- Purpose: Generic CRUD operations for Supabase tables
- Examples: `app/lib/database.ts` exports `fetchData`, `insertData`, `updateData`, `deleteData`, `getById`, `uploadFile`, `deleteFile`
- Pattern: Generic functions with type parameters, composable options object pattern

**Post Interface:**
- Purpose: Standardized shape for comic data across app
- Location: `app/lib/posts.ts`
- Fields: `slug`, `title`, `image_urls[]`, `date`, `blurb`, `body`, `prev_comic_slug`, `next_comic_slug`, `id`

## Entry Points

**Root Layout:**
- Location: `app/layout.tsx`
- Triggers: All requests to the application
- Responsibilities: Sets global metadata, imports global CSS, initializes analytics (GTM/GA4), wraps all routes with root HTML/body structure

**Home Page:**
- Location: `app/page.tsx`
- Triggers: GET `/`
- Responsibilities: Fetches paginated comic list, renders header/nav/footer, displays ComicsList component with Suspense boundary

**Comic Detail Page:**
- Location: `app/[slug]/page.tsx`
- Triggers: GET `/{slug}`
- Responsibilities: Fetches single comic by slug, generates metadata for SEO, renders comic images and body content, provides navigation to prev/next comics

**Shop Listing:**
- Location: `app/shop/page.tsx`
- Triggers: GET `/shop`
- Responsibilities: Fetches all products from DatoCMS, renders product grid with Links to detail pages

**Product Detail:**
- Location: `app/shop/[id]/page.tsx`
- Triggers: GET `/shop/{id}`
- Responsibilities: Fetches single product, generates metadata, renders product images/price/description, provides checkout link with query params

**About Page:**
- Location: `app/about/page.tsx`
- Triggers: GET `/about`
- Responsibilities: Static content about artist, no data fetching required

## Error Handling

**Strategy:** Graceful degradation with try-catch blocks and fallback values

**Patterns:**

- **API Errors:** `datocmsRequest()` throws on HTTP or GraphQL errors, caught in route handlers with console.error
- **Missing Data:** `getPost()`, `getProductById()` return `null` if not found, routes call `notFound()` which renders 404 page
- **Fallback Images:** Product detail uses `/assets/images/placeholder.jpg` if images missing
- **Empty Results:** Functions return empty arrays (`[]`) rather than null on fetch failure to prevent breaking map operations
- **Database Errors:** `database.ts` functions catch and log errors, return `null` or `false` to signal failure

## Cross-Cutting Concerns

**Logging:** Console-based (console.log, console.error) in data fetching functions, disabled cache clearing in `app/lib/posts.ts`

**Validation:** Zod library available in dependencies but not actively used - TypeScript interfaces provide type safety

**Authentication:** Not implemented - site is public. Next-auth configured in package.json but not integrated

**Image Handling:**
- Remote patterns configured in `next.config.ts` for S3 and DatoCMS CDN
- Next.js Image component with `priority` flag for LCP optimization
- Responsive sizes with `sizes="100vw"` and dynamic width/height props

**Metadata & SEO:**
- Centralized in `app/layout.tsx` for site-wide defaults
- Dynamic metadata via `generateMetadata()` in detail pages
- Open Graph and Twitter card support in all routes

**Analytics:**
- Google Tag Manager (GTM ID via `NEXT_PUBLIC_GTM_ID`)
- Google Analytics 4 (GA4 measurement ID via `NEXT_PUBLIC_GA_MEASUREMENT_ID`)
- Conditional initialization based on env var presence

---

*Architecture analysis: 2026-02-20*
