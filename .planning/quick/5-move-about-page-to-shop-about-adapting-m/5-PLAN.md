---
phase: quick-5
plan: 01
type: execute
wave: 1
depends_on: []
files_modified:
  - app/shop/about/page.tsx
  - app/about/page.tsx
  - app/components/Navigation.tsx
  - app/components/Footer.tsx
autonomous: true
requirements: []
must_haves:
  truths:
    - "/shop/about renders the shop-styled about page with shop nav and footer"
    - "/about serves the original comics-style about page (main branch content)"
    - "Navigation 'about' link points to /shop/about"
    - "Footer and Navigation show/hide correctly on /shop/about"
  artifacts:
    - path: "app/shop/about/page.tsx"
      provides: "Shop about page at /shop/about"
    - path: "app/about/page.tsx"
      provides: "Comics about page (restored from main branch)"
  key_links:
    - from: "app/components/Navigation.tsx"
      to: "/shop/about"
      via: "href on about link"
      pattern: "href=\"/shop/about\""
    - from: "app/components/Navigation.tsx SHOP_ROUTES"
      to: "/shop/about"
      via: "SHOP_ROUTES array includes /shop/about"
      pattern: "'/shop/about'"
---

<objective>
Move the shop about page from /about to /shop/about, restore the original comics about page at /about, and update nav/footer route detection accordingly.

Purpose: The /about route should remain the comics-style page (main branch content). The shop about page lives under the /shop namespace, consistent with all other shop routes.
Output: app/shop/about/page.tsx (shop about), app/about/page.tsx (comics about restored), updated Navigation.tsx and Footer.tsx SHOP_ROUTES.
</objective>

<execution_context>
@/Users/august/.claude/get-shit-done/workflows/execute-plan.md
@/Users/august/.claude/get-shit-done/templates/summary.md
</execution_context>

<context>
@.planning/STATE.md
@.planning/quick/5-move-about-page-to-shop-about-adapting-m/5-PLAN.md

<interfaces>
<!-- Current shop about page (app/about/page.tsx on feat/shop) — move this to app/shop/about/page.tsx -->
<!-- Key changes needed: canonical URL /about -> /shop/about, og url /about -> /shop/about, "Browse the shop" link stays /shop -->

From app/components/Navigation.tsx:
```typescript
// Current SHOP_ROUTES — /about needs to become /shop/about
const SHOP_ROUTES = ['/shop', '/about', '/faq', '/cart', '/checkout']

// Current about link — href needs to change
<Link href="/about" ...>about</Link>
```

From app/components/Footer.tsx:
```typescript
// Mirrors Navigation SHOP_ROUTES — same update needed
const SHOP_ROUTES = ['/shop', '/about', '/faq', '/cart', '/checkout']
```

Main branch app/about/page.tsx content (to restore at /about):
- Uses old CSS classes: container, header, title, navbar, docs-section
- Has artist bio, about image (/assets/images/about.jpg), email link
- Has comics-style header/nav (self-contained, not shop nav)
</interfaces>
</context>

<tasks>

<task type="auto">
  <name>Task 1: Create app/shop/about/page.tsx from current shop about page</name>
  <files>app/shop/about/page.tsx</files>
  <action>
    Create the directory app/shop/about/ and write page.tsx with the contents of the current app/about/page.tsx (the shop-styled version), with these adjustments:
    - Update metadata canonical: '/about' -> '/shop/about'
    - Update metadata openGraph url: '/about' -> '/shop/about'
    - Keep all page content identical (brand story, contact section, "Browse the shop" link)
    - The page already uses shop-page and shop-container classes — no layout changes needed

    Final file content:
    ```tsx
    import type { Metadata } from 'next'
    import Link from 'next/link'

    export const metadata: Metadata = {
      title: 'About',
      description: 'centimentalcomics creates educational CS products — zines, pins, and stationery — that make computer science feel human and accessible.',
      alternates: { canonical: '/shop/about' },
      openGraph: {
        title: 'About | centimentalcomics',
        description: 'centimentalcomics creates educational CS products — zines, pins, and stationery — that make computer science feel human and accessible.',
        url: '/shop/about',
      },
    }

    export default function AboutPage() {
      return (
        <div className="shop-page">
          <div className="shop-container" style={{ paddingTop: '3rem', paddingBottom: '5rem', maxWidth: '720px' }}>
            <h1 style={{ fontFamily: "'Inter', system-ui, sans-serif", fontSize: '2rem', fontWeight: 700, color: '#111111', margin: '0 0 2rem', lineHeight: 1.1 }}>
              About
            </h1>

            <div style={{ fontFamily: "'Inter', system-ui, sans-serif", fontSize: '1rem', color: '#374151', lineHeight: 1.75, display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <p>
                centimentalcomics is an independent studio making educational CS products that feel human — zines, stationery, and pins that bring warmth and personality to computer science learning.
              </p>
              <p>
                Founded by ce manalang, centimentalcomics started as a way to fill a gap in CS education: the gap between dry textbook content and the playful, curious spirit that actually brings people into programming. Every product is designed to be a small encouragement — a reminder that CS is creative, collaborative, and deeply human.
              </p>
              <p>
                The shop focuses on work that can live on a desk, in a notebook, or on a laptop. Products are made in small batches, sold at meetups and through this shop, and fulfilled in person wherever possible.
              </p>
              <p>
                centimentalcomics donates a portion of proceeds to CS education initiatives in underserved communities in the Philippines.
              </p>

              <div style={{ marginTop: '1rem', paddingTop: '1.5rem', borderTop: '1px solid #e5e7eb' }}>
                <p style={{ marginBottom: '0.5rem' }}>
                  Questions? Reach out at{' '}
                  <a href="mailto:cm@centimentalcomics.com" style={{ color: '#ec4899', textDecoration: 'none' }}>
                    cm@centimentalcomics.com
                  </a>
                </p>
                <p style={{ margin: 0 }}>
                  <Link href="/shop" style={{ color: '#ec4899', textDecoration: 'none', fontWeight: 500 }}>
                    Browse the shop →
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      )
    }
    ```
  </action>
  <verify>
    curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/shop/about (returns 200 after dev server start)
    OR: confirm file exists at app/shop/about/page.tsx with correct canonical '/shop/about'
  </verify>
  <done>app/shop/about/page.tsx exists with shop layout and updated canonical/og URLs pointing to /shop/about</done>
