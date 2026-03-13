# Pitfalls: Adding Portfolio Features to Existing Next.js E-Commerce Site

**Domain:** Rails-focused portfolio integrated into existing Next.js 15 e-commerce shop
**Researched:** 2026-03-04
**Confidence:** HIGH (route conflicts, SEO migration best practices from official sources) → MEDIUM (Tokyo cultural tone specifics)

## Executive Summary

Adding portfolio features to an existing e-commerce site is a high-risk **integration** problem, not a new-site problem. The primary danger is **route/slug conflicts** causing either portfolio or product pages to become unreachable. Secondary risks include **navigation confusion** (visitors unsure whether to hire or shop), **CSS style bleeding** (Tailwind utilities from two design systems colliding), and **SEO turbulence** from changing site primary purpose. Tokyo market adds a cultural risk: **tone misalignment** (emotional portfolio language contradicts the precision-focused tone Japanese tech hiring culture expects).

Unlike building a portfolio from scratch, adding to an existing shop means existing shop traffic is at risk. Missteps here can break e-commerce functionality or tank search engine visibility—a much higher cost than launching portfolio-only.

---

## Critical Pitfalls

### Pitfall 1: Route/Slug Conflicts Between Portfolio and Products

**What goes wrong:**
Both portfolio case studies and shop products use dynamic `[slug]` routes. Without explicit routing separation, a product slug and case study slug can collide (e.g., both a product category AND a case study named "rails-case-study"). This causes one content type to shadow the other—either the case study becomes unreachable (404) or the product page breaks (wrong component renders).

**Why it happens:**
Your codebase currently has a unified `[slug]` route that handles both products and category pages. Adding case studies to this same route without changing the routing architecture creates a collision risk. Developers assume Next.js will "just figure it out," but the router matches first-come-first-serve. If a case study slug matches a product slug, whichever route is defined first wins.

**How to avoid:**
- **Strategy 1 (Recommended for this project):** Explicit routing hierarchy—Use route groups to separate concerns:
  ```
  /app
    /shop
      /[slug]           → product pages only
    /(portfolio)
      /case-studies
        /[slug]         → case study pages
      /resume
      /contact
  ```
  This ensures no collision: products at `/[slug]`, case studies at `/case-studies/[slug]`.

- **Strategy 2:** Slug prefixing—If restructuring routes is too invasive, ensure no product slug can collide with case study paths:
  - Product slugs: auto-add "product-" prefix or use UUIDs
  - Case study slugs: auto-add "cs-" prefix or use UUID
  - Collision still possible but less likely; requires discipline

- **Strategy 3:** Content-type dispatch in route—In a single `[slug]` route, fetch from both product and case study data sources server-side:
  ```typescript
  const product = await getProduct(slug);
  const caseStudy = await getCaseStudy(slug);

  if (product) return <ProductPage data={product} />;
  if (caseStudy) return <CaseStudyPage data={caseStudy} />;
  return <NotFound />;
  ```
  Works but creates ambiguity: which content type "owns" a slug? Risk of returning wrong content.

**Warning signs:**
- Two different pages appearing at the same URL during preview or local testing
- 404 errors for case studies that exist in your content source
- Products vanishing from shop after portfolio routes deployed
- Search Console showing duplicate content warnings or unexpected URL consolidation

**Phase to address:**
**Phase 1 (Portfolio Foundation):** Establish clear routing architecture BEFORE writing case study pages. Test matrix: every planned case study slug checked against existing product slugs to ensure no collision.

---

### Pitfall 2: Navigation Confusion—Visitors Unsure If They're Shopping or Evaluating a Professional

**What goes wrong:**
The site becomes schizophrenic: primary nav says "Home | Engineering | Case Studies | Resume | Contact" (professional language) but shop is still accessible via old cart icon, product links, or footer "Shop" link. A hiring manager clicks from a case study to another section, encounters an "Add to Cart" button, and loses confidence—the site doesn't know what it is.

Tokyo hiring managers especially will find this tone-jarring. Mixing professional portfolio language with e-commerce interface signals confusion about site purpose, which undermines credibility for a person pitching themselves as an engineer.

**Why it happens:**
Your codebase preserves shop routes for backward compatibility and existing traffic. Navigation wasn't originally designed to distinguish between "hiring context" (portfolio pages) and "shopping context" (shop pages). Shop nav elements (cart, product links) are globally visible, creating cognitive dissonance on portfolio pages.

**How to avoid:**
- **Strategy 1 (Recommended):** Conditional navigation per route—Show different nav depending on current route:
  - On portfolio routes (`/case-studies`, `/resume`, `/contact`, `/engineering`, `/`): Hide cart icon, show "Engineering | Case Studies | Resume | Contact | About"
  - On shop routes (`/shop/*`, `/cart`): Show "Shop | Cart" icon, minimal portfolio links (only in footer)
  - Implementation: Check route in layout or nav component; render conditionally

  ```typescript
  const isPortfolioRoute = pathname.startsWith('/case-studies') ||
                           pathname === '/' ||
                           pathname === '/resume';

  if (isPortfolioRoute) {
    return <PortfolioNav />;
  } else {
    return <ShopNav />;
  }
  ```

- **Strategy 2:** Visual zone demarcation—Keep unified nav but visually separate zones:
  - Portfolio pages: minimal, monochrome design
  - Shop pages: colorful zine-like aesthetic (current)
  - Breadcrumb or location indicator on every page ("You're in: Portfolio" vs. "You're in: Shop")
  - Result: visitor always knows the context

