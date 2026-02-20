# Codebase Concerns

**Analysis Date:** 2026-02-20

## Tech Debt

**HTML Entity Decoding Duplication:**
- Issue: Manual HTML entity decoding with repeated long chains of regex replacements in `mapDatoComicToPost`
- Files: `app/lib/posts.ts` (lines 45-80 and 82-107)
- Impact: Code maintainability suffers; any changes to decoding logic must be applied in two places; easy to miss updates
- Fix approach: Extract HTML entity decoding to a shared utility function and reuse for both body and blurb

**Unused next-auth Dependency:**
- Issue: `next-auth 5.0.0-beta.25` is installed but never imported or used in the codebase
- Files: `package.json`
- Impact: Adds unnecessary bundle size; beta version means breaking changes possible; confuses developers about auth strategy
- Fix approach: Remove from dependencies unless authentication is planned; clarify auth strategy (Supabase is being used instead)

**Unstructured Error Handling in Database Module:**
- Issue: Generic error handler in `database.ts` line 4 catches any type and logs to console; returns empty arrays/null silently on error
- Files: `app/lib/database.ts` (lines 4-7, 46-47, 152-155)
- Impact: Errors are logged to console but not surfaced to UI; clients can't distinguish between empty results and actual failures; client-side logic can't handle errors appropriately
- Fix approach: Use structured error returns instead of silent failures; add error context to hook responses; implement proper error boundaries in UI

**Disabled Caching Infrastructure:**
- Issue: Posts caching is disabled (lines 18-24 in `posts.ts`) but cache-clearing function still exists
- Files: `app/lib/posts.ts` (lines 18-24)
- Impact: Every page load fetches all 100+ comics from DatoCMS API; performance degrades with content growth; no mechanism to refresh content
- Fix approach: Re-enable caching with configurable revalidation strategy; implement cache invalidation on content updates

**Performance: N+1 Data Fetching Pattern:**
- Issue: `getPosts()`, `getPost()`, `getNextPrevPosts()`, and `getAllSlugs()` all call `fetchAllPosts()` separately
- Files: `app/lib/posts.ts` (lines 161-199)
- Impact: Homepage with pagination fetches all 100+ comics just to paginate 10; individual comic page fetches all posts to find neighbors; scales poorly as content grows
- Fix approach: Implement single-call fetching with filtering; use DatoCMS API pagination; cache results with proper invalidation

**Missing Type Safety in useSupabase Hooks:**
- Issue: `dependencies` parameter typed as `any[]` in `useSupabaseQuery` and `useSupabaseRecord`
- Files: `app/lib/useSupabase.ts` (lines 67, 100)
- Impact: No type checking on dependency arrays; can cause infinite re-renders or missed updates; inconsistent with TypeScript strict mode
- Fix approach: Type dependencies as `DependencyList` (from React); add ESLint rules to catch dependency issues

**Mutation Function Type Too Loose:**
- Issue: `useSupabaseMutation` mutation function typed as `(data: T) => Promise<any>`
- Files: `app/lib/useSupabase.ts` (line 132)
- Impact: Return type `any` defeats type safety; callers don't know what to expect; harder to catch mistakes
- Fix approach: Use stricter return types; require explicit return type specification

## Security Considerations

**XSS Vulnerability from dangerouslySetInnerHTML:**
- Risk: User-generated or CMS content rendered with `dangerouslySetInnerHTML` without sanitization
- Files: `app/page.tsx` (line 134), `app/[slug]/page.tsx` (line 139), `app/shop/[id]/page.tsx` (line 154)
- Current mitigation: DatoCMS content is from trusted CMS; HTML entity decoding applied to posts
- Recommendations:
  - Add Content Security Policy (CSP) headers in `next.config.ts`
  - Use a sanitization library like `sanitize-html` or `isomorphic-dompurify` for any external HTML
  - Consider parsing HTML entities server-side and rendering React components instead
  - Document why `dangerouslySetInnerHTML` is safe for each usage

**Supabase Public Keys Exposed in Environment:**
- Risk: `NEXT_PUBLIC_SUPABASE_ANON_KEY` contains a real JWT token visible in client code
- Files: `SUPABASE_SETUP.md` (line 33-34), `.env.local`
- Current mitigation: Documented as "safe to use in client-side code" and anon key (not service key)
- Recommendations:
  - Verify Row Level Security (RLS) policies are actually enabled in Supabase
  - Document RLS policies clearly in code comments
  - Monitor for unauthorized access patterns
  - Consider token rotation strategy