</task>

<task type="auto">
  <name>Task 2: Restore comics about page at /about and update nav/footer routes</name>
  <files>app/about/page.tsx, app/components/Navigation.tsx, app/components/Footer.tsx</files>
  <action>
    Three changes in one pass:

    **1. app/about/page.tsx — restore main branch comics about page:**
    Replace with the original comics-style content from main branch. This page is self-contained (includes its own header/nav markup using old CSS classes, no shop layout):

    ```tsx
    import Image from "next/image"
    import Link from "next/link"
    import type { Metadata } from "next"

    export const metadata: Metadata = {
      title: "centimentalcomics: about",
      description: "learn about centimentalcomics and the artist behind the comics",
      alternates: {
        canonical: "/about",
      },
      openGraph: {
        title: "centimentalcomics: about",
        description: "learn about centimentalcomics and the artist behind the comics",
        url: "/about",
      },
    }

    export default function About() {
      return (
        <div className="container">
          <header className="header">
            <h1 className="title"><Link href="/">centimentalcomics</Link></h1>
            <h2>some comics about art and internet</h2>
            <div className="value-props row">
            </div>
          </header>
          <div className="navbar-spacer"></div>
          <nav className="navbar">
            <div className="container">
              <ul className="navbar-list">
                <li className="navbar-item">
                  <a className="navbar-link" href="/">home</a>
                </li>
                <li className="navbar-item">
                  <a className="navbar-link" href="https://www.instagram.com/centimentalcomics?utm_source=shop">
                    shop
                  </a>
                </li>
                <li className="navbar-item">
                  <a className="navbar-link" href="about">about</a>
                </li>
              </ul>
            </div>
          </nav>
          <div className="docs-section">
            <h2><u>about centimentalcomics</u></h2>
            <p>some sentimental some just mental comics about art and the internet.</p>
            <p>doing a spring cleaning of the website.</p>
            <h2><u>about the artist</u></h2>
            <p>
              i&apos;m ce manalang. i love human and computer language. reading, sometimes writing.
            </p>
            <p>
              chat me at <a href="mailto:cm@centimentalcomics.com">cm@centimentalcomics.com</a>.
            </p>
            <p>
              everything else are here <a href="https://cv.centimentalcomics.com">cv.centimentalcomics.com</a>.
            </p>
            <p>
              thank you
            </p>
            <Image
              width={706}
              height={738}
              alt="about"
              src={"/assets/images/about.jpg"}
              style={{ width: '100%', height: 'auto' }}
            />
          </div>
        </div>
      )
    }
    ```

    Note: Removed emoji from "thank you 🙂" to satisfy no-emoji convention. Escaped apostrophe in "i'm" as i&apos;m for JSX safety.

    **2. app/components/Navigation.tsx — two updates:**
    - Change SHOP_ROUTES: replace '/about' with '/shop/about'
      ```typescript
      const SHOP_ROUTES = ['/shop', '/shop/about', '/faq', '/cart', '/checkout']
      ```
    - Change the about nav link href from '/about' to '/shop/about':
      ```tsx
      <Link href="/shop/about" ...>about</Link>
      ```

    **3. app/components/Footer.tsx — one update:**
    - Change SHOP_ROUTES: replace '/about' with '/shop/about'
      ```typescript
      const SHOP_ROUTES = ['/shop', '/shop/about', '/faq', '/cart', '/checkout']
      ```
  </action>
  <verify>
    Check three things:
    1. app/about/page.tsx contains "docs-section" (comics class) and does NOT contain "shop-page"
    2. app/components/Navigation.tsx contains '/shop/about' in SHOP_ROUTES and href="/shop/about" on the about link
    3. app/components/Footer.tsx contains '/shop/about' in SHOP_ROUTES (not '/about')
  </verify>
  <done>
    - /about serves comics-style page (no shop nav)
    - /shop/about shows shop nav/footer
    - Navigation "about" link goes to /shop/about
    - No /about routes remain in SHOP_ROUTES
  </done>
</task>

</tasks>

<verification>
After completing both tasks, verify the route behavior:

1. Visit /shop/about — shop nav/footer visible, shop-styled about content renders
2. Visit /about — comics-style page renders (no shop nav), has artist bio and image section
3. Click "about" in shop navigation — goes to /shop/about (not /about)
4. Run: `pnpm build` — no TypeScript errors, no missing imports
</verification>

<success_criteria>
- /shop/about renders shop about page with canonical /shop/about
- /about renders comics about page (restored from main branch)
- Navigation.tsx: SHOP_ROUTES has '/shop/about', about link href='/shop/about'
- Footer.tsx: SHOP_ROUTES has '/shop/about'
- No broken references to old /about route in shop components
</success_criteria>

<output>
After completion, create `.planning/quick/5-move-about-page-to-shop-about-adapting-m/5-SUMMARY.md` following the summary template.
</output>
