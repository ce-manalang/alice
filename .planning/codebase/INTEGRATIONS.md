# External Integrations

**Analysis Date:** 2026-02-20

## APIs & External Services

**Content Management:**
- DatoCMS - Headless CMS for comic content
  - API: GraphQL endpoint at `https://graphql.datocms.com/`
  - SDK/Client: Fetch-based in `app/lib/datocms.ts`
  - Auth: Bearer token via `DATOCMS_API_TOKEN`
  - Queries: Defined in `app/lib/datocms-queries.ts`
  - Revalidation: 60-second ISR (Incremental Static Regeneration)

## Data Storage

**Databases:**
- Supabase (PostgreSQL)
  - Connection: `NEXT_PUBLIC_SUPABASE_URL` (public endpoint)
  - Client: `@supabase/supabase-js` v2.56.0
  - Auth: `NEXT_PUBLIC_SUPABASE_ANON_KEY` (anonymous JWT token)
  - Location: `app/lib/supabase.ts` (client initialization)

**Database Utilities:**
- Generic CRUD operations in `app/lib/database.ts`:
  - `fetchData()` - SELECT with filters, ordering, limits
  - `insertData()` - INSERT with error handling
  - `updateData()` - UPDATE by ID
  - `deleteData()` - DELETE by ID
  - `getById()` - Single record retrieval
  - `uploadFile()` - Supabase Storage upload
  - `deleteFile()` - Supabase Storage deletion

**File Storage:**
- Supabase Storage - File uploads and serving
  - Integrated in `app/lib/database.ts` upload/delete functions
  - Public URL generation for uploaded files

**Caching:**
- Next.js built-in caching via ISR
- 60-second revalidation interval for DatoCMS queries

## Authentication & Identity

**Auth Provider:**
- Supabase Auth - Built-in authentication system
  - Implementation: React hooks in `app/lib/useSupabase.ts`
  - Supported methods:
    - Email/password sign-in: `useAuth().signIn(email, password)`
    - Email/password sign-up: `useAuth().signUp(email, password)`
    - Sign-out: `useAuth().signOut()`
  - Session management: Automatic via `onAuthStateChange` listener
  - User object: Returns full `User` type from `@supabase/supabase-js`

**Next-Auth Integration:**
- next-auth 5.0.0-beta.25 installed but not actively configured in current codebase

## Monitoring & Observability

**Error Tracking:**
- Console logging via `console.error()` calls in:
  - `app/lib/datocms.ts` - DatoCMS request errors
  - `app/lib/database.ts` - Database operation errors
  - `app/lib/posts.ts` - Post fetching errors
- No external error tracking service detected

**Logs:**
- Client-side: Browser console only
- Server-side: Node.js stdout/stderr (Next.js managed)

**Analytics:**
- Google Analytics 4
  - Measurement ID: `NEXT_PUBLIC_GA_MEASUREMENT_ID`
  - Integration: `GoogleAnalytics` component from `@next/third-parties/google`
  - Location: `app/layout.tsx` (conditional rendering)

- Google Tag Manager
  - Container ID: `NEXT_PUBLIC_GTM_ID`
  - Integration: `GoogleTagManager` component from `@next/third-parties/google`
  - Location: `app/layout.tsx` (conditional rendering)

## CI/CD & Deployment

**Hosting:**
- Vercel (implied by Next.js latest and deployment configuration)
- Next.js 15.x with Turbopack for local dev (`next dev --turbopack`)

**CI Pipeline:**
- Not detected - No GitHub Actions, GitLab CI, or other CI config files found

## Environment Configuration

**Required env vars:**
```
NEXT_PUBLIC_SUPABASE_URL      # Supabase project URL
NEXT_PUBLIC_SUPABASE_ANON_KEY # Supabase public key
DATOCMS_API_TOKEN             # DatoCMS GraphQL token
```

**Optional env vars:**
```
NEXT_PUBLIC_GA_MEASUREMENT_ID # Google Analytics 4 ID
NEXT_PUBLIC_GTM_ID            # Google Tag Manager ID
NEXT_PUBLIC_API_URL           # External API (defaults to http://localhost:3001)
```

**Secrets location:**
- `.env` - Git-ignored local environment file
- `.env.local` - Git-ignored local overrides
- `.env.example` - Template for required variables

## Data Flow Integrations

**Comic Content Pipeline:**
1. DatoCMS → GraphQL API query in `app/lib/posts.ts`
2. Query via `datocmsRequest()` in `app/lib/datocms.ts`
3. Response mapping: `mapDatoComicToPost()` transforms DatoCMS schema to app schema
4. HTML entity decoding for body and blurb content
5. Pagination: 10 items per page via `getPosts(page)`

**User Data Pipeline:**
1. Supabase Auth → Session via `useAuth()` hook
2. Optional: Database operations via `useSupabaseQuery()`, `useSupabaseMutation()` hooks
3. CRUD operations delegated to `app/lib/database.ts` functions

**Product/Checkout Flow:**
1. Product data passed via URL search params to `app/checkout/page.tsx`
2. Form state management in React component (not yet integrated to payment processor)
3. Mock payment methods shown: Credit card, PayPal, Google Pay
4. No actual payment processor integration detected (Stripe, Square, etc.)

## Webhooks & Callbacks

**Incoming:**
- None detected - No API route handlers for incoming webhooks

**Outgoing:**
- None detected - No webhook triggers to external services

## Third-Party Services Summary

| Service | Type | Status | Config |
|---------|------|--------|--------|
| Supabase | Database + Auth | Active | Env vars |
| DatoCMS | Content CMS | Active | Env var |
| Google Analytics 4 | Analytics | Optional | Env var |
| Google Tag Manager | Analytics | Optional | Env var |
| AWS S3 | Image Hosting | Configured | next.config.ts |

---

*Integration audit: 2026-02-20*