- **Strategy 3:** Soft redirect pattern—Homepage `/` directs to portfolio hero. Shop accessible at `/shop/` but not featured in primary nav. Use breadcrumbs on shop pages to clarify location. Portfolio is primary; shop is secondary.

**Warning signs:**
- Users clicking "Add to Cart" from a case study page (shop intent leaks)
- Mixed language in nav (professional + e-commerce jargon on same page)
- Bounce rate spiking on case study pages after encountering shop-like elements
- Recruiter feedback: "Wasn't sure what this site was selling me—a product or your expertise?"

**Phase to address:**
**Phase 1 (Navigation Restructure):** Before shipping portfolio, audit nav on every template. Create conditional nav logic. Portfolio pages should NOT display cart icon, product category links, or shop-specific language. Shop pages should NOT display resume download link or engineering-focused language.

---

### Pitfall 3: CSS/Tailwind Style Conflicts Between Portfolio and Shop

**What goes wrong:**
Shop uses Tailwind CSS with a `shop-*` CSS prefix convention. Portfolio adds new Tailwind utilities and custom styles. Conflicts occur where:
- Case study headings inherit `h2` styling from shop product cards (wrong size/color on portfolio)
- Utility class names collide (both trying to set `text-xs` with different meanings)
- Responsive breakpoints designed for e-commerce grids break case study text layout on mobile
- Inherited styles cascade unexpectedly (portfolio `body` reset affects shop)

**Why it happens:**
Tailwind CSS generates a single CSS bundle across the entire app. With two distinct design systems (playful zine-like for shop, minimal/professional for portfolio), managing specificity and inheritance becomes complex. The `shop-*` prefix convention doesn't extend uniformly to all shop styles, leaving gaps. Developers add portfolio utilities without checking for naming collisions.

**How to avoid:**
- **Strategy 1 (Best practice):** Use `important` directive for portfolio-specific utilities—In `tailwind.config.js`:
  ```javascript
  module.exports = {
    important: '!', // Add ! to all utilities
  };
  ```
  Then portfolio-specific classes get higher specificity:
  ```html
  <h2 className="!text-base !font-normal">Case Study Title</h2>
  ```
  Ensures portfolio styles override shop defaults on portfolio pages.

- **Strategy 2:** CSS Modules for portfolio—Portfolio components use `.module.css` (scoped styles), shop uses Tailwind utilities. Eliminates all collision by design.
  ```typescript
  // portfolio/case-study.module.css
  .heading {
    font-size: 1.5rem;
    font-weight: 600;
  }

  // usage
  <h2 className={styles.heading}>
  ```

- **Strategy 3:** Explicit class prefixing—Continue `shop-*` convention for shop, add `portfolio-*` prefix for all portfolio classes:
  ```html
  <!-- shop: -->
  <button className="shop-add-to-cart">Add to Cart</button>

  <!-- portfolio: -->
  <a className="portfolio-case-study-link">View Case Study</a>
  ```
  Requires discipline but prevents collision by naming convention.

- **Strategy 4:** Tailwind Merge utility—Use `clsx` or `tailwind-merge` to intelligently merge conflicting utilities:
  ```typescript
  import { clsx } from 'clsx';

  <h2 className={clsx(
    'text-lg font-bold',  // shop default
    isPortfolio && 'text-base font-normal'  // portfolio override
  )}>
  ```

**Warning signs:**
- Portfolio page headings have unexpected color/size from shop styles
- Portfolio buttons have rounded corners when they should be sharp (shop default leaked)
- Font sizes inconsistent between shop and portfolio on same breakpoint
- Tailwind merge conflicts visible in browser DevTools (conflicting utilities applied)

**Phase to address:**
**Phase 2 (Portfolio Styling):** Before shipping portfolio pages, choose and implement CSS conflict resolution strategy. Test portfolio on pages that might load both shop and portfolio styles. Run Lighthouse on portfolio pages to verify no style breakage.

---

### Pitfall 4: SEO Turbulence from Changing Site Primary Purpose (E-Commerce → Portfolio + Shop)

**What goes wrong:**
Search engines (Google, Bing) currently see centimentalcomics.com as an e-commerce shop for zines. When portfolio becomes primary content and shop is demoted, Google reprocesses the site's purpose. This can trigger:
- **Ranking drop** on existing product pages (shop traffic may drop 20-40% initially as authority redistributes)
- **Indexing confusion** (Google drops some shop URLs from index, reindexes inconsistently, takes weeks to stabilize)
- **Authority redistribution** (domain authority shifts from "zine shop" keywords to "Rails engineer" keywords; old backlinks become less relevant)
- **Category page impact** (shop category pages may drop harder than products)

This is especially risky because shop pages have existing inbound links and search visibility—losing them has immediate business impact.

**Why it happens:**
Search engines use content volume, link anchor text, and primary content type to understand a site's purpose. If portfolio content suddenly outnumbers shop content, ranking algorithms recalibrate over 4-8 weeks. Google's systems see the site's topical relevance shift and downrank content that doesn't fit the new purpose.

