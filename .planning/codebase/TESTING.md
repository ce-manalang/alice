# Testing Patterns

**Analysis Date:** 2026-02-20

## Test Framework

**Status:** Not implemented

- No test files detected (searched for `*.test.*`, `*.spec.*`)
- No test configuration found (`jest.config.*`, `vitest.config.*`)
- No testing libraries in `package.json` (no jest, vitest, mocha, or testing-library dependencies)
- No test scripts in package.json

**Recommendation:** Testing is a gap. See CONCERNS.md for testing coverage details.

## Test Infrastructure

**Current State:**
- TypeScript strict mode enabled for type safety
- No test framework integrated
- No test data generators or fixtures

## Recommended Testing Approach

**For this Next.js/React codebase, consider implementing:**

**Test Framework Options:**
1. **Vitest** (recommended for Next.js 15+)
   - Fast, modern, compatible with Next.js
   - Native ESM support
   - Great TypeScript support

2. **Jest** (traditional option)
   - Official Next.js support
   - Well-established ecosystem
   - Requires more Next.js configuration

**Assertion Library:**
- Recommend: Vitest's built-in `expect` or `@testing-library/react`

## Code Areas That Need Testing

**Unit Tests:**

1. **Utility Functions** (`app/lib/utils.ts`):
   - `formatDate()` - date formatting with various input formats
   - Test edge cases: invalid dates, null values, timezone handling

2. **Data Fetching** (`app/lib/posts.ts`):
   - `getPosts()` - pagination logic
   - `getPost()` - single post retrieval
   - `getNextPrevPosts()` - navigation logic
   - `mapDatoComicToPost()` - data transformation
   - Test HTML entity decoding with various encoded characters

3. **Database Functions** (`app/lib/database.ts`):
   - `fetchData<T>()` - query building with filters, ordering, limits
   - `insertData<T>()` - insert operations
   - `updateData<T>()` - update with ID
   - `deleteData()` - deletion
   - Error handling paths

4. **API Functions** (`app/lib/datocms.ts`):
   - `datocmsRequest<T>()` - GraphQL request handling
   - Error handling (missing token, request failures, GraphQL errors)
   - Response parsing

**Component Tests:**

1. **Pagination Component** (`app/components/pagination.tsx`):
   - Navigation link rendering based on currentPage and totalPages
   - Page number display and linking
   - Previous/next visibility logic

2. **Loading Skeleton** (`app/components/loading-skeleton.tsx`):
   - Renders correct number of skeleton items
   - Randomized line widths render

3. **Comic Navigation** (`app/components/comic-navigation.tsx`):
   - Renders prev/next links when available
   - Hides prev/next when null
   - Home link always renders

**Hook Tests:**

1. **useAuth()** (`app/lib/useSupabase.ts`):
   - Initial session loading
   - Sign in/sign up/sign out operations
   - Auth state change listeners
   - Error handling

2. **useSupabaseQuery()** (`app/lib/useSupabase.ts`):
   - Data fetching and loading states
   - Error state handling
   - Refetch functionality
   - Dependency change re-fetching

3. **useSupabaseMutation()** (`app/lib/useSupabase.ts`):
   - Mutation execution
   - Loading state during mutation
   - Error capture
   - Return data structure

**Integration Tests:**

1. **Page Components** (`app/page.tsx`, `app/[slug]/page.tsx`):
   - getPosts with pagination
   - getPost with data display
   - Metadata generation
   - Error cases (notFound)

2. **Form Handling** (`app/checkout/page.tsx`):
   - Form state updates with handleInputChange
   - Checkbox vs text input handling
   - Dynamic form submission

## Test Structure Recommendation

**File Organization:**
- Co-locate test files with source code: `posts.ts` → `posts.test.ts`
- Keep tests in same directory as source: `app/lib/posts.test.ts`
- Component tests alongside components: `app/components/pagination.test.tsx`

**Suite Organization:**
```typescript
describe('formatDate', () => {
  it('should format date as "Month Day, Year"', () => {
    const result = formatDate('2024-02-20')
    expect(result).toBe('February 20, 2024')
  })

  it('should handle invalid dates gracefully', () => {
    const result = formatDate('invalid')
    // Test expected behavior
  })
})

describe('getPosts', () => {
  it('should return paginated posts', async () => {
    const result = await getPosts(1)
    expect(result).toHaveProperty('posts')
    expect(result).toHaveProperty('totalPages')
    expect(result).toHaveProperty('currentPage')
  })

  it('should calculate correct totalPages', async () => {
    const result = await getPosts(1)
    expect(result.totalPages).toBe(Math.ceil(total / ITEMS_PER_PAGE))
  })
})
```

## Mocking Strategy

**Framework:** Use Vitest's built-in mocking or `jest.mock()`

**Patterns to Implement:**

1. **Mock External APIs:**
```typescript
// Mock datocmsRequest in tests
vi.mock('@/app/lib/datocms', () => ({
  datocmsRequest: vi.fn(async () => ({
    allComics: mockComicData
  }))
}))
```

