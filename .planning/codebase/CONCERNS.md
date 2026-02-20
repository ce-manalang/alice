# Codebase Concerns

**Analysis Date:** 2026-02-20

## Security Issues

**XSS Vulnerability via dangerouslySetInnerHTML:**
- Issue: Multiple pages use `dangerouslySetInnerHTML` to render content from DatoCMS without HTML sanitization. Malicious HTML entities or scripts could be injected if CMS content is compromised.
- Files:
  - `app/page.tsx:134` - renders post blurb with string concatenation to add read more link
  - `app/[slug]/page.tsx:139` - renders comic body content
  - `app/shop/[id]/page.tsx:154` - renders product description
- Impact: Stored XSS vulnerability if CMS is compromised or if user-generated content reaches CMS
- Fix approach:
  - Replace `dangerouslySetInnerHTML` with a proper HTML sanitizer library like `sanitize-html` or `isomorphic-dompurify`
  - For the "read more" link injection in `page.tsx:134`, parse HTML properly and inject links programmatically instead of string manipulation
  - Consider using Next.js components to render rich content instead of raw HTML

**Payment Form Collects Credit Card Data in Frontend:**
- Issue: Checkout page (`app/checkout/page.tsx`) collects full credit card details (card number, CVV, expiry) in React component state without actual payment processing
- Files: `app/checkout/page.tsx:22-37` (form state)
- Impact:
  - Storing card data in React state violates PCI DSS compliance
  - Forms submitted without backend validation or payment gateway integration
  - User data is exposed to browser storage and could be logged/monitored
- Fix approach:
  - Implement Stripe/PayPal embedded payment forms for actual payment processing
  - Never collect raw card data in application code
  - Use tokenization services provided by payment processors
  - Add backend payment validation and webhook handling

## Performance Bottlenecks

**N+1 Queries in Posts Data Fetching:**
- Issue: `getPosts()`, `getPost()`, `getNextPrevPosts()`, and `getAllSlugs()` all call `fetchAllPosts()` independently, fetching entire comics list repeatedly
- Files: `app/lib/posts.ts:161-199`
- Cause: No server-side caching or memoization between requests. Each function call performs a full DatoCMS GraphQL query
- Impact: High latency on pages using comic data, excessive API calls to DatoCMS
- Improvement path:
  - Implement server-level caching using Next.js `unstable_cache` or `React.cache()`
  - Add pagination at DatoCMS level instead of fetching all records client-side
  - Consider using incremental static generation (ISR) for comic pages

**Disabled Caching in Posts Module:**
- Issue: Caching is explicitly disabled in `posts.ts` with comment "Cache disabled for debugging"
- Files: `app/lib/posts.ts:18-25`
- Cause: Left-over debug code from development
- Impact: All comic data refetched on every request, no benefit from Next.js revalidation
- Improvement path: Remove commented cache code and implement proper revalidation strategy

**HTML Entity Decoding Done at Runtime:**
- Issue: Extensive manual HTML entity decoding (46 lines of replacements) happens on every request for every comic
- Files: `app/lib/posts.ts:41-117`
- Cause: DatoCMS returns HTML-encoded content; manual string replacement instead of using built-in decoder
- Impact: Unnecessary CPU work on each request, slow page loads
- Improvement path:
  - Use `he` library or native HTML decoder for entity conversion
  - Move this to build time if content is static
  - Cache decoded results

## Test Coverage Gaps

**No Automated Tests:**
- Issue: Codebase has zero test files (no .test.ts, .spec.ts files found)
- Files: `app/` - entire directory untested
- Risk:
  - Breaking changes undetected until production
  - API integration failures not caught
  - Data transformation bugs in `posts.ts` and `datocms.ts` unknown
  - Checkout form submission logic has no validation tests
- Priority: High - especially for payment-related code

**No Integration Tests for External APIs:**
- Issue: DatoCMS and Supabase integrations have no integration tests
- Files: `app/lib/datocms.ts`, `app/lib/supabase.ts`, `app/lib/database.ts`
- Risk: Silent failures when APIs change format or availability
- Priority: High

