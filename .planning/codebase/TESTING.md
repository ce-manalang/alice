# Testing Patterns

**Analysis Date:** 2026-02-20

## Test Framework

**Runner:**
- Not detected - No test framework installed or configured
- No Jest, Vitest, or other testing library found in package.json
- No test configuration files (jest.config.ts, vitest.config.ts) present

**Assertion Library:**
- Not applicable - Testing framework not detected

**Run Commands:**
```bash
# No test commands configured in package.json
# Testing infrastructure does not exist
```

## Test File Organization

**Location:**
- No test files found in codebase
- Searched for `*.test.ts`, `*.test.tsx`, `*.spec.ts`, `*.spec.tsx` patterns
- No dedicated test directories (`__tests__`, `tests/`, `test/`)

**Naming:**
- Not applicable - No test files present

**Structure:**
- Not applicable - No test infrastructure

## Testing Status

**Current State:**
- **No automated tests implemented**
- No unit tests
- No integration tests
- No end-to-end tests
- Testing framework not installed

## Test Infrastructure Gaps

**Missing Dependencies:**
- Jest, Vitest, or similar test runner
- Testing library (@testing-library/react, @testing-library/dom)
- Assertion libraries (expect, chai)
- Mock libraries (vitest mocks, jest mocks)

**Missing Configuration:**
- No test configuration files
- No test scripts in package.json
- No coverage configuration
- No test environment setup

**Development Dependency Gap:**
- package.json has zero dev dependencies for testing
- TypeScript types for testing framework not present

## Code Areas Requiring Test Coverage

**Critical Untested Areas:**

**1. Data Fetching Functions - `app/lib/posts.ts`**
- `fetchAllPosts()` - DatoCMS API integration (lines 133-156)
- `mapDatoComicToPost()` - Complex HTML entity decoding (lines 28-130)
- `getPosts(page)` - Pagination logic (lines 161-175)
- `getPost(slug)` - Single post retrieval (lines 177-181)
- Risk: API failures, malformed data, incorrect pagination not caught

**2. Database Operations - `app/lib/database.ts`**
- `fetchData<T>()` - Generic fetch with filters and ordering (lines 10-49)
- `insertData<T>()` - Insert operations (lines 52-69)
- `updateData<T>()` - Update operations (lines 72-91)
- `deleteData()` - Delete operations (lines 94-110)
- `uploadFile()` - File storage operations (lines 133-155)
- `deleteFile()` - File deletion (lines 158-173)
- Risk: Database integrity issues, storage failures, data loss

**3. External API Integration - `app/lib/datocms.ts`**
- `datocmsRequest<T>()` - GraphQL request handling (lines 12-50)
- Error handling for network failures, API errors, malformed responses
- Risk: Unhandled API errors, broken feature chains

**4. Utility Functions - `app/lib/utils.ts`**
- `formatDate()` - Date formatting (lines 2-8)
- Edge cases: Invalid dates, different locales, timezone handling
- Risk: Incorrect date display in UI

**5. Markdown Processing - `app/lib/markdown.ts`**
- `markdownToHtml()` - Markdown to HTML conversion with link processing (lines 8-28)
- Plugin pipeline processing
- Risk: Incorrect HTML rendering, broken links

**6. React Components - `app/components/`**
- `Pagination` component - Page number rendering logic
- `LoadingSkeleton` component - Placeholder rendering
- `ComicNavigation` component - Navigation logic
- Risk: UI rendering issues, accessibility problems

**7. Page Components - `app/[slug]/page.tsx`, `app/page.tsx`, `app/shop/page.tsx`**
- Dynamic route parameter handling
- Data fetching and error boundaries
- Metadata generation
- Risk: 404 handling failures, missing metadata, broken layouts

**8. Error Handling Patterns - `app/lib/database.ts`**
- Generic error handler (lines 4-7)
- Error recovery and fallback values
- Risk: Silent failures, unhandled exceptions

## Recommended Testing Strategy

**Priority 1 (High Impact):**
1. **Unit tests for data transformation functions**
   - Test `mapDatoComicToPost()` with various HTML entities
   - Test `formatDate()` with edge cases
   - Test `fetchData()` with different filter combinations

2. **Integration tests for API calls**
   - Mock DatoCMS requests
   - Test error handling in `datocmsRequest()`
   - Test retry logic and fallbacks

3. **Component tests**
   - Test `Pagination` component rendering with different page counts
   - Test `ComicNavigation` with next/prev links
   - Test data loading states with `Suspense`

**Priority 2 (Medium Impact):**
1. **Database function tests**
   - Mock Supabase client
   - Test CRUD operations with type safety
   - Test file upload/delete operations

2. **Page component tests**
   - Test dynamic route parameters
   - Test metadata generation
   - Test 404 handling via `notFound()`

3. **Markdown processing tests**
   - Test HTML entity handling
   - Test link processing (target="_blank", rel="noopener noreferrer")

**Priority 3 (Coverage):**
1. End-to-end tests for user workflows
2. Performance tests for large comic lists
3. Accessibility tests for components

## Suggested Test Framework Setup

**Recommended Stack:**
```json
{
  "devDependencies": {
    "@testing-library/react": "^15.x",
    "@testing-library/jest-dom": "^6.x",
    "@types/jest": "^29.x",
    "jest": "^29.x",
    "jest-environment-jsdom": "^29.x",
    "ts-jest": "^29.x"
  }
}
```

**Alternative (Using Vitest):**
```json
{
  "devDependencies": {
    "@testing-library/react": "^15.x",
    "@testing-library/jest-dom": "^6.x",
    "@vitest/ui": "^1.x",
    "vitest": "^1.x",
    "jsdom": "^24.x"
  }
}
```

**Configuration Files Needed:**
- `jest.config.js` or `vitest.config.ts`
- `jest.setup.js` or vitest setup file
- Test files co-located with source or in `__tests__/` directories
- `package.json` scripts: `test`, `test:watch`, `test:coverage`

## Test Coverage Goals

**Target Coverage:**
- Statements: 70%+
- Branches: 65%+
- Functions: 75%+
- Lines: 70%+

**Critical Coverage (100% target):**
- Error handling paths in `database.ts`
- Type safety in generic functions
- Data transformation in `posts.ts`
- API error responses in `datocms.ts`

## Mock Patterns for Implementation

**Mocking Supabase:**
```typescript
vi.mock('@supabase/supabase-js', () => ({
  createClient: vi.fn(() => ({
    from: vi.fn(() => ({
      select: vi.fn().mockReturnThis(),
      insert: vi.fn().mockReturnThis(),
      // ... other methods
    })),
  })),
}))
```

**Mocking DatoCMS Requests:**
```typescript
vi.mock('@/app/lib/datocms', () => ({
  datocmsRequest: vi.fn(async (query) => {
    // Return mock data based on query
  }),
}))
```

**Mocking Next.js Features:**
```typescript
vi.mock('next/navigation', () => ({
  notFound: vi.fn(() => { throw new Error('Not found') }),
}))
```

## Current Testing Barriers

1. **No test runner installed** - Must add Jest or Vitest
2. **No testing utilities** - Must add @testing-library
3. **No test configuration** - Must create config files
4. **No test data/fixtures** - Must create mock data
5. **No CI/CD test step** - No test runs in pipeline
6. **Complex async/fetch patterns** - Requires careful mocking setup

---

*Testing analysis: 2026-02-20*