2. **Mock Supabase Client:**
```typescript
// Mock supabase initialization
vi.mock('@/app/lib/supabase', () => ({
  supabase: mockSupabaseClient,
  typedSupabase: mockSupabaseClient
}))
```

3. **Mock Next.js Features:**
```typescript
// Mock notFound, navigate
vi.mock('next/navigation', () => ({
  notFound: vi.fn(),
  useRouter: vi.fn()
}))
```

**What to Mock:**
- External API calls (DatoCMS)
- Database/Supabase operations
- Next.js navigation functions
- Environment variables

**What NOT to Mock:**
- Date formatting utilities (test actual implementation)
- Data transformation functions (test actual behavior)
- Component rendering logic
- React hooks (unless testing side effects)

## Test Data / Fixtures

**Location:** Create `app/__tests__/fixtures/` or `app/lib/__tests__/fixtures/`

**Fixture Examples:**
```typescript
// fixtures/mockPosts.ts
export const mockPost: Post = {
  id: 'test-1',
  slug: 'test-comic',
  title: 'Test Comic',
  image_urls: ['https://example.com/image.jpg'],
  date: '2024-02-20',
  blurb: 'Test blurb',
  body: 'Test body',
  prev_comic_slug: 'prev-comic',
  next_comic_slug: 'next-comic'
}

export const mockPosts: Post[] = [
  mockPost,
  { ...mockPost, slug: 'another-comic', id: 'test-2' }
]

// fixtures/mockProducts.ts
export const mockProduct: Product = {
  id: 'prod-1',
  name: 'Test Product',
  price: 'P600.00',
  images: [{ url: 'https://example.com/prod.jpg', alt: 'Product' }],
  alt: 'Product alt text'
}
```

**Factory Functions:**
```typescript
export function createMockPost(overrides?: Partial<Post>): Post {
  return {
    ...mockPost,
    ...overrides
  }
}

export function createMockPosts(count: number): Post[] {
  return Array.from({ length: count }, (_, i) =>
    createMockPost({ id: `test-${i}`, slug: `comic-${i}` })
  )
}
```

## Coverage Targets

**Current Coverage:** 0% (no tests implemented)

**Recommended Targets:**
- Utility functions: 100% (deterministic, easy to test)
- Data fetching: 80%+ (happy path + error cases)
- Components: 60%+ (render + user interactions)
- Hooks: 70%+ (state changes + side effects)

**Focus Areas for Initial Testing:**
1. **High Priority:** `app/lib/posts.ts` (getPosts pagination, mapDatoComicToPost decoding)
2. **High Priority:** `app/lib/utils.ts` (formatDate)
3. **Medium Priority:** `app/lib/database.ts` (generic CRUD operations)
4. **Medium Priority:** Components (Pagination, LoadingSkeleton)
5. **Lower Priority:** Hooks (require async testing setup)

## Async Testing

**Pattern for Server Functions:**
```typescript
describe('getPosts', () => {
  it('should fetch and paginate posts', async () => {
    const result = await getPosts(1)

    expect(result.posts).toBeDefined()
    expect(result.posts.length).toBeLessThanOrEqual(10)
    expect(result.totalPages).toBeGreaterThan(0)
  })
})
```

**Pattern for Client Hooks:**
```typescript
import { renderHook, waitFor } from '@testing-library/react'

describe('useAuth', () => {
  it('should load session on mount', async () => {
    const { result } = renderHook(() => useAuth())

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })
  })
})
```

## Error Testing

**Current Error Patterns in Code:**

1. **Try-catch blocks:**
```typescript
try {
  const result = await operation()
  return result
} catch (error) {
  console.error("Error message:", error)
  return defaultValue
}
```

2. **Error object destructuring:**
```typescript
const { error } = await operation()
if (error) {
  // Handle error
}
```

**Test Error Cases:**
```typescript
describe('datocmsRequest', () => {
  it('should throw on missing API token', async () => {
    process.env.DATOCMS_API_TOKEN = undefined

    await expect(datocmsRequest('query')).rejects.toThrow(
      'Missing DATOCMS_API_TOKEN'
    )
  })

  it('should throw on GraphQL errors', async () => {
    mockFetch.mockResolvedValueOnce(
      mockResponse({ errors: [{ message: 'Field error' }] })
    )

    await expect(datocmsRequest('query')).rejects.toThrow(
      'DatoCMS GraphQL errors'
    )
  })
})

describe('database operations', () => {
  it('should return null on insert error', async () => {
    mockSupabase.from().insert().select().single.mockResolvedValueOnce({
      error: new Error('Insert failed')
    })

    const result = await insertData('table', { data: 'test' })
    expect(result).toBeNull()
  })
})
```

## Next Steps for Implementation

1. Install test framework: `npm install -D vitest @testing-library/react @testing-library/jest-dom`
2. Create `vitest.config.ts` configuration
3. Set up test fixtures in `__tests__/fixtures/`
4. Start with utility function tests (formatDate, data transformations)
5. Add component tests (Pagination, LoadingSkeleton)
6. Add hook tests with async setup
7. Add integration tests for page components

---

*Testing analysis: 2026-02-20*
