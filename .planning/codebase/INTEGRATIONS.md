# External Integrations

**Analysis Date:** 2026-02-20

## APIs & External Services

**Content Management:**
- DatoCMS - Headless CMS for comic and product content
  - SDK/Client: GraphQL API via `fetch` with custom wrapper
  - URL: `https://graphql.datocms.com/`
  - Auth: `DATOCMS_API_TOKEN` (Bearer token)
  - Implementation: `app/lib/datocms.ts` with request handler
  - Queries: `app/lib/datocms-queries.ts`
  - Cache revalidation: 60 seconds
  - Used for:
    - Comics listing: `ALL_COMICS_QUERY`
    - Product details: `SINGLE_PRODUCT_QUERY`
    - Markdown rendering of content

**Image Hosting:**
- AWS S3 - Static asset hosting
  - Bucket: `centimentalcomics.com/assets/images/`
  - Region: `us-east-2`
  - Access: HTTPS remote image patterns configured in `next.config.ts`
  - Used for: Comic images, product images, about page images

**Custom API:**
- Local/Custom API server
  - URL: `NEXT_PUBLIC_API_URL` (defaults to `http://localhost:3001`)
  - Purpose: Can be used for custom backend endpoints
  - Location: Referenced in `app/lib/posts.ts`

## Data Storage

**Databases:**
- Supabase PostgreSQL
  - Connection: `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - Client: `@supabase/supabase-js` v2.56.0
  - Driver: PostgreSQL over `postgres` v3.4.5
  - Location: `app/lib/supabase.ts`
  - Database abstraction layer: `app/lib/database.ts`
  - Features:
    - CRUD operations (fetch, insert, update, delete)
    - File storage and public URL generation
    - Row-level security (RLS) policies
    - Real-time subscriptions (available but not actively used)

**File Storage:**
- Supabase Storage - Cloud file hosting
  - Accessed via Supabase client
  - Functions: `uploadFile()`, `deleteFile()` in `app/lib/database.ts`
  - Returns public URLs for uploaded files
  - Bucket-based organization

**Caching:**
- Next.js built-in caching
  - ISR (Incremental Static Regeneration): DatoCMS queries revalidate every 60 seconds
  - No external cache service (Redis, Memcached)

## Authentication & Identity

**Auth Provider:**
- Supabase Auth + next-auth
  - Supabase built-in authentication
  - Implementation: `app/lib/useSupabase.ts`
  - Methods:
    - Email/password sign-in: `supabase.auth.signInWithPassword()`
    - Email/password sign-up: `supabase.auth.signUp()`
    - Sign out: `supabase.auth.signOut()`
  - next-auth beta integration
    - Package: next-auth 5.0.0-beta.25
    - Status: Installed but not actively configured in current codebase

**Session Management:**
- Supabase Auth state
  - Uses `supabase.auth.getSession()` for initial session
  - Listens to auth changes via `supabase.auth.onAuthStateChange()`
  - Session and user objects available to components
  - Custom hook: `useAuth()` in `app/lib/useSupabase.ts`

## Monitoring & Observability

**Error Tracking:**
- Console logging only
  - Error handling: `console.error()` in `app/lib/database.ts`
  - No external error tracking (Sentry, Rollbar)

**Logs:**
- Browser console (client-side)
- Server logs via Next.js (server-side)
- No centralized logging service

## CI/CD & Deployment

**Hosting:**
- Vercel (recommended in README)
- Next.js optimized deployment platform
- Supports environment variable management

**CI Pipeline:**
- Not detected in current codebase
- Likely handled by Vercel's built-in CI for git integration

## Environment Configuration

**Required env vars:**
- `NEXT_PUBLIC_SUPABASE_URL` - Supabase project URL (public)
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase anon key (public, safe for client)
- `DATOCMS_API_TOKEN` - DatoCMS bearer token (secret, server-only)
- `NEXT_PUBLIC_API_URL` - Custom API endpoint (optional, defaults to localhost:3001)

**Secrets location:**
- `.env.local` for local development
- Vercel environment variables for production
- Never commit `.env` or `.env.local`

## Webhooks & Callbacks

**Incoming:**
- Not detected
- Checkout form is client-side only (no server webhook handling)

**Outgoing:**
- DatoCMS queries (fetch requests, not webhooks)
- Supabase auth state changes (client-side events)
- File uploads to Supabase Storage
- No outgoing webhooks to external services

## Payment Processing

**Status:** UI Layer Only
- Checkout page: `app/checkout/page.tsx`
- Payment methods UI: Credit card, PayPal, Google Pay buttons
- Implementation status: Form UI built, payment processing not integrated
- No Stripe, PayPal SDK, or payment gateway currently configured
- Product data passed via URL params (productId, productName, productPrice, productImage)
- Form data collected but no backend submission logic

---

*Integration audit: 2026-02-20*
