# Architecture

**Analysis Date:** 2026-02-20

## Pattern Overview

**Overall:** Next.js server-side rendering with headless CMS integration (DatoCMS as primary content source, Supabase as secondary database)

**Key Characteristics:**
- Server-side rendered pages with async data fetching
- Multi-source content strategy (DatoCMS for comics/products, Supabase for auxiliary data)
- Minimal client-side interactivity (primarily form handling)
- Static asset serving from AWS S3 CDN
- Client-side form state management for checkout flow

## Layers

**Presentation Layer (Next.js Pages):**
- Purpose: Handle HTTP requests, render components, manage page metadata, and coordinate data fetching
- Location: `app/page.tsx`, `app/[slug]/page.tsx`, `app/shop/page.tsx`, `app/about/page.tsx`, `app/checkout/page.tsx`, `app/layout.tsx`
- Contains: Page components, Server-side async functions, metadata exports, Suspense boundaries
- Depends on: Data fetching layer (`app/lib/posts.ts`, `app/lib/datocms.ts`), UI components (`app/components/`), utilities
- Used by: Next.js router and browser HTTP requests

**Data Fetching Layer:**
- Purpose: Abstract database and API interactions, transform raw data into app-usable shapes
- Location: `app/lib/posts.ts`, `app/lib/database.ts`, `app/lib/supabase.ts`, `app/lib/datocms.ts`
- Contains: Async functions for content retrieval, data mapping/transformation, error handling
- Depends on: External services (DatoCMS API, Supabase client)
- Used by: Page components, other data fetching functions

**Infrastructure/Client Layer:**
- Purpose: Establish connections to external services, configure authentication
- Location: `app/lib/supabase.ts`, `app/lib/datocms.ts`
- Contains: Service client initialization, API configuration, type definitions
- Depends on: Environment variables, external SDKs (Supabase, fetch API)
- Used by: Data fetching functions

**UI/Component Layer:**
- Purpose: Render reusable interface elements with minimal state
- Location: `app/components/` (pagination.tsx, loading-skeleton.tsx, comic-navigation.tsx), `app/ui/`
- Contains: React components (functional, mostly presentational)
- Depends on: Next.js components (Image, Link), styling via CSS classes
- Used by: Page components

**Utility Layer:**
- Purpose: Provide helper functions for common operations
- Location: `app/lib/utils.ts`, `app/lib/markdown.ts`
- Contains: Date formatting, markdown-to-HTML conversion, shared logic
- Depends on: External libraries (remark, rehype)
- Used by: Data fetching layer, page components

## Data Flow

**Comic/Post Display:**

1. User requests `/` or `/:slug` or paginated route
2. Next.js calls async page component function
3. Component calls `getPosts()` or `getPost()` from `app/lib/posts.ts`
4. `posts.ts` calls `datocmsRequest()` with `ALL_COMICS_QUERY` from `app/lib/datocms-queries.ts`
5. `datocmsRequest()` makes authenticated GraphQL request to DatoCMS API
6. Response data is mapped via `mapDatoComicToPost()` (HTML entity decoding, image URL extraction)
7. Posts are paginated in-memory (10 items per page) or returned as single post
8. Page component renders posts with images via Next.js `Image` component pointing to AWS S3
9. HTML with metadata is sent to browser

**Shop/Product Display:**

1. User requests `/shop` or `/shop/:id`
2. Page component calls `datocmsRequest()` with product GraphQL query
3. DatoCMS returns product data (name, price, images, description)
4. Component renders product grid or detail page
5. Links navigate to `/checkout` with product metadata as search params

**Checkout Flow:**

1. User clicks product link with search params (productId, productName, productPrice, productImage)
2. Checkout page loads as client component (`'use client'`)
3. Component uses React `useState` to manage form fields (email, address, payment details)
4. Form submission is currently a no-op (no backend integration)
5. Order summary displays product details from search params

**State Management:**

- **Server State:** DatoCMS and Supabase data (stateless, fetched per request)
- **Client State:** Checkout form state only (`app/checkout/page.tsx` useState hooks)
- **Caching:** DatoCMS requests revalidate every 60 seconds (Next.js ISR via `next: { revalidate: 60 }`)

## Key Abstractions

**Post (Comic):**
- Purpose: Represents a published comic/article
- Examples: `app/lib/posts.ts` (type `Post` interface)
- Pattern: Data class with slug, title, image URLs, date, blurb, body, navigation links
- Transformation: DatoCMS GraphQL response → `Post` interface via `mapDatoComicToPost()`