**How to avoid:**
- **Strategy 1 (Recommended):** Phased rollout with monitoring—Ship portfolio to full domain but use `robots.txt` to control crawl budget:
  ```
  User-agent: *
  Disallow: /shop/  # Temporarily hide shop from crawl
  Allow: /         # Index portfolio
  ```
  Monitor shop rankings for 2-3 weeks in Google Search Console (they'll still appear if previously indexed). After portfolio stabilizes, remove the Disallow and re-open shop to crawl. Or use phased redirect strategy (see Strategy 2).

- **Strategy 2:** Staged domain split (if resources allow)—Ship portfolio to portfolio subdomain (`portfolio.centimentalcomics.com`), keep shop at main domain. After portfolio gains traction and authority, gradually shift. Avoids all turbulence but more work.

- **Strategy 3:** Explicit SEO signals—Use structured data and metadata to signal site type:
  ```html
  <!-- portfolio page -->
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    "name": "Rails Engineer Portfolio"
  }
  </script>

  <!-- shop page -->
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": "Zine Title"
  }
  </script>
  ```
  Helps search systems understand that site has two distinct sections with different purposes.

- **Strategy 4:** Monitor and redirect—In `next.config.js`, don't remove shop URLs, but use `canonical` tags on shop pages:
  ```typescript
  // On shop product pages:
  <head>
    <link rel="canonical" href="https://centimentalcomics.com/shop/[product]" />
  </head>
  ```
  Signals to Google: "This page belongs here, it's not duplicate." Prevents consolidation with portfolio content.

- **Strategy 5:** Monitor search console for 90+ days—After launch, track:
  - Shop keyword rankings (set baseline now)
  - Shop page CTR in GSC
  - Shop pages dropped from index (monitor "Excluded" URLs)
  - Portfolio keyword rankings (should improve)
  - Set alert: if shop CTR drops >25%, investigate

**Warning signs:**
- Google Search Console shows shop "Excluded" URLs (not indexed)
- Shop keyword rankings dropping in GSC 2-4 weeks post-launch
- Shop page CTR in Google drops >25%
- Homepage CTR in Google drops post-launch
- Bing/other search engines show old shop rankings while Google has recomputed

**Phase to address:**
**Phase 1 (Portfolio Foundation):** BEFORE launch, create detailed SEO migration plan. Document baseline shop rankings using Google Search Console. Plan phased rollout strategy. Phase 3 (Pre-Launch): Execute robots.txt strategy or canonical tag placement. Phase 4 (Post-Launch): Monitor GSC for 90 days, adjust if needed.

---

### Pitfall 5: Tokyo Market Tone Misalignment—Emotional Language, Vague Outcomes

**What goes wrong:**
Portfolio case studies are written with enthusiasm ("I love building meaningful software," "exciting technical journey") or vague outcomes ("improved performance," "better architecture"). Japanese hiring managers (especially CTOs at conservative SaaS firms) see this as unprofessional, immature, or lacking rigor. Precision and measurable outcomes are expected; emotional language signals inexperience.

Result: Hiring manager reads case study, loses confidence in your technical credibility.

**Why it happens:**
Web portfolio conventions in English-speaking markets emphasize narrative, personality, and storytelling. Japanese tech hiring culture values evidence-based assessment—credentials, specific metrics, and formal tone. These cultures have different communication norms; what reads as engaging in US portfolios reads as unprofessional in Tokyo.

**How to avoid:**
- **Strategy 1 (Recommended):** Template-driven case study structure—Require every case study to follow:
  ```markdown
  # [Project Name]: [One-sentence outcome with metric]

  ## Context
  - Team size: [X] people
  - Timeline: [start] to [end]
  - Business problem: [specific problem, not vague]
  - Business impact: [revenue, user growth, cost]

  ## Technical Challenge
  - What constraint existed? (be specific)
  - Why was it hard?
  - What's at stake if unsolved?

  ## Approach
  - What technical decisions were made?
  - Why those decisions? (mention tradeoffs—can't optimize everything)
  - Key technologies: [list with purpose]

  ## Results
  - Measurable outcome (latency reduced by X%, throughput increased by Y%, cost decreased Z%)
  - Timeline: [how quickly did impact appear?]

  ## Reflection
  - What worked well?
  - What didn't work? (be honest—shows maturity)
  - If rebuilding, what would you change?
  ```

  **Tone rules for Tokyo market:**
  - Remove: "love," "exciting," "passion," "amazing," "cutting-edge"
  - Add: "reduced," "improved by X%," "maintained," "validated," "tested"
  - Example: ❌ "Built a robust Rails API" → ✅ "Rebuilt legacy API serving 50k DAU; reduced p99 latency from 2400ms to 340ms, enabling 40% faster feature iteration"

- **Strategy 2:** Specificity checklist—Before publishing, every case study must have:
  - [ ] At least one specific metric (numbers, not adjectives)
  - [ ] Business context explained (why this project mattered)
  - [ ] At least one technical decision with tradeoff discussed
  - [ ] At least one reflection on what didn't work or could improve
  - [ ] Zero emotional language
  - [ ] Zero vague claims ("improved," "better," "great")

- **Strategy 3:** Japanese intro section (optional but impactful)—Add short Japanese-language intro ("エンジニアリングの品質と信頼性に焦点を当てたレールスエンジニア") demonstrates respect for local hiring culture. Doesn't need to be fluent, just respectful.

- **Strategy 4:** Have Tokyo tech person review—Before shipping any case study, have someone from Japan's tech community review for tone. They'll catch cultural misalignments that Western authors miss.

**Warning signs:**
- Recruiter feedback: "This sounds like marketing, not engineering"
- Case studies read like sales copy ("our amazing team built the best solution")
- Missing business context (technical decisions explained without why it mattered)
- Vague metrics ("significantly improved," "much faster")
- Zero mention of what didn't work or learnings

**Phase to address:**
**Phase 2 (Case Study Writing):** BEFORE writing any case studies, establish tone guidelines and template. Review first 2-3 case studies with someone from Tokyo tech community if possible. Make tone part of code review/acceptance criteria.

---

### Pitfall 6: Contact Form Spam Targeting a Small Professional Portfolio Site

**What goes wrong:**
Adding a professional contact form for recruiting inquiries attracts automated spam bots. Without proper defenses, inbox is flooded with:
- Recruitment spam ("Hire React developers")
- Scraped email list sellers ("Let's get you 10k leads")
- Link-building spam ("Add our link to your resources")
- Automated quote/service requests

This pollutes the contact channel and makes it harder to notice real hiring inquiries.

**Why it happens:**
Contact pages are high-value scraping targets. Bots specifically target portfolio sites because they assume owners are freelancers or small businesses likely to respond to vendor pitches. As of 2026, simple CAPTCHAs are insufficient—bots use headless browsers and AI behavioral analysis to bypass them.

**How to avoid:**
- **Strategy 1 (Recommended):** Server-side validation + Akismet:
  - Validate email format strictly (reject `+spam` variations)
  - Use Akismet API (free tier available) to score submissions
  - Rate-limit per IP: max 5 submissions per day
  - Log all submissions with timestamp, IP, referer for pattern detection

  ```typescript
  // Example in Server Action
  const isSpam = await akismet.verify(formData);
  if (isSpam) return { error: 'Form submission flagged as spam' };

  const recentCount = await db.contacts.count({
    where: { ip: clientIp, createdAt: { gte: oneDayAgo } }
  });
  if (recentCount >= 5) return { error: 'Too many submissions, try later' };
  ```

- **Strategy 2:** Honeypot field—Add a hidden field that legitimate users won't fill:
  ```html
  <input type="text" name="website" style="display:none" />
  ```
  Bots fill all fields; users skip the hidden one. Reject if populated.

- **Strategy 3:** Email verification flow—Send verification link; only process if user clicks it:
  1. User submits contact form
  2. Email sent with verification link
  3. Only after click is form marked "verified"
  4. Real recruiters click; spam bots don't

  Result: inbox only shows verified inquiries.

- **Strategy 4:** No email display on contact page—Don't auto-display your email on `/contact`. Require form submission only. Reduces harvesting value.

**Warning signs:**
- Inbox receives >50% spam submissions within first month of launch
- Spam patterns (same sender, similar content) visible in logs
- Real recruiter inquiries buried or missed
- Contact form conversion rate low despite traffic

**Phase to address:**
**Phase 3 (Contact & Lead Management):** Before shipping contact form, implement Akismet or equivalent spam filter. Add rate-limiting and honeypot. Monitor first 30 days; adjust thresholds if spam volume increases.

---

### Pitfall 7: Case Study Content Too Vague or Overly Promotional

**What goes wrong:**
Case studies fail to convince hiring managers because:
- **Vague claims:** "Improved system reliability" with no metrics
- **No business context:** Technical decisions explained without business impact ("Used Docker" with no explanation of why or impact)
- **Overly promotional tone:** Reads like sales copy ("Our amazing team built the best solution") instead of engineering documentation
- **Missing learnings:** What went wrong? What would you do differently? Absence of reflection signals lack of maturity

Result: Hiring manager closes case study thinking "sounds nice, but I don't know if this person can actually ship code or learn from mistakes."

**Why it happens:**
Portfolio authors conflate "marketing case study" with "engineering retrospective." Marketing emphasizes benefits and emotion. Engineering requires context, tradeoffs, measurable impact, and honest reflection.

**How to avoid:**
- **Strategy 1 (Recommended):** Enforce template structure (from Pitfall 5, but emphasized here):
  - Context: business problem, team size, timeline
  - Technical challenge: specific constraint, why hard
  - Approach: decisions made, tradeoffs
  - Results: measurable outcome with numbers
  - Reflection: what worked, what didn't, what you'd change

- **Strategy 2:** Specificity checklist—Before publishing:
  - [ ] Business problem stated clearly (not vague like "improve reliability")
  - [ ] At least one specific metric in results (latency reduced 340ms, throughput +30%, cost -$50k/yr)
  - [ ] At least one tradeoff discussed (can't optimize everything; what did you choose?)
  - [ ] At least one thing that didn't work (shows maturity)
  - [ ] Code sample or diagram if possible (proof you understand the tech)

- **Strategy 3:** Avoid marketing language—Checklist to remove:
  - ❌ "amazing," "best," "cutting-edge," "revolutionary," "world-class"
  - ✓ "reduced," "improved by X%," "maintained," "validated," "tested"

- **Strategy 4:** Third-party validation if possible—If client allows, include:
  - Quote from manager or colleague
  - Measurable business impact (revenue, user growth, cost savings)
  - Timeline (how quickly did impact appear?)

**Warning signs:**
- Case study reads like marketing copy (superlatives, no metrics)
- Reader still unsure what problem was solved after reading
- No mention of tradeoffs or what didn't work
- Tokyo tech recruiter feedback: "Sounds like everyone's case study"

**Phase to address:**
**Phase 2 (Case Study Writing):** Before writing any case studies, finalize template. Have first 2-3 case studies reviewed by someone with Rails/backend experience. Make specificity part of acceptance criteria.

---

### Pitfall 8: Mobile Responsiveness Mismatch Between Portfolio and Shop

**What goes wrong:**
Portfolio and shop optimize for different mobile experiences:
- **Shop:** Prioritizes product discovery (cards, grids, filters, add-to-cart buttons)
- **Portfolio:** Prioritizes case study readability (article layout, code blocks, long-form text)

Using the same responsive design strategy causes:
- Case study code samples unreadable on mobile (text too small, horizontal scroll)
- Case study images appear too small on small screens
- Navigation cramped (portfolio nav + shop nav conflict on mobile)
- Touch targets inconsistent (buttons in shop are larger than resume links in portfolio)
- Font hierarchy unclear on mobile

Result: Portfolio appears unprofessional on mobile (undermining the "precise engineer" brand). Shop may become harder to use.

**Why it happens:**
Tailwind's default breakpoints (sm: 640px, md: 768px, lg: 1024px) work for generic layouts. Portfolio case studies with code, diagrams, and long-form text may need different breakpoints or different strategies entirely. Developers copy shop's responsive approach without considering content type differences.

**How to avoid:**
- **Strategy 1 (Recommended):** Content-specific breakpoints for portfolio—Use shop breakpoints for shop. Define portfolio-specific media queries:
  ```css
  /* portfolio/case-study.css */
  @media (max-width: 768px) {
    .case-study-code {
      font-size: 0.875rem;  /* slightly larger for readability */
      overflow-x: auto;
      padding: 1rem;
      line-height: 1.6;
    }

    .case-study-image {
      max-width: 100%;
      height: auto;
    }
  }
  ```

- **Strategy 2:** Test matrix by device—Before shipping, test on:
  - iPhone 12 (390px): Portfolio nav legible? Code readable? CTAs tappable (44px min)?
  - iPad (768px): Case study layout intact? Images clear?
  - Desktop (1024px+): Full width used well?
  - Compare against shop pages on same devices—ensure no regression

- **Strategy 3:** Collapsible code blocks on mobile—If code sample is long (>20 lines), collapse on mobile:
  ```tsx
  <details>
    <summary>View Code (12 lines)</summary>
    <pre><code>...</code></pre>
  </details>
  ```

- **Strategy 4:** Different component order for mobile—Portfolio pages might reorder sections on mobile:
  - Desktop: Overview → Code → Results
  - Mobile: Results → Overview → Collapsible Code

**Warning signs:**
- Case study code requires horizontal scrolling on iPhone
- Portfolio nav collapses into hamburger menu AND shop nav is visible (confusing)
- Font size in code samples smaller than body text (hard to read)
- Touch targets (resume button, contact link) smaller than 44px (hard to tap)
- Lighthouse mobile score <80 on portfolio pages

**Phase to address:**
**Phase 2 (Portfolio Styling) and Phase 3 (Case Studies):** When styling portfolio pages, test on actual mobile devices (not just browser DevTools). Create mobile testing checklist. Ensure case study code blocks are readable without horizontal scroll.

---

### Pitfall 9: Client Consent Not Obtained for Case Study Disclosure

**What goes wrong:**
Case studies mention client names, business metrics, or architectural decisions without explicit written consent. Clients (especially startups or stealth companies) may object post-publication:
- Startup doesn't want architecture public (competitive risk)
- Client doesn't want revenue figures disclosed
- Client objects to being associated with publicized tech stack
- Former employer claims confidentiality breach

Result: Forced case study removal, credibility loss, potential legal friction or cease-and-desist.

**Why it happens:**
Portfolio authors assume public information (company website, tech blog, press release) means case study disclosure is allowed. They don't obtain explicit written client consent for detailed technical writing. Small risk feels acceptable until client objects.

**How to avoid:**
- **Strategy 1 (Recommended):** Consent template—Before writing each case study, email client:
  ```
  Hi [Client],

  I'd like to feature [Project] as a case study on my portfolio to showcase
  the technical work we did together. May I:

  - Mention your company name publicly?
  - Describe the technical architecture?
  - Share performance metrics or results?

  Which details are OK to share? Which should stay confidential?

  Thanks,
  [Your name]
  ```
  Get written approval (email reply acceptable). Document in project.

- **Strategy 2:** Anonymize when needed—If client declines full disclosure, write case study with anonymized company name:
  - ❌ "Rebuilt TechCo's Rails API"
  - ✓ "Rebuilt legacy API for Series A SaaS platform serving 50k users"

  Disclose technical challenge without naming client.

- **Strategy 3:** Check employment contracts—Review past employer agreements and NDAs:
  - Some contracts prohibit disclosing client names or technical details without consent
  - Some allow publicly available information only
  - Document findings per client

- **Strategy 4:** Document consent—In project docs, create a case study consent checklist:
  ```markdown
  Case Study: [Project Name]
  Client: [Company]
  Consent obtained: [Date/Email]
  Approved disclosures: [Company name, architecture, metrics, stack]
  Off-limits: [Anything client marked confidential]
  ```

**Warning signs:**
- Former client contacts you requesting case study removal
- Legal inquiry from client
- Client publicly criticizes case study for oversharing

**Phase to address:**
**Phase 2 (Case Study Writing):** Before publishing any case study mentioning a real client, obtain and document written consent. Make consent a gate for publication—no case study ships without it.

---

## Technical Debt Patterns

| Shortcut | Immediate Benefit | Long-term Cost | When Acceptable |
|----------|-------------------|----------------|-----------------|
| Single `[slug]` route for products + case studies | Fast to implement, one route handler | Route conflicts, hard to debug, SEO mixed signals | Never—spend 30 min on route restructure, prevents hours of debugging |
| No contact form spam protection | Fewer dependencies, simpler code | Inbox polluted, real inquiries missed | Never—Akismet free tier trivial to add |
| Portfolio responsive design copies shop without testing | Faster launch | Portfolio broken on mobile, credibility damaged | Never—mobile testing 1-2 hours, returns professional appearance |
| Case studies published without client consent | Faster to ship | Legal friction, client relations damaged, forced removal | Never—send email, document consent, costs 5 minutes |
| Keeping both shop nav and portfolio nav visible on all pages | Simpler code, no conditional rendering | Navigation confusion, site purpose unclear | Only during transition period (max 1 sprint) |
| Not updating `robots.txt` or `canonical` tags before launch | Simpler deployment | SEO confusion, shop traffic at risk | Never—add canonical/robots immediately before portfolio launch |
| Case studies written with marketing language instead of engineering tone | Faster to write | Tokyo recruiters lose confidence, applications drop | Never—follow template, have Tokyo tech person review first 2-3 |

---

## Integration Gotchas

| Integration | Common Mistake | Correct Approach |
|-------------|----------------|------------------|
| **Zustand cart + portfolio pages** | Cart persists and displays on portfolio pages; "Add to Cart" shows in portfolio nav | Scope cart initialization to shop routes only. Use conditional: `if (isShopRoute) { initCart() }`. Hide cart UI on portfolio pages. |
| **DatoCMS (shop data) + hardcoded case studies** | Portfolio accidentally calls DatoCMS queries, increasing latency; case study data fetches graphql | Separate data sources by design. Case studies: local JSON files or hardcoded data. Never call DatoCMS API from portfolio pages. Different fetch patterns = different optimization. |
| **Supabase orders + portfolio contact form** | Contact form accidentally writes to `orders` table; contact info and order data mixed | Create separate `contacts` table in Supabase with different schema. Establish naming: `orders` for shop, `contacts` for portfolio. Document in schema comments. |
| **Resend email templates** | Contact form sends order-confirmation email template; recruiting inquiry gets zine receipt | Create distinct email templates: `contact-inquiry-template` vs. `order-confirmation-template`. Use environment variable to select template: `CONTACT_EMAIL_TEMPLATE` vs. `ORDER_EMAIL_TEMPLATE`. |
| **Next.js Server Actions overlap** | Shop checkout and contact form both use `/api/form`, conflicts | Separate Server Actions by feature: `submitCheckout` for shop, `submitContact` for portfolio. Different functions, different error handling. |
| **Tailwind config shared between shop + portfolio** | Both systems try to override `tailwind.config.js` (colors, spacing, fonts); last edit wins | Lock `tailwind.config.js` to core defaults. Portfolio overrides use CSS Modules or `important` flag, not config changes. Prevents config conflicts. |
| **Font loading across zones** | Shop has Inter font scoped; portfolio needs different font; both load on same page, bloat | Load portfolio font conditionally: only on portfolio routes. Check current implementation—Inter already scoped to shop. Keep it. Use system fonts for portfolio, or load different font on portfolio routes only. |

---

## Performance Traps

| Trap | Symptoms | Prevention | When It Breaks |
|------|----------|------------|----------------|
| **Oversized case study images** | Portfolio pages slow on mobile, Lighthouse score <80 | Optimize images: convert to `.webp`, lazy load with `loading="lazy"`, provide responsive sizes (`srcset`). Test on 4G connection. | At >100KB image per case study on mobile; 4G load >5s |
| **Portfolio nav route calculation on every page load** | Mobile nav flicker, route check runs on all 100+ shop pages | Memoize nav state. Use CSS `display: none` for conditional visibility, not JavaScript. Avoid `usePathname()` on every render. | At 10K+ shop page loads; users notice flicker on older phones |
| **DatoCMS revalidation triggers full cache refresh** | Portfolio update causes shop cache thrash; shop revalidates unnecessarily | Use `tags` in revalidation: tag shop with `"shop"`, portfolio with `"portfolio"`. Revalidate selectively with `revalidateTag("portfolio")`. | At 100+ concurrent shop visitors post-portfolio-update; latency spike |
| **Unoptimized code block syntax highlighting** | Client-side highlighting runs on every case study, browser hangs on mobile | Pre-render syntax highlighting at build time using Prism or Shiki. Use `<pre><code>` with pre-rendered CSS classes, not runtime highlighters. | At 5+ code blocks per case study on mobile; <50ms first paint |
| **Portfolio case study images not lazy loaded** | LCP (Largest Contentful Paint) high; portfolio page feels slow | Add `loading="lazy"` to all case study images. Prioritize hero image (LCP): use `loading="eager"`. Test with Lighthouse. | At 5+ images per case study; LCP >2.5s |

---

## Security Mistakes

| Mistake | Risk | Prevention |
|---------|------|-----------|
| **Contact form accepts raw input, no sanitization** | XSS injection via contact form; malicious script sent in email | Sanitize all inputs server-side: remove HTML tags, validate format. Use `sanitize-html` npm package or equivalent. Log all inputs. |
| **Email address harvested from `/contact` page** | Email added to spam lists, inbox polluted with unwanted mail | Don't display raw email on `/contact` page. Use contact form as only channel. If email must display, obfuscate with image or encoded format. |
| **Case study reveals sensitive infrastructure details** | Competitor gains deployment insights; security misconfiguration exposed | Scrub case studies for: database names, server IPs, API endpoints, internal tool names, employee names. Peer review before publish. |
| **Resume page discloses too much personal info** | Identity theft risk, stalking, phishing | Resume should list: skills, experience, employment dates. Exclude: home address, phone number, birth date, visa status, family info. Keep minimal. |
| **Portfolio subdomain/route exposes shop data** | Shop data (orders, customer emails) accessible via portfolio API calls | Test CORS and authorization headers. Ensure portfolio routes cannot call shop APIs. Use separate API keys if possible. Test with curl to verify isolation. |

---

## UX Pitfalls

| Pitfall | User Impact | Better Approach |
|---------|-------------|-----------------|
| **Case study has no CTA or unclear next step** | Recruiter reads case study, wants to contact, but unsure how | End every case study with: "Interested in working together? Use the contact form or email [email@domain]." Make path obvious. |
| **Portfolio pages have no breadcrumb or context** | Reader jumps case study → resume → engineering, loses location sense | Add breadcrumb: "Home > Case Studies > [Case Study Name]." Helps navigation and SEO. Use consistent breadcrumb style. |
| **Resume page is overwhelming text wall** | Recruiter skims resume, misses key skills due to poor formatting | Structure with clear sections (Skills, Experience, Education). Use typography hierarchy (sizes, weights). Consider 1-2 sentence summary at top. |
| **Back button from case study goes to browser history, not case studies list** | Reader clicks back, returns to previous site (maybe shop), loses context | Use Next.js `<Link>` with explicit path: `<Link href="/case-studies">Back to Cases</Link>`. Avoid browser back button for navigation. |
| **Portfolio and shop share same visual language** | Recruiter doesn't realize they left portfolio and are now seeing e-commerce | Use distinct visual language: portfolio is minimal/monochrome, shop is colorful zine-like. Make zone transition visually obvious. |
| **Nav confuses users with mixed portfolio + shop links** | Mobile user clicks through nav, encounters mix of "Resume" and "Products" | Separate nav entirely. If portfolio route, show portfolio nav only. If shop route, show shop nav. Test on mobile—no mixing. |

---

## "Looks Done But Isn't" Checklist

- [ ] **Route conflicts tested:** Created test matrix with 20+ sample case study slugs and 20+ product slugs. Verified no collisions. Both route types tested and accessible.
- [ ] **Navigation tested on all pages:** Verified portfolio pages don't show cart icon, shop pages don't show resume link. Tested on 5+ pages of each type. Conditional nav logic confirmed working.
- [ ] **CSS conflicts resolved:** Ran Tailwind utilities through checker. Verified no class name collision. Tested portfolio pages load without shop CSS affecting them. Tested shop pages load without portfolio CSS affecting them.
- [ ] **SEO signals clear:** Added `canonical` tags to shop pages (point to themselves). Updated `robots.txt`. Set monitoring for shop rankings. Baseline documented before launch.
- [ ] **Case study tone reviewed:** All case studies reviewed for: (1) measurable metrics present, (2) zero emotional language, (3) business context clear, (4) reflection on what didn't work included. Obtained client consent documented.
- [ ] **Contact form protected:** Akismet integrated, honeypot field functional, rate-limiting at 5/day/IP. Tested with spam probe. Verified rate-limiting blocks repeated submissions.
- [ ] **Mobile tested thoroughly:** Portfolio pages tested on iPhone 12 (390px) and iPad (768px). Code blocks readable without horizontal scroll. Images clear. Nav functional. Lighthouse score ≥80.
- [ ] **Client consent documented:** For each case study mentioning real clients, documented consent in project (email approval acceptable). Checklist showing which details approved for each case study.
- [ ] **Data sources separated:** Verified portfolio never calls DatoCMS queries. Cart Zustand state doesn't initialize on portfolio routes. Contact form uses separate Supabase table. Different fetch patterns confirmed.
- [ ] **Monitoring plan established:** Google Search Console shop rankings baselined. Alert configured for >25% CTR drop on shop keywords. Post-launch monitoring plan documented. First 90 days tracked.

---

## Recovery Strategies

| Pitfall | Recovery Cost | Recovery Steps |
|---------|---------------|----------------|
| **Route collision discovered post-launch** | HIGH | (1) Roll back portfolio pages. (2) Rename case study routes (e.g., `/case-studies/[slug]` instead of `[slug]`). (3) Verify collisions resolved via test matrix. (4) Relaunch. ~4 hours. |
| **Case studies appear unprofessional to Tokyo recruiters** | MEDIUM | (1) Audit case study tone against template. (2) Rewrite vague sections with metrics. (3) Remove emotional language. (4) Have Tokyo tech person review. (5) Re-publish. ~2-3 hours per case study. |
| **SEO rankings dropped >25% on shop** | HIGH | (1) Analyze GSC for affected keywords. (2) Check for redirect/noindex errors. (3) Verify canonical tags are correct. (4) Refresh sitemaps. (5) Request re-crawl in GSC. (6) Monitor for 4-6 weeks for recovery. Could take weeks. |
| **Contact form flooded with spam** | LOW | (1) Enable/increase Akismet spam threshold if not already. (2) Add rate-limiting if missing. (3) Clear spam submissions from inbox. (4) Review logs for patterns. ~1 hour. |
| **CSS conflicts broke portfolio visual appearance** | LOW | (1) Identify conflicting utility in DevTools. (2) Add `important` flag or CSS Module override. (3) Test on multiple pages. (4) Verify Lighthouse score >80. ~30 minutes. |
| **Navigation confusion reported by users** | MEDIUM | (1) Add visual distinction: portfolio minimal/monochrome, shop colorful. (2) Hide cart on portfolio pages. (3) Add breadcrumbs or location indicator. (4) Test with stakeholder for clarity. ~2-3 hours. |

---

## Pitfall-to-Phase Mapping

| Pitfall | Prevention Phase | Verification |
|---------|------------------|--------------|
| Route/slug conflicts | Phase 1 (Portfolio Foundation) | Test matrix: 20+ case study + product slugs, confirm no collisions. Search console shows correct pages indexed, no consolidation. |
| Navigation confusion | Phase 1 (Navigation Restructure) | Recruiter walkthrough: "Is it clear this is a professional site, not a shop?" Confirm yes. Every portfolio page: no cart icon. Every shop page: no resume link. |
| CSS style conflicts | Phase 2 (Portfolio Styling) | Lighthouse score on portfolio pages ≥90. No visual regression on shop. DevTools shows no conflicting utilities. Manual visual test on 5+ pages each type. |
| SEO ranking turbulence | Phase 1 (Portfolio Foundation) | Google Search Console shop rankings stable ±5 positions for 90 days post-launch. No "Excluded" shop URLs from index. Shop CTR stable (not >25% drop). |
| Tokyo tone misalignment | Phase 2 (Case Study Writing) | All case studies: (1) metrics present, (2) zero emotional language, (3) technical depth sufficient for Rails tech lead. Tokyo tech community feedback positive on first 3 case studies. |
| Contact spam | Phase 3 (Contact & Lead Management) | Akismet enabled, honeypot field functional, rate-limiting 5/day/IP. Test spam submission rejected. Monitor: <10% spam rate after 30 days. |
| Case study vagueness | Phase 2 (Case Study Writing) | Template compliance: all case studies have [Context], [Challenge], [Approach], [Results], [Reflection]. Zero "improved/better/significant" claims without numbers. |
| Mobile responsiveness mismatch | Phase 2 (Portfolio Styling) + Phase 3 (Case Studies) | Portfolio tested iPhone 12 (390px), iPad (768px). Code readable, images clear, nav functional. No horizontal scroll. Lighthouse mobile ≥80. |
| Client consent not obtained | Phase 2 (Case Study Writing) | Signed consent (email acceptable) for each case study mentioning real client. Checklist: which details approved, which off-limits. Zero case studies shipped without documented consent. |

---

## Sources

- [Next.js Dynamic Routes Documentation](https://nextjs.org/docs/app/api-reference/file-conventions/dynamic-routes)
- [Next.js Route Groups & Organization](https://nextjs.org/docs/app/building-your-application/routing/route-groups)
- [Catch-all Routes and Routing Conflicts in Next.js App Router](https://github.com/vercel/next.js/discussions/80747)
- [SEO Site Migration Checklist 2026](https://www.shopify.com/enterprise/blog/replatforming-seo-strategies)
- [The Silent SEO Killer: Rebrand Migration Guide](https://sitebulb.com/resources/guides/the-silent-seo-killer-rebrand-migration/)
- [7 Steps to Rebrand Without Losing SEO Value](https://www.bluefrogdm.com/blog/rebrand-maintain-seo-value)
- [Tailwind CSS Responsive Design Guide](https://tailwindcss.com/docs/responsive-design)
- [Mastering Tailwind CSS: Overcome Styling Conflicts](https://dev.to/sheraz4194/mastering-tailwind-css-overcome-styling-conflicts-with-tailwind-merge-and-clsx-1dol)
- [How to Stop Contact Form Spam in 2026](https://webdezign.co.uk/how-to-stop-contact-form-spam-in-2026-7-proven-methods/)
- [Contact Form Spam Prevention: 7-Step Guide](https://orbitforms.ai/blog/contact-form-spam-prevention/)
- [How to Write a Winning B2B Tech Case Study in 2026](https://www.a88lab.com/blog/how-to-write-a-winning-b2b-saas-case-study)
- [Case Study Mistakes: How to Avoid Common Pitfalls](https://loyaltysurf.io/blog/customer-case-study-mistakes)
- [Japanese Business Culture: Complete Guide](https://culturalatlas.sbs.com.au/japanese-culture/japanese-culture-business-culture)
- [Japanese Business Etiquette and Formality](https://shinkamanagement.com/japanese-business-etiquette-guide/)
- [Japan's Tech Job Market 2025-2026](https://blog.lewagon.com/career/japan-tech-job-market-2025-2026/)
- [How to Recruit Top IT Engineers in Japan](https://www.isfnet.com/how-to-recruit-engineer-in-jp.html)

---

*Pitfalls research for: Adding portfolio to existing Next.js 15 e-commerce site (Rails-focused, Tokyo market)*
*Researched: 2026-03-04*