**No E2E Tests:**
- Issue: No Cypress/Playwright tests for critical user flows
- Risk: Checkout flow untested, navigation broken undetected, image loading failures not caught
- Priority: Medium

## Type Safety Issues

**Loose Type Annotations:**
- Issue: Uses of `any` type reduce type safety benefits
- Files:
  - `app/lib/database.ts:4` - error parameter typed as `any`
  - `app/lib/useSupabase.ts:67,100` - dependency arrays typed as `any[]`
- Impact: Errors and dependencies not properly checked at compile time
- Fix approach: Replace with proper types - `unknown` for errors, proper dependency types for arrays

**Incomplete Database Type Definitions:**
- Issue: Supabase database type definitions are commented out stubs
- Files: `app/lib/supabase.ts:13-48` - Database interface empty
- Impact: No type checking for database operations, string-based table access is untyped
- Fix approach: Generate proper types using Supabase CLI or define manually

**Implicit Type Coercion:**
- Issue: Pagination page number parsed from string with `Number.parseInt()` but no validation
- Files: `app/page.tsx:27`
- Impact: Invalid page numbers could cause errors or unexpected behavior
- Fix approach: Validate page number is positive integer, set bounds checking

## Tech Debt

**Cache Disabled for Debugging:**
- Issue: Cache explicitly disabled with comment in `clearPostsCache()`
- Files: `app/lib/posts.ts:18-25`
- Impact: Every page load triggers full DatoCMS query regardless of Next.js revalidation
- Fix approach: Remove debug code, implement proper caching strategy

**Hardcoded Configuration:**
- Issue: Multiple hardcoded values scattered across codebase
- Files:
  - `app/lib/posts.ts:158` - `ITEMS_PER_PAGE = 10` hardcoded
  - `app/checkout/page.tsx:26-37` - default country, region, phone prefix hardcoded
- Impact: Difficult to change configuration without code changes
- Fix approach: Move to environment variables or config file

**String-based DatoCMS Queries:**
- Issue: GraphQL queries defined as raw strings, difficult to maintain
- Files: `app/lib/datocms-queries.ts`, `app/shop/page.tsx:20-32`
- Impact: No IDE support, prone to typos, hard to refactor
- Fix approach: Consider using `graphql-request` or similar typed query builder

**Incomplete Checkout Implementation:**
- Issue: Checkout form has no submission handler, no backend integration
- Files: `app/checkout/page.tsx:334` - submit button has no onClick/onSubmit handler
- Impact: User cannot actually complete purchases
- Fix approach: Connect to actual payment processor, implement order backend

**Mixed Link Navigation Patterns:**
- Issue: Inconsistent use of `Link` component vs `<a>` tags vs hardcoded hrefs
- Files: Multiple files (`app/page.tsx:33`, `app/[slug]/page.tsx:87`, etc.)
- Impact: Some navigation not optimized with Next.js prefetching
- Fix approach: Use `Link` component consistently throughout

## Fragile Areas

**HTML Entity Decoding Logic:**
- Files: `app/lib/posts.ts:41-117`
- Why fragile:
  - 46 separate regex replacements with no centralized logic
  - Manual numeric and hex entity handling could miss edge cases
  - Duplicated code for body and blurb - not DRY
- Safe modification: Extract into separate function, add unit tests for common entities
- Test coverage: Zero tests for this critical path

**Post/Comic Data Mapping:**
- Files: `app/lib/posts.ts:28-130`
- Why fragile:
  - Complex type transformation with optional fields
  - No validation that required fields exist before mapping
  - `image_urls` could be empty but treated as array everywhere
  - `prev_comic_slug` default to empty string, could break navigation
- Safe modification: Add validation, throw errors for missing required fields, add type guards
- Test coverage: No tests for edge cases

