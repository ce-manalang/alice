# Codebase Structure

**Analysis Date:** 2026-02-20

## Directory Layout

```
alice/
├── app/                        # Next.js App Router directory - contains all routes and components
│   ├── (main)/                # Route group (unused, for potential future organization)
│   ├── [slug]/                # Dynamic route for individual comic posts
│   ├── shop/                  # Shop feature directory
│   │   ├── [id]/             # Dynamic product detail route
│   │   └── page.tsx          # Shop listing page
│   ├── about/                 # Static about page route
│   ├── checkout/              # Checkout page route
│   ├── components/            # Reusable React components
│   ├── ui/                    # UI styles directory
│   ├── lib/                   # Data fetching and utility functions
│   ├── layout.tsx             # Root layout - all routes wrap here
│   ├── page.tsx               # Home page
│   ├── globals.css            # Global styles for the app
│   ├── sitemap.ts             # Dynamic sitemap generation
│   ├── robots.ts              # Robots.txt configuration
│   └── not-found.tsx          # 404 page
├── lib/                       # Shared utilities outside app directory
├── public/                    # Static assets (images, favicon, manifest)
│   └── assets/               # Images and CSS assets
├── .planning/                 # Planning and documentation directory
│   └── codebase/             # GSD codebase analysis documents
├── .next/                     # Build output (ignored)
├── tsconfig.json             # TypeScript configuration
├── next.config.ts            # Next.js configuration
├── tailwind.config.ts        # Tailwind CSS configuration
├── postcss.config.js         # PostCSS configuration
├── package.json              # Dependencies
├── pnpm-lock.yaml            # pnpm lock file
└── README.md                 # Project documentation
```

## Directory Purposes

**app/:**
- Purpose: Next.js App Router source directory - contains all routes, pages, layouts, and client/server components
- Contains: Route handlers, page components, shared components, utilities, and global styles
- Key files: `layout.tsx` (root layout), `page.tsx` (home), `[slug]/page.tsx` (comic detail), `shop/page.tsx` (shop), `components/` (UI components), `lib/` (data and utilities)

**app/components/:**
- Purpose: Reusable React components used across multiple pages
- Contains: UI components like Pagination, LoadingSkeleton, Navigation, SupabaseExample
- Key files: `pagination.tsx`, `loading-skeleton.tsx`, `comic-navigation.tsx`

**app/lib/:**
- Purpose: Data fetching, API integration, and utility functions
- Contains: DatoCMS GraphQL client, Supabase client and helpers, post/product fetchers, markdown processor, formatting utilities
- Key files: `datocms.ts` (GraphQL client), `posts.ts` (comic data fetcher), `supabase.ts` (Supabase client), `database.ts` (generic DB helpers), `datocms-queries.ts` (GraphQL queries), `utils.ts` (formatDate), `markdown.ts` (markdown-to-HTML)

**app/ui/:**
- Purpose: UI-specific stylesheets
- Contains: Component-level or feature-level CSS
- Key files: `global.css` (global styles, currently minimal)

**lib/:**
- Purpose: Utilities shared outside the app directory (if needed)
- Contains: Currently empty - reserved for future shared code
- Key files: None currently

**public/:**
- Purpose: Static assets served directly (not processed by Next.js build)
- Contains: Favicon, images, manifest file, OG images
- Key files: `assets/images/` (og-image.jpg, about.jpg, placeholder.jpg), `apple-touch-icon.png`, `favicon.ico`, `site.webmanifest`

**.planning/codebase/:**
- Purpose: GSD (Get Stuff Done) codebase analysis documentation
- Contains: Architecture, structure, conventions, testing patterns, tech stack, concerns analysis
- Key files: `ARCHITECTURE.md`, `STRUCTURE.md`, `CONVENTIONS.md`, `TESTING.md`, `STACK.md`, `INTEGRATIONS.md`, `CONCERNS.md`

## Key File Locations

**Entry Points:**

- `app/layout.tsx`: Root layout - initializes global metadata, analytics, applies global CSS to all routes
- `app/page.tsx`: Home page - displays paginated list of comics
- `app/[slug]/page.tsx`: Dynamic comic detail route - renders individual comic with images and body content
- `app/shop/page.tsx`: Shop listing - displays product grid from DatoCMS
- `app/shop/[id]/page.tsx`: Product detail - shows individual product with images and checkout button
- `app/about/page.tsx`: Static about page - contains artist bio
- `app/checkout/page.tsx`: Checkout page (minimal implementation)

**Configuration:**

- `tsconfig.json`: TypeScript compiler options, path alias `@/*` -> `./*`
- `next.config.ts`: Next.js configuration with remote image patterns for S3 and DatoCMS CDN
- `tailwind.config.ts`: Tailwind CSS customization
- `postcss.config.js`: PostCSS (handles Tailwind compilation)
- `package.json`: Dependencies and build scripts

**Core Logic:**

