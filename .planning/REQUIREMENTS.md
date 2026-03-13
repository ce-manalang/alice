# Requirements: Centimentalcomics Portfolio

**Defined:** 2026-03-04
**Core Value:** Visitors can quickly assess Rails engineering competence through clear case studies, structured resume, and technical documentation

## v2.0 Requirements

Requirements for portfolio milestone. Each maps to roadmap phases.

### Homepage

- [x] **HOME-01**: Visitor sees professional hero with Rails engineer positioning and CTAs (View Case Studies, View Resume)
- [x] **HOME-02**: Visitor sees core strengths section (Rails, system design, performance, deployment, maintenance)
- [x] **HOME-03**: Visitor sees 2-3 featured case study cards with links to full case studies
- [x] **HOME-04**: Visitor sees condensed professional timeline showing career progression

### Engineering

- [x] **ENG-01**: Visitor can view engineering page with full stack listing organized by category (backend, frontend, infra, tools)
- [x] **ENG-02**: Engineering page emphasizes testing and code quality practices

### Case Studies

- [ ] **CASE-01**: Visitor can browse case studies index page showing all available case studies
- [x] **CASE-02**: Visitor can view individual case study with structured sections: context, technical challenges, and reflection
- [x] **CASE-03**: 2-3 production case studies written with specific technical outcomes (not vague/promotional)

### Resume

- [x] **RESM-01**: Visitor can view clean, structured resume at /resume with experience, skills, and career progression
- [x] **RESM-02**: Resume emphasizes career stability, team collaboration, and production systems

### Contact

- [x] **CTCT-01**: Visitor can submit contact form with name, email, and message
- [x] **CTCT-02**: Contact form sends email notification to site owner via Resend

### Site Structure

- [x] **SITE-01**: Main navigation shows Home, Engineering, Case Studies, Resume, Contact
- [x] **SITE-02**: Shop link demoted to footer (not primary nav)
- [x] **SITE-03**: Portfolio pages use route groups for clean separation from shop routes
- [x] **SITE-04**: All portfolio pages have SEO metadata and Open Graph tags
- [x] **SITE-05**: Site tone is professional: clear outcomes, measurable impact, technical clarity throughout

## Future Requirements

Deferred to v2.1+. Tracked but not in current roadmap.

### Case Study Enhancements

- **CASE-04**: Architecture diagrams (Mermaid) in case studies
- **CASE-05**: Measurable outcomes/metrics section in each case study
- **CASE-06**: Code quality practices section per case study (test coverage, refactoring, error handling)

### Tokyo Market

- **TOKY-01**: Japanese-language short intro on homepage (1-2 sentences)
- **TOKY-02**: Testing badges/signals visible per case study

### Engagement

- **ENGM-01**: Upcoming meetup events display
- **ENGM-02**: Newsletter / email collection

## Out of Scope

| Feature | Reason |
|---------|--------|
| Blog / writing section | Case studies are the primary content; blog creates maintenance burden |
| CMS for portfolio content | Hardcoded — content rarely changes, avoids CMS overhead |
| PDF resume download | Browser print-to-PDF sufficient; HTML always current |
| Animations / interactive effects | Engineering portfolio, not design portfolio |
| Multi-language full translation | Scope creep; English sufficient with optional Japanese intro later |
| Testimonials section | Self-hosted testimonials lack credibility; LinkedIn is better |
| Video walkthroughs | High production cost, low ROI for text-first audience |
| Online payment processing | Kept from v1.0 scope — meetup-based fulfillment |

## Traceability

Which phases cover which requirements. Updated during roadmap creation.

| Requirement | Phase | Status |
|-------------|-------|--------|
| HOME-01 | Phase 5 | Complete (verified 2026-03-11) |
| HOME-02 | Phase 5 | Complete (verified 2026-03-11) |
| HOME-03 | Phase 5 | Complete (verified 2026-03-11) |
| HOME-04 | Phase 5 | Complete (verified 2026-03-11) |
| ENG-01 | Phase 5 | Complete (verified 2026-03-11) |
| ENG-02 | Phase 5 | Complete (verified 2026-03-11) |
| CASE-01 | Phase 6 | Pending |
| CASE-02 | Phase 6 | Complete |
| CASE-03 | Phase 6 | Complete |
| RESM-01 | Phase 5 | Complete (verified 2026-03-11) |
| RESM-02 | Phase 5 | Complete (verified 2026-03-11) |
| CTCT-01 | Phase 6 | Complete |
| CTCT-02 | Phase 6 | Complete |
| SITE-01 | Phase 4 | Complete |
| SITE-02 | Phase 4 | Complete |
| SITE-03 | Phase 4 | Complete |
| SITE-04 | Phase 4 | Complete |
| SITE-05 | Phase 4 | Complete |

**Coverage:**
- v2.0 requirements: 18 total
- Mapped to phases: 18
- Unmapped: 0

---
*Requirements defined: 2026-03-04*
*Last updated: 2026-03-11 — Phase 5 requirements accepted after successful 05-07 verification rerun*