**DatoCMS GraphQL Integration:**
- Files: `app/lib/datocms.ts`, `app/lib/datocms-queries.ts`
- Why fragile:
  - Error handling swallows detailed GraphQL errors
  - Network errors not distinguished from GraphQL errors
  - No retry logic for transient failures
  - Hardcoded 60-second revalidation may be too frequent or too stale
- Safe modification: Add granular error types, implement exponential backoff retries
- Test coverage: No integration tests with actual DatoCMS

**Checkout Page State Management:**
- Files: `app/checkout/page.tsx:18-46`
- Why fragile:
  - Form state in `useState` with no validation
  - No required field checking before submission
  - Card fields accept any text (no Luhn validation, format checking)
  - No feedback on validation errors to user
- Safe modification: Add form validation library (zod), implement input masks, show error messages
- Test coverage: No form validation tests

## Scaling Limits

**DatoCMS Query Limits:**
- Current capacity: Entire comic/product list fetched on each request (unbounded)
- Limit: API rate limits, response time degrades as content grows
- Scaling path:
  - Implement server-side caching or edge caching
  - Add pagination at API level
  - Use ISR or incremental builds for static content

**Supabase Connections:**
- Current capacity: Each database function creates new connection implicitly
- Limit: Connection pooling not configured, may exhaust limits under load
- Scaling path: Configure connection pooling in Supabase settings, consider caching patterns

**Image Delivery:**
- Current capacity: Images hosted externally (DatoCMS), served directly
- Limit: No image optimization, responsive images, or CDN caching strategy
- Scaling path:
  - Use Next.js Image component with proper sizes
  - Implement image caching headers
  - Consider image optimization service

## Dependencies at Risk

**next-auth Beta Version:**
- Risk: Using `"next-auth": "5.0.0-beta.25"` - unstable beta version
- Impact: Breaking changes possible in patch updates, security patches may not be released
- Migration plan: Switch to stable version (4.x) until 5.0 is released, or pin exact version with strict testing

**postgres Driver Usage:**
- Risk: Direct postgres driver imported but never used in application code
- Impact: Dead dependency increases attack surface and bundle size
- Migration plan: Remove `postgres` from dependencies if not needed for direct queries

## Missing Critical Features

**No Authentication/Authorization:**
- Problem: Supabase auth hooks exist (`useAuth`, `useSupabaseQuery`) but not used anywhere in application
- Blocks: Cannot implement user accounts, admin panel, protected checkout
- Priority: High - needed for production e-commerce

**No Order Management:**
- Problem: Checkout collects data but no backend to store/process orders
- Blocks: No order history, no fulfillment tracking, no payment processing
- Priority: High - critical for shop functionality

**No Input Validation:**
- Problem: Forms have no validation (checkout, posts)
- Blocks: Invalid data can reach backend, bad user experience
- Priority: High

**No Error Boundaries:**
- Problem: No error handling for component failures, will crash entire page
- Blocks: Poor error recovery, bad UX on failures
- Priority: Medium

**No Logging/Monitoring:**
- Problem: No structured logging, error tracking, or observability
- Blocks: Production issues invisible until users report them
- Priority: Medium

## Code Quality Concerns

**Debug Logging:**
- Issue: `console.log` statements left in production code
- Files: `app/lib/posts.ts:24`, `app/lib/database.ts:5`, `app/shop/[id]/page.tsx:182`
- Impact: Clutters browser console, may expose internal state
- Fix: Use proper logging library, remove debug statements

**No Linting/Formatting Config:**
- Issue: No .eslintrc or .prettierrc files found
- Impact: Code style inconsistent, potential bugs (unused variables, type issues) not caught
- Fix: Add ESLint and Prettier configuration

**Commented Code:**
- Issue: Multiple sections of commented-out code left in files
- Files: `app/page.tsx:57-112`, `app/[slug]/page.tsx:96-111`
- Impact: Confuses maintenance, increases file size, clutters codebase
- Fix: Remove or move to separate branch/documentation

---

*Concerns audit: 2026-02-20*