- `app/lib/posts.ts`: Main data layer for comics - exports `getPosts()`, `getPost()`, `getNextPrevPosts()`, `getAllSlugs()`
- `app/lib/datocms.ts`: GraphQL client for DatoCMS API - exports `datocmsRequest<T>()`
- `app/lib/datocms-queries.ts`: GraphQL query strings - `ALL_COMICS_QUERY`, `SINGLE_PRODUCT_QUERY`
- `app/lib/supabase.ts`: Supabase client initialization - exports `supabase`, `typedSupabase`
- `app/lib/database.ts`: Generic CRUD helpers for Supabase - exports `fetchData`, `insertData`, `updateData`, `deleteData`, `getById`, `uploadFile`, `deleteFile`
- `app/lib/utils.ts`: Utility functions - exports `formatDate()`
- `app/lib/markdown.ts`: Markdown processor - exports `markdownToHtml()`

**Testing:**

- No test files currently in codebase (see TESTING.md for setup)

## Naming Conventions

**Files:**

- Page routes: `page.tsx` (lowercase, Next.js convention)
- Dynamic routes: `[slug].tsx`, `[id].tsx` (brackets for dynamic segments)
- Layouts: `layout.tsx` (lowercase)
- Components: `PascalCase.tsx` (e.g., `Pagination.tsx`, `LoadingSkeleton.tsx`)
- Data/utilities: `camelCase.ts` (e.g., `posts.ts`, `datocms.ts`, `utils.ts`)
- Config files: lowercase with dots (e.g., `tsconfig.json`, `next.config.ts`, `postcss.config.js`)

**Directories:**

- Route directories: lowercase with hyphens (e.g., `/shop`, `/about`, `/checkout`)
- Component groups: lowercase (e.g., `components/`, `ui/`, `lib/`)
- Feature directories: lowercase (e.g., `shop/` for shop feature)

**Variables/Functions:**

- Functions: camelCase (e.g., `formatDate()`, `mapDatoComicToPost()`, `getPosts()`)
- Constants: UPPER_SNAKE_CASE (e.g., `ALL_COMICS_QUERY`, `ITEMS_PER_PAGE`, `DATOCMS_API_URL`)
- Interfaces: PascalCase (e.g., `Post`, `Product`, `Database`)
- Environment variables: UPPER_SNAKE_CASE with optional `NEXT_PUBLIC_` prefix for client-side

## Where to Add New Code

**New Feature:**

Example: Adding a new major section like "Merch"

1. Create route directory: `app/merch/`
2. Add main page: `app/merch/page.tsx`
3. Add dynamic detail page: `app/merch/[id]/page.tsx` (if needed)
4. Create data fetcher: `app/lib/merch.ts` (following posts.ts pattern)
5. Add GraphQL queries to: `app/lib/datocms-queries.ts` (if using DatoCMS)
6. Create reusable component: `app/components/MerchCard.tsx`
7. Update root layout navigation if needed in `app/page.tsx` or `app/layout.tsx`

**New Component/Module:**

Example: Adding a reusable UI component

1. Create in: `app/components/MyComponent.tsx`
2. Use PascalCase filename matching exported component name
3. Import in consuming pages via: `import { MyComponent } from "@/app/components/MyComponent"`
4. For shared utilities, add to: `app/lib/utils.ts` or create specific file like `app/lib/myUtility.ts`

**Utilities:**

- Shared helpers: `app/lib/utils.ts` or create domain-specific files like `app/lib/validation.ts`, `app/lib/formatting.ts`
- Data transformers: `app/lib/` directory following pattern of `mapDatoComicToPost()`
- API clients: `app/lib/` with pattern of `datocms.ts` and `supabase.ts`

**Styling:**

- Global styles: `app/globals.css`
- Component-specific: Use Tailwind classes in JSX (TailwindCSS configured)
- Component modules: Can add CSS modules as needed (e.g., `app/components/Button.module.css`)

## Special Directories

**app/:**
- Purpose: Next.js App Router directory - holds all routes and components
- Generated: No (source code)
- Committed: Yes
- Note: This is the main source directory. Files here are compiled by Next.js.

**.next/:**
- Purpose: Next.js build output - compiled JavaScript, cache, and pre-rendered pages
- Generated: Yes (by `npm run build` or `next dev`)
- Committed: No (in .gitignore)
- Note: Safe to delete - will be regenerated on next build

**public/:**
- Purpose: Static assets served at root URL (favicon, manifest, images, etc.)
- Generated: No (source code)
- Committed: Yes
- Note: Files are served directly without processing. Image optimization uses next/image instead.

**node_modules/:**
- Purpose: Installed npm packages
- Generated: Yes (by `pnpm install`)
- Committed: No (in .gitignore)
- Note: Managed via pnpm-lock.yaml for reproducible installs

**app/[slug]/ and app/shop/[id]/**
- Purpose: Dynamic route segments
- Pattern: `[paramName]` creates a dynamic segment, becomes `params.paramName`
- Usage: Access via `const params = await props.params`, then `params.slug` or `params.id`
- Routes: `/{slug}` and `/shop/{id}` respectively

---

*Structure analysis: 2026-02-20*