**Unvalidated API URL in Environment:**
- Risk: `NEXT_PUBLIC_API_URL` (line 4 in `posts.ts`) defaults to `http://localhost:3001` but is never actually used
- Files: `app/lib/posts.ts`
- Current mitigation: Variable is declared but unused; poses no immediate risk
- Recommendations: Remove if not needed; if planned for future, validate all URLs before use

**Missing CSRF Protection on Forms:**
- Risk: Checkout form in `checkout/page.tsx` is client-side only with no server-side validation
- Files: `app/checkout/page.tsx`
- Current mitigation: No actual payment processing implemented yet
- Recommendations:
  - Add server-side form validation when payment integration added
  - Implement CSRF tokens for state-changing operations
  - Validate all user input server-side, never trust client validation alone

## Performance Bottlenecks

**Serialized All-Comics Fetch:**
- Problem: Every request to `/` or `/:slug` requires full fetch of all 100+ comics from DatoCMS
- Files: `app/lib/posts.ts` (lines 133-156)
- Cause: Pagination, slug lookup, and navigation all use `fetchAllPosts()` without filtering
- Improvement path:
  - Use DatoCMS query filters and first/skip parameters
  - Implement server-side caching with ISR or manual revalidation
  - Split queries: pagination query separate from detail query

**Repeated String Replacements in Blurb:**
- Problem: Line 134 in `app/page.tsx` concatenates string with `post.blurb.replace(...)` at render time
- Files: `app/page.tsx` (line 134)
- Cause: HTML manipulation happens in JSX during render instead of at data fetch time
- Improvement path: Process blurb in `mapDatoComicToPost` function; store processed HTML; avoid string operations in JSX

**Unnecessary Image Re-rendering:**
- Problem: Each comic image on homepage and detail pages uses `priority={index === 0}` check on every render
- Files: `app/page.tsx` (line 121), `app/[slug]/page.tsx` (line 121)
- Cause: Logic runs on every render cycle instead of being static
- Improvement path: Mark first image as priority during data mapping phase; pass as prop

**Checkout Form State Management:**
- Problem: 19-field form with individual state management in `checkout/page.tsx`
- Files: `app/checkout/page.tsx` (lines 18-46)
- Cause: Large flat object state; all fields re-render on any change
- Improvement path: Use form library like React Hook Form; split into smaller sub-components; memoize field components

## Fragile Areas

**DatoCMS Query Limits Not Enforced:**
- Files: `app/lib/datocms-queries.ts` (line 5)
- Why fragile: `first: 100` hardcoded; no pagination or offset; if content exceeds 100 comics, data silently truncates
- Safe modification: Use parameterized first/skip; implement query generation logic; add assertions for data completeness
- Test coverage: No tests for boundary conditions when approaching 100-item limit

**Missing Error Boundary Components:**
- Files: `app/page.tsx` (Suspense wrapping), `app/[slug]/page.tsx` (Suspense wrapping)
- Why fragile: Async component errors from `getPosts()` or `getPost()` bubble up; no error fallback UI
- Safe modification: Add React Error Boundary wrapper; implement proper error UI; test error states
- Test coverage: No error state testing; only happy path works

**Hardcoded Image Dimensions in Product Page:**
- Files: `app/shop/[id]/page.tsx` (lines 107-111, 130-136)
- Why fragile: Images hardcoded to 600x600 and 150x150; breaks responsive design if CMS returns different aspect ratios
- Safe modification: Use `Image` component's responsive sizing; detect aspect ratio from image metadata; use CSS aspect-ratio
- Test coverage: No visual regression tests for different image sizes

**Pagination Logic Mixed with Fetching:**
- Files: `app/lib/posts.ts` (lines 161-174)
- Why fragile: Client-side array slicing for pagination; if fetching changes, pagination math breaks
- Safe modification: Separate concerns—move pagination to API layer; fetch only needed page from DatoCMS
- Test coverage: No unit tests for pagination edge cases (page 0, page > totalPages, etc.)

**Checkbox Type Casting in handleInputChange:**
- Files: `app/checkout/page.tsx` (line 44)
- Why fragile: Manual type casting `e.target as HTMLInputElement` assumes correct DOM structure
- Safe modification: Use more specific event type; validate input type before casting; use form library
- Test coverage: No tests for checkbox interactions

## Scaling Limits

**DatoCMS Request Caching:**
- Current capacity: 60-second ISR revalidation on `datocmsRequest` (hardcoded in line 30 of `datocms.ts`)
- Limit: Any content update in DatoCMS takes up to 60 seconds to appear on site; multiple simultaneous requests hit DatoCMS
- Scaling path:
  - Implement webhook-based revalidation on DatoCMS content updates
  - Add background queue for cache invalidation
  - Use Redis or similar for distributed caching if multi-instance deployment planned

