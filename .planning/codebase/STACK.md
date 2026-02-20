# Technology Stack

**Analysis Date:** 2026-02-20

## Languages

**Primary:**
- TypeScript 5.7.3 - Entire application (React components, Next.js pages, utilities)
- JSX/TSX - React component syntax throughout `app/` directory

**Secondary:**
- JavaScript - PostCSS configuration
- CSS - Global styles in `app/globals.css`

## Runtime

**Environment:**
- Node.js (version not specified in `.nvmrc` - uses system default)

**Package Manager:**
- pnpm (lockfile version 9.0)
- Lockfile: `pnpm-lock.yaml` (present)

## Frameworks

**Core:**
- Next.js 15.1.6 - Full-stack framework with App Router
- React 19.0.0 - UI component library
- React DOM 19.0.0 - DOM rendering

**Authentication:**
- next-auth 5.0.0-beta.25 - Authentication management (installed but not actively used in checked files)

**Styling:**
- Tailwind CSS 3.4.17 - Utility-first CSS framework
- @tailwindcss/forms 0.5.10 - Form component styling plugin
- PostCSS 8.5.1 - CSS transformation tool
- Autoprefixer 10.4.20 - Browser prefix support

**Build/Dev:**
- @next/third-parties 15.2.4 - Google Analytics and GTM integration

## Key Dependencies

**Critical:**
- @supabase/supabase-js 2.56.0 - Supabase client for database and auth operations (`app/lib/supabase.ts`, `app/lib/database.ts`)
- bcrypt 5.1.1 - Password hashing utility
- postgres 3.4.5 - Direct PostgreSQL client driver (supports `NEXT_PUBLIC_API_URL` fallback)
- zod 3.24.1 - Schema validation library
- use-debounce 10.0.4 - Debouncing utility for input handlers

**UI/UX:**
- @heroicons/react 2.2.0 - Icon component library
- clsx 2.1.1 - Conditional class names utility

**Markdown/Content:**
- remark 15.0.1 - Markdown processor
- remark-parse 11.0.0 - Parse markdown
- remark-html 16.0.1 - Render markdown as HTML
- remark-directive 4.0.0 - Custom markdown syntax
- remark-rehype 11.1.1 - Convert remark to rehype AST
- rehype-stringify 10.0.1 - Stringify rehype AST
- unist 0.0.1 - Universal Syntax Tree utilities
- unist-util-visit 5.0.0 - AST visitor utilities
- hast 1.0.0 - HTML Abstract Syntax Tree

## Configuration

**Environment:**

Required variables (see `app/lib/supabase.ts`, `app/lib/datocms.ts`, `app/layout.tsx`):
- `NEXT_PUBLIC_SUPABASE_URL` - Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase anonymous/public key
- `DATOCMS_API_TOKEN` - DatoCMS API token for GraphQL queries
- `NEXT_PUBLIC_GA_MEASUREMENT_ID` - Google Analytics 4 measurement ID (optional)
- `NEXT_PUBLIC_GTM_ID` - Google Tag Manager ID (optional)
- `NEXT_PUBLIC_API_URL` - External API endpoint (defaults to `http://localhost:3001`)

Configuration files location:
- `.env` - Environment variables (git-ignored)
- `.env.example` - Template for environment setup
- `.env.local` - Local override (git-ignored)

**Build:**
- `next.config.ts` - Next.js build configuration
- `tsconfig.json` - TypeScript compiler options
- `tailwind.config.ts` - Tailwind CSS configuration
- `postcss.config.js` - PostCSS configuration

## Platform Requirements

**Development:**
- Node.js (no specific version specified)
- pnpm package manager

**Production:**
- Node.js runtime (Next.js recommends 18+)
- Vercel or compatible Node.js hosting platform
- Supabase account for database and auth
- DatoCMS account for headless CMS content
- Google Analytics/GTM account for analytics (optional)
- AWS S3 for image hosting (configured in `next.config.ts` for remote image optimization)

## External Asset Sources

**Remote Images Allowed:**
- `s3.us-east-2.amazonaws.com` - AWS S3 bucket for comic assets
- `www.datocms-assets.com` - DatoCMS asset delivery
- `images.datocms-assets.com` - DatoCMS image optimization

---

*Stack analysis: 2026-02-20*