**Product:**
- Purpose: Represents a merchandise item for sale
- Examples: `app/shop/page.tsx` (interface `Product`)
- Pattern: Simple data transfer object with id, name, price, images array, alt text

**Database Operations:**
- Purpose: Generic CRUD abstractions for Supabase tables
- Examples: `app/lib/database.ts` functions (fetchData, insertData, updateData, deleteData)
- Pattern: Generics-based wrapper over Supabase client with error handling

**DatoCMS Client:**
- Purpose: Authenticated GraphQL request wrapper
- Examples: `app/lib/datocms.ts` function `datocmsRequest()`
- Pattern: Generic async function accepting GraphQL query string, returns typed response

## Entry Points

**Root Page (`app/page.tsx`):**
- Location: `app/page.tsx`
- Triggers: `GET /` HTTP request
- Responsibilities: Fetch paginated posts, render comic feed, display pagination controls, include global navigation/header/footer

**Comic Detail Page (`app/[slug]/page.tsx`):**
- Location: `app/[slug]/page.tsx`
- Triggers: `GET /:slug` HTTP request
- Responsibilities: Fetch single comic by slug, generate metadata, render full comic with navigation links, handle not-found cases

**Shop Page (`app/shop/page.tsx`):**
- Location: `app/shop/page.tsx`
- Triggers: `GET /shop` HTTP request
- Responsibilities: Fetch products from DatoCMS, render product grid with links to checkout

**Product Detail Page (`app/shop/[id]/page.tsx`):**
- Location: `app/shop/[id]/page.tsx` (exists but not examined)
- Triggers: `GET /shop/:id` HTTP request
- Responsibilities: Likely fetches single product by ID, renders detail page

**Checkout Page (`app/checkout/page.tsx`):**
- Location: `app/checkout/page.tsx`
- Triggers: `GET /checkout` HTTP request with search params
- Responsibilities: Client-side form rendering with product summary, handles form state management

**About Page (`app/about/page.tsx`):**
- Location: `app/about/page.tsx`
- Triggers: `GET /about` HTTP request
- Responsibilities: Static content page about artist, renders bio and image

**Root Layout (`app/layout.tsx`):**
- Location: `app/layout.tsx`
- Triggers: Applied to all routes
- Responsibilities: Wrap all pages with metadata, Google Analytics/GTM setup, font loading, global CSS

## Error Handling

**Strategy:** Try-catch with console logging, graceful degradation

**Patterns:**

- **Data Fetching Errors:** Functions return empty arrays/null on error, logs error to console
  - `app/lib/posts.ts`: `fetchAllPosts()` catches errors and returns `[]`
  - `app/lib/database.ts`: Generic `fetchData()` returns `[]` on error, logs with context
  - `app/lib/datocms.ts`: `datocmsRequest()` throws on GraphQL errors, caller catches

- **Missing Data:** Pages call `notFound()` when data fetch fails or returns null
  - `app/[slug]/page.tsx`: Calls `notFound()` if comic not found

- **API Errors:** GraphQL errors checked via `if (json.errors)` in `datocmsRequest()`

- **Missing Env Vars:** Throw Error in client initialization if critical env vars missing
  - `app/lib/supabase.ts`: Throws if NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY missing
  - `app/lib/datocms.ts`: Throws if DATOCMS_API_TOKEN missing

## Cross-Cutting Concerns

**Logging:** Console-based via `console.error()` and `console.log()` for debugging
- Used in: `app/lib/database.ts`, `app/lib/posts.ts`, `app/lib/datocms.ts`
- Pattern: Logs operation name and error details, no structured logging

**Validation:** TypeScript type system, minimal runtime validation
- Zod available in dependencies but not actively used in current code
- Form validation in `app/checkout/page.tsx` is client-side setState only

**Authentication:**
- DatoCMS: Bearer token via DATOCMS_API_TOKEN environment variable
- Supabase: Anonymous key via NEXT_PUBLIC_SUPABASE_ANON_KEY (public client)
- No user authentication implemented; Supabase client is anonymous

**Image Optimization:**
- Next.js `Image` component with remote URL whitelisting in `next.config.ts`
- Allowed sources: AWS S3 (s3.us-east-2.amazonaws.com), DatoCMS CDN (datocms-assets.com)
- Always includes `width`, `height`, `alt` for accessibility

**Markdown Processing:**
- `app/lib/markdown.ts` converts markdown to HTML using remark/rehype pipeline
- Adds `target="_blank"` and `rel="noopener noreferrer"` to all links for security

---

*Architecture analysis: 2026-02-20*