**Single-Threaded Data Loading:**
- Current capacity: Loads all 100+ comics on every full page load
- Limit: At 1000+ comics, initial load becomes slow; concurrent requests to DatoCMS API multiply load
- Scaling path:
  - Implement database layer (Supabase already available) to cache comic data
  - Use API pagination to load on-demand
  - Implement search/filtering at API level

**Supabase Hook Dependency Tracking:**
- Current capacity: Hook dependencies typed as `any[]`; no ESLint validation
- Limit: As code grows, missing dependencies cause subtle bugs; hard to debug
- Scaling path: Add `exhaustive-deps` ESLint rule; use TypeScript-strict dependency typing

## Dependencies at Risk

**Next.js on Latest (Breaking Changes):**
- Risk: `next: "latest"` pins to unpredictable minor/patch versions; latest Next.js 15.x has Turbopack and breaking changes
- Impact: Auto-updated dependencies can break build; no way to audit changes before applying
- Migration plan:
  - Pin to specific version (e.g., `"next": "15.1.6"`)
  - Test before deploying patch updates
  - Review Next.js changelog for each update

**React on Latest (Concurrent Features Enabled):**
- Risk: `react: "latest"` can be unstable; concurrent rendering may change behavior
- Impact: Suspense boundaries and async components may behave unexpectedly between releases
- Migration plan: Pin to stable version; test Suspense behavior explicitly

**next-auth Beta Version:**
- Risk: `next-auth 5.0.0-beta.25` is beta; likely to have breaking changes and security issues fixed before stable release
- Impact: If used in future, upgrade required before production; current unused state makes this moot
- Migration plan: Remove if not needed; if needed later, evaluate stable 5.0 release before using

**TypeScript 5.7.3 (Recent):**
- Risk: TypeScript 5.7 is recent; new compiler behaviors possible
- Impact: Type checking may change between minor versions; edge cases with type narrowing possible
- Migration plan: Keep pinned version; update carefully and test type-sensitive code

## Test Coverage Gaps

**No Unit Tests:**
- What's not tested: All utility functions (`formatDate`, `mapDatoComicToPost`, HTML entity decoding)
- Files: `app/lib/utils.ts`, `app/lib/posts.ts` (lines 28-130)
- Risk: Date formatting bugs go unnoticed; entity decoding regressions cause silent failures
- Priority: High

**No Integration Tests:**
- What's not tested: DatoCMS API integration; error handling when API fails
- Files: `app/lib/datocms.ts`, `app/lib/posts.ts`
- Risk: API errors silently return empty arrays; pagination breaks; no alerting
- Priority: High

**No Component Tests:**
- What's not tested: React components; Suspense fallback UI; error boundaries
- Files: `app/page.tsx`, `app/components/`
- Risk: UI breaks silently; loading states never tested; error UI never verified to render
- Priority: High

**No E2E Tests:**
- What's not tested: Full user journeys (view comic, navigate pagination, view product, checkout flow)
- Files: All page components
- Risk: Critical user paths broken without detection
- Priority: Medium

**No Visual Regression Tests:**
- What's not tested: Responsive design; image loading; layout with different content lengths
- Files: All pages
- Risk: Mobile layout breaks; images distort; accessibility regresses silently
- Priority: Medium

**No Error Scenario Tests:**
- What's not tested: DatoCMS API 500 errors, network timeouts, malformed responses
- Files: `app/lib/datocms.ts`, `app/lib/posts.ts`
- Risk: Error handling code never exercised; silent failures in production
- Priority: High

## Missing Critical Features

**No Search/Filter Functionality:**
- Problem: Site can't filter comics by date, title, or tag; pagination-only navigation for 100+ items
- Blocks: Users can't find specific comics; SEO for long-tail searches; content discovery poor
- Workaround: Instagram link used as primary discovery channel

**No Content Management UI:**
- Problem: All content edits require DatoCMS dashboard access; no admin panel in Next.js app
- Blocks: Non-technical users can't update simple things like product details or "about" text
- Workaround: Manual DatoCMS portal access required

**No Email Notifications:**
- Problem: No email on cart checkout; no newsletter signup; no contact form
- Blocks: User engagement; sales conversion; customer support
- Workaround: None; potential lost sales

**No Real Payment Integration:**
- Problem: Checkout form exists but doesn't process payments; `/checkout` endpoint missing
- Blocks: Shop feature is non-functional
- Workaround: None; shop is unusable

**No Analytics Beyond Google:**
- Problem: Only Google Analytics; no custom event tracking; no conversion tracking
- Blocks: Can't measure engagement; can't optimize without data
- Workaround: Manually check Google Analytics dashboard

---

*Concerns audit: 2026-02-20*
