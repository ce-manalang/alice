# Technology Stack

**Analysis Date:** 2026-02-20

## Languages

**Primary:**
- TypeScript 5.7.3 - All source code and configuration files

**Secondary:**
- JavaScript (Node.js) - Build tooling and package management

## Runtime

**Environment:**
- Node.js 18.x or later (recommended)
- Next.js 15.1.6 (Latest) - Full-stack framework

**Package Manager:**
- pnpm 9.0 (lockfileVersion)
- Lockfile: `pnpm-lock.yaml` (present)

## Frameworks

**Core:**
- Next.js 15.1.6 - App Router for SSR/SSG, API routes
- React 19.0.0 - UI library
- React DOM 19.0.0 - React rendering

**Styling:**
- Tailwind CSS 3.4.17 - Utility-first CSS framework
- Tailwind Forms 0.5.10 - Pre-styled form components
- PostCSS 8.5.1 - CSS transformation tool
- Autoprefixer 10.4.20 - CSS vendor prefixing

**Authentication & Authorization:**
- next-auth 5.0.0-beta.25 - Session management (beta, installed but not actively used in current codebase)

**Content Processing:**
- remark 15.0.1 - Markdown parser
- remark-parse 11.0.0 - Markdown parsing plugin
- remark-html 16.0.1 - Markdown to HTML transformation
- remark-rehype 11.1.1 - Markdown to rehype AST
- remark-directive 4.0.0 - Directive syntax support
- rehype-stringify 10.0.1 - rehype to HTML string
- hast 1.0.0 - HTML AST specification

## Key Dependencies

**Critical:**
- @supabase/supabase-js 2.56.0 - Postgres database client and auth platform
  - Used for: Database queries, file storage, real-time subscriptions
  - Location: `app/lib/supabase.ts`, `app/lib/database.ts`

- postgres 3.4.5 - PostgreSQL protocol driver
  - Used for: Direct database connections and advanced queries

- bcrypt 5.1.1 - Password hashing
  - Used for: Secure password encryption (can be integrated with auth flows)
  - Types: @types/bcrypt 5.0.2

**UI Components:**
- @heroicons/react 2.2.0 - SVG icon library (Heroicons)
  - Used for: Consistent icon components throughout interface

- clsx 2.1.1 - Conditional class name utility
  - Used for: Dynamic Tailwind CSS class combination

- use-debounce 10.0.4 - Debounce hook for React
  - Used for: Optimizing rapid state changes

**Data Validation:**
- zod 3.24.1 - TypeScript-first schema validation
  - Used for: Runtime type checking and data validation

**Content Delivery:**
- @next/third-parties 15.2.4 - Third-party script optimization
  - Used for: Safely loading external scripts and libraries

## Configuration Files

**TypeScript:**
- `tsconfig.json` - Strict mode enabled, ES2017 target, ESNext modules
- Path alias: `@/*` → `./*` for root-level imports

**Next.js:**
- `next.config.ts` - Image optimization with remote patterns
  - AWS S3 bucket: `s3.us-east-2.amazonaws.com` (centimentalcomics.com assets)
  - DatoCMS CDN: `www.datocms-assets.com` and `images.datocms-assets.com`

**Styling:**
- `tailwind.config.ts` - Custom theme with blue color overrides and shimmer animation
- `postcss.config.js` - PostCSS configuration

## Environment Configuration

**Required environment variables:**
- `NEXT_PUBLIC_SUPABASE_URL` - Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase anonymous key (safe for client)
- `DATOCMS_API_TOKEN` - DatoCMS GraphQL API bearer token
- `NEXT_PUBLIC_API_URL` - Custom API endpoint (defaults to `http://localhost:3001`)

**Files:**
- `.env.example` - Template with required variables
- `.env` - Local environment (not committed)
- `.env.local` - Local overrides for development

## Platform Requirements

**Development:**
- Node.js 18.x or later
- pnpm package manager
- Turbopack enabled (`next dev --turbopack`)

**Production:**
- Next.js deployment on Vercel (recommended)
- Static hosting compatible (build output: `.next/`)
- Environment variables from hosting platform

## Build & Development

**Build:**
- Command: `pnpm build` → `next build`
- Output: `.next/` directory

**Development:**
- Command: `pnpm dev` → `next dev --turbopack`
- Turbopack for fast HMR and builds

**Production:**
- Command: `pnpm start` → `next start`
- Requires `pnpm build` first

---

*Stack analysis: 2026-02-20*
