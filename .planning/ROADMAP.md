# Centimentalcomics Roadmap

**Project:** Centimentalcomics Rails Portfolio (Tokyo Market)
**Created:** 2026-02-20

---

## Milestones

- ✅ **v1.0 MVP** — Phases 1-3 (shipped 2026-03-04)
- 🚧 **v2.0 Portfolio** — Phases 4-6 (in progress)

## Phases

<details>
<summary>✅ v1.0 MVP (Phases 1-3) — SHIPPED 2026-03-04</summary>

- [x] Phase 1: Product Catalog & Foundation (5/5 plans) — completed 2026-02-26
- [x] Phase 2: Shopping Cart (3/3 plans) — completed 2026-03-01
- [x] Phase 3: Checkout & Order Form (2/2 plans) — completed 2026-03-03

Full details: [milestones/v1.0-ROADMAP.md](./milestones/v1.0-ROADMAP.md)

</details>

### 🚧 v2.0 Portfolio (In Progress)

**Milestone Goal:** Transform centimentalcomics.com into a Rails-focused portfolio with case studies, engineering page, resume, and contact — optimized for Tokyo hiring culture.

#### Phases

- [x] **Phase 4: Portfolio Foundation** - Route groups, navigation architecture, SEO baseline — the structural prerequisite for all portfolio content
- [ ] **Phase 5: Core Portfolio Pages** - Homepage, engineering stack, and resume pages fully built with professional tone and content
- [ ] **Phase 6: Case Studies + Contact** - Case study pages with written content and contact form backed by Resend

#### Phase Details

### Phase 4: Portfolio Foundation
**Goal**: The site has a clean architectural separation between portfolio and shop, with portfolio navigation rendered on all portfolio routes and no route collisions
**Depends on**: Nothing (first phase of v2.0)
**Requirements**: SITE-01, SITE-02, SITE-03, SITE-04, SITE-05
**Success Criteria** (what must be TRUE):
  1. Visiting any portfolio page (/, /engineering, /case-studies, /resume, /contact) shows the portfolio navigation with links to Home, Engineering, Case Studies, Resume, Contact — no shop navigation visible
  2. Visiting any shop page (/shop, /shop/*) shows the existing shop navigation — no portfolio navigation visible
  3. Shop link appears only in the portfolio footer, not in the primary navigation
  4. Each portfolio page renders correct SEO title, description, and Open Graph tags in page source
  5. All text across portfolio pages uses professional tone: outcomes stated as measurable facts, no emotional language
**Plans**: 04-01 (route architecture), 04-02 (portfolio layout + pages), 04-03 (verification checkpoint)

### Phase 5: Core Portfolio Pages
**Goal**: Hiring managers landing on the site can assess Rails engineering competence in under 30 seconds from the homepage and drill into engineering stack and resume for depth
**Depends on**: Phase 4
**Requirements**: HOME-01, HOME-02, HOME-03, HOME-04, ENG-01, ENG-02, RESM-01, RESM-02
**Route ownership decision (2026-03-09):** `/` is the canonical portfolio homepage. Legacy comics homepage content moved to `/legacy-comics`.
**Success Criteria** (what must be TRUE):
  1. Homepage hero immediately communicates Rails engineer positioning with two visible CTAs (View Case Studies, View Resume)
  2. Homepage shows a core strengths section covering Rails, system design, performance, deployment, and maintenance — each as a concise, outcome-oriented statement
  3. Homepage shows 2-3 case study cards with title, brief description, and link to full case study
  4. Engineering page lists the full tech stack organized by category (backend, frontend, infrastructure, tools) and includes a testing and code quality section
  5. Resume page at /resume renders experience, skills, and career progression in a clean single-page layout that emphasizes career stability and production systems
**Plans**: 05-01 (homepage route ownership + scaffold), 05-02 (homepage content completion), 05-03 (engineering page completion), 05-04 (resume completion), 05-05 (verification checkpoint)

### Phase 6: Case Studies + Contact
**Goal**: Visitors can read 2-3 production case studies that demonstrate Rails depth with specific technical outcomes, and send a contact message that reaches the site owner
**Depends on**: Phase 5
**Requirements**: CASE-01, CASE-02, CASE-03, CTCT-01, CTCT-02
**Success Criteria** (what must be TRUE):
  1. Case studies index page lists all available case studies with title and brief description
  2. Each individual case study page presents structured sections: context, technical challenges, and reflection — with at least one specific measurable outcome per case
  3. 2-3 production case studies are written and published, each with a real project context, concrete technical decisions, and honest reflection (no vague promotional claims)
  4. Contact form submits successfully with name, email, and message — visitor sees a confirmation on success
  5. Submitted contact form triggers an email notification delivered to the site owner via Resend
**Plans**: TBD

---

## Progress

| Phase | Milestone | Plans Complete | Status | Completed |
|-------|-----------|----------------|--------|-----------|
| 1. Product Catalog & Foundation | v1.0 | 5/5 | Complete | 2026-02-26 |
| 2. Shopping Cart | v1.0 | 3/3 | Complete | 2026-03-01 |
| 3. Checkout & Order Form | v1.0 | 2/2 | Complete | 2026-03-03 |
| 4. Portfolio Foundation | v2.0 | 3/3 | Complete | 2026-03-05 |
| 5. Core Portfolio Pages | v2.0 | 4/5 | In Progress | - |
| 6. Case Studies + Contact | v2.0 | 0/? | Not started | - |

---

_Last updated: 2026-03-09 — Phase 5 execution in progress (4/5 plans complete)_
