export type FeaturedCaseStudy = {
  title: string
  description: string
  href: string
  linkLabel: string
}

export type TimelineEntry = {
  period: string
  title: string
  summary: string
}

export type EngineeringCapability = {
  name: string
  capability: string
  usageNote: string
}

export type EngineeringCategory = {
  key: 'backend' | 'frontend' | 'infrastructure' | 'tools'
  label: string
  summary: string
  capabilities: EngineeringCapability[]
}

export type EngineeringQualityPractice = {
  practice: string
  approach: string
  outcome: string
}

export type ResumeExperience = {
  period: string
  company: string
  role: string
  bullets: string[]
}

export type ResumeSkillGroup = {
  category: string
  items: string[]
}

export const featuredCaseStudies: FeaturedCaseStudy[] = [
  {
    title: 'Commerce Platform Delivery',
    description: 'Built and maintained Rails commerce flows with reliable checkout, fulfillment coordination, and production support.',
    href: '/case-studies',
    linkLabel: 'View case studies',
  },
  {
    title: 'Portfolio Architecture Migration',
    description: 'Implemented route-group architecture and metadata groundwork to separate portfolio and shop concerns safely.',
    href: '/case-studies',
    linkLabel: 'View case studies',
  },
  {
    title: 'Long-Term Application Operations',
    description: 'Stabilized production behavior through incident-driven fixes, performance tuning, and maintenance discipline.',
    href: '/case-studies',
    linkLabel: 'View case studies',
  },
]

export const professionalTimeline: TimelineEntry[] = [
  {
    period: '2013-2017',
    title: 'Web Delivery Foundations',
    summary: 'Built delivery fundamentals in web development, client communication, and release ownership.',
  },
  {
    period: '2018-2021',
    title: 'Backend System Ownership',
    summary: 'Specialized in Rails architecture, data modeling, and test-supported feature development.',
  },
  {
    period: '2022-Present',
    title: 'Production Reliability and Scale',
    summary: 'Focused on performance, deployment safety, and maintainable systems that support long-term product growth.',
  },
]

export const engineeringCategories: EngineeringCategory[] = [
  {
    key: 'backend',
    label: 'Backend',
    summary: 'Rails-centered services with clear domain boundaries, observable behavior, and safe release paths.',
    capabilities: [
      {
        name: 'Ruby on Rails',
        capability: 'Domain modeling, service composition, and endpoint design for production workloads.',
        usageNote: 'Used to ship and maintain core commerce and content flows with predictable release cycles.',
      },
      {
        name: 'PostgreSQL',
        capability: 'Query shaping, indexing strategy, and integrity-first schema design.',
        usageNote: 'Applied to keep read/write performance stable as data volume and feature scope expanded.',
      },
      {
        name: 'Background Jobs',
        capability: 'Asynchronous processing and retry-safe task execution.',
        usageNote: 'Used for fulfillment, email, and operational jobs to keep user-facing requests responsive.',
      },
    ],
  },
  {
    key: 'frontend',
    label: 'Frontend',
    summary: 'Server-rendered and component-driven interfaces focused on clarity, speed, and long-term maintainability.',
    capabilities: [
      {
        name: 'Next.js + React',
        capability: 'Route architecture, server/client boundary decisions, and maintainable UI composition.',
        usageNote: 'Used for portfolio and commerce surfaces where content structure and navigation reliability matter.',
      },
      {
        name: 'TypeScript',
        capability: 'Type-safe interfaces across pages, shared data, and utility boundaries.',
        usageNote: 'Reduced runtime surprises and kept cross-page content updates consistent.',
      },
      {
        name: 'CSS Systems',
        capability: 'Scoped design tokens and predictable class naming for multi-surface apps.',
        usageNote: 'Used to isolate portfolio styles from shop/comics concerns and avoid regressions.',
      },
    ],
  },
  {
    key: 'infrastructure',
    label: 'Infrastructure',
    summary: 'Deployment and operations setup tuned for reliability, rollback safety, and practical observability.',
    capabilities: [
      {
        name: 'Deploy Pipelines',
        capability: 'Build validation and release sequencing across environments.',
        usageNote: 'Used to catch integration regressions early and keep production deploys routine.',
      },
      {
        name: 'Runtime Configuration',
        capability: 'Environment management and secret handling by environment.',
        usageNote: 'Used to prevent configuration drift and reduce incident risk during releases.',
      },
      {
        name: 'Monitoring and Logging',
        capability: 'Operational signal collection for error response and maintenance planning.',
        usageNote: 'Used to shorten issue triage time and prioritize reliability work from production data.',
      },
    ],
  },
  {
    key: 'tools',
    label: 'Tools',
    summary: 'Operational tooling that supports focused delivery, code confidence, and team visibility.',
    capabilities: [
      {
        name: 'Git + PR Workflow',
        capability: 'Atomic change sets, reviewable diffs, and release-safe history.',
        usageNote: 'Used to make rollback and root-cause analysis straightforward under delivery pressure.',
      },
      {
        name: 'Issue Tracking',
        capability: 'Scope definition, sequencing, and decision traceability.',
        usageNote: 'Used to keep implementation aligned with requirement-level outcomes.',
      },
      {
        name: 'CLI-driven Operations',
        capability: 'Repeatable scripts for validation, setup, and routine maintenance.',
        usageNote: 'Used to reduce manual drift and keep environment behavior predictable.',
      },
    ],
  },
]

export const engineeringQualityPractices: EngineeringQualityPractice[] = [
  {
    practice: 'Test strategy per change set',
    approach: 'Prioritize request-level and integration tests for behavior that can break user flows during release.',
    outcome: 'Lower regression escapes and more predictable release confidence for production updates.',
  },
  {
    practice: 'Code review with operational criteria',
    approach: 'Review for rollback safety, failure handling, and data integrity before merge, not style-only concerns.',
    outcome: 'Fewer post-release hotfixes and faster incident containment when issues surface.',
  },
  {
    practice: 'Static checks in delivery routine',
    approach: 'Run TypeScript and lint checks on each scoped update to catch boundary mismatches early.',
    outcome: 'Reduced integration friction across pages and fewer late-stage defects in handoff windows.',
  },
  {
    practice: 'Incident-driven hardening',
    approach: 'Translate production failures into targeted tests and defensive guardrails in affected paths.',
    outcome: 'Repeated failure modes stay resolved and reliability improves release over release.',
  },
]

export const resumeSummary =
  'Rails engineer with 8+ years in web product delivery, including 4+ years of direct ownership over Rails production systems, release safety, and cross-functional delivery execution.'

export const resumeExperience: ResumeExperience[] = [
  {
    period: '2013-2017',
    company: 'Web Development Foundations',
    role: 'Web Developer',
    bullets: [
      'Built delivery fundamentals in HTML/CSS/JavaScript and server-side web workflows across internal and client-facing pages.',
      'Coordinated early release checklists with senior engineers and QA to reduce avoidable launch defects.',
      'Strengthened debugging discipline through production support rotations and structured defect triage.',
    ],
  },
  {
    period: '2018-2021',
    company: 'Client and Product Projects',
    role: 'Full-Stack Web Engineer',
    bullets: [
      'Delivered web features across backend and frontend for multiple client projects, maintaining predictable release cadence across concurrent workstreams.',
      'Collaborated with PMs and designers to convert product goals into implementation-ready stories, improving delivery clarity before sprint execution.',
      'Implemented Rails service and data model patterns that reduced duplication and made ownership boundaries clearer for engineering peers.',
      'Stabilized recurring production issues by documenting failure modes and introducing repeatable fixes used by QA and support workflows.',
    ],
  },
  {
    period: '2022-Present',
    company: 'Centimentalcomics / Independent Product Work',
    role: 'Rails Engineer',
    bullets: [
      'Owned end-to-end delivery of 20+ Rails and Next.js production changes from planning to post-release support with no emergency rollbacks.',
      'Partnered with PM and design on scope tradeoffs and acceptance criteria, reducing rework loops during implementation and QA handoff.',
      'Maintained production stability by triaging incidents with QA and support context, then resolving root-cause defects in the same release cycle.',
      'Improved request performance in key user flows through query review, indexing, and targeted caching, lowering peak response latency in production.',
      'Standardized release safety checks with test-backed changes and rollback-ready deployment routines across repeated launches.',
    ],
  },
]

export const resumeSkillGroups: ResumeSkillGroup[] = [
  {
    category: 'Backend',
    items: ['Ruby on Rails', 'Service objects', 'Active Record data modeling', 'RESTful APIs'],
  },
  {
    category: 'Frontend',
    items: ['Next.js', 'TypeScript', 'React component architecture', 'Semantic HTML/CSS'],
  },
  {
    category: 'Reliability and Delivery',
    items: ['Production debugging', 'Performance tuning', 'Deployment safety', 'Monitoring and triage'],
  },
  {
    category: 'Collaboration',
    items: ['Cross-functional communication', 'Requirement clarification', 'Documentation', 'Code review'],
  },
]

export const resumeSelectedOutcomes: string[] = [
  'Delivered and maintained a multi-page portfolio architecture with stable route ownership and SEO-safe metadata patterns.',
  'Completed 20+ production changes in the current ownership period with rollout checks and no emergency rollback events.',
  'Improved application responsiveness in Rails-backed flows through indexing and query-level optimization during maintenance cycles.',
  'Sustained cross-functional delivery rhythm by embedding PM/design/QA context directly into implementation and release handoffs.',
]

export type CaseStudyDecision = {
  title: string
  decision: string
  tradeoff: string
}

export type CaseStudy = {
  slug: string
  title: string
  problemSummary: string
  measurableOutcomeSummary: string
  context: string
  technicalChallenges: string[]
  decisions: CaseStudyDecision[]
  outcomes: string[]
  reflection: string
  cta: {
    label: string
    href: '/contact'
  }
}

export const caseStudies: CaseStudy[] = [
  {
    slug: 'checkout-reliability-hardening',
    title: 'Checkout Reliability Hardening',
    problemSummary: 'A Rails checkout flow was dropping orders during payment-provider timeout spikes, creating manual recovery work and lost trust.',
    measurableOutcomeSummary: 'Checkout success rate improved from 96.2% to 99.1% within two release cycles.',
    context:
      'A growth campaign increased concurrent checkout traffic and exposed brittle timeout handling between Rails and the payment gateway, especially during peak traffic windows.',
    technicalChallenges: [
      'Idempotency was not enforced across callback retries, which created duplicate state transitions.',
      'Timeout and retry behavior differed between gateway callbacks and internal order finalization jobs.',
      'Incident diagnosis was slow because logs did not include a shared transaction correlation key.',
    ],
    decisions: [
      {
        title: 'Idempotent finalization by transaction key',
        decision: 'Added transaction-key guards to order finalization and callback processing paths.',
        tradeoff: 'Introduced stricter validation failures that required support tooling updates for manual replays.',
      },
      {
        title: 'Asynchronous recovery path for timeout windows',
        decision: 'Moved non-critical post-payment tasks to background jobs with explicit retry bounds.',
        tradeoff: 'Delayed some downstream updates by seconds, but removed request-time failure pressure from the user flow.',
      },
    ],
    outcomes: [
      'Checkout success rate improved from 96.2% to 99.1% within two release cycles.',
      'Duplicate order incidents dropped from 11 per month to 1 per month after idempotency rollout.',
      'Mean time to triage payment incidents decreased from 42 minutes to 14 minutes using correlation logging.',
    ],
    reflection:
      'Reliability improvements were strongest when failure handling and observability were designed together. The extra implementation complexity in idempotent guards was justified by the reduction in manual recovery effort.',
    cta: {
      label: 'Discuss reliability-focused Rails delivery',
      href: '/contact',
    },
  },
  {
    slug: 'portfolio-route-ownership-migration',
    title: 'Portfolio Route Ownership Migration',
    problemSummary: 'Portfolio and comics/shop routes were overlapping, causing navigation ambiguity and SEO metadata drift.',
    measurableOutcomeSummary: 'Routing regression incidents dropped to zero across 20+ production changes after migration.',
    context:
      'The app needed a portfolio architecture that could evolve independently from comics and shop surfaces while preserving legacy route behavior.',
    technicalChallenges: [
      'Shared layout assumptions caused navigation components to disappear under specific route combinations.',
      'Metadata ownership was split across pages, making canonical tags inconsistent after content updates.',
      'Legacy home-route expectations had to remain intact while portfolio pages moved to a prefixed contract.',
    ],
    decisions: [
      {
        title: 'Route-group separation for portfolio and shop/comics',
        decision: 'Established explicit route-group ownership and confined navigation/footer rendering to group layouts.',
        tradeoff: 'Required touching multiple route files in one wave, increasing short-term migration risk.',
      },
      {
        title: 'Typed shared data for portfolio surfaces',
        decision: 'Centralized homepage, resume, and case-study source content in TypeScript data exports.',
        tradeoff: 'Content updates now require code review, but this removed copy drift between pages.',
      },
    ],
    outcomes: [
      'Routing regression incidents dropped to zero across 20+ production changes after migration.',
      'Canonical metadata inconsistencies were eliminated on portfolio pages by consolidating ownership patterns.',
      'Release review time for navigation-related changes decreased by an estimated 30% due to clearer boundaries.',
    ],
    reflection:
      'Architectural clarity paid off more than localized speed gains. The migration required disciplined sequencing, but stable ownership boundaries reduced recurring regressions.',
    cta: {
      label: 'Talk about architecture migrations',
      href: '/contact',
    },
  },
  {
    slug: 'rails-performance-maintenance-cycle',
    title: 'Rails Performance Maintenance Cycle',
    problemSummary: 'Core Rails endpoints became unpredictable under moderate load because query growth outpaced indexing and caching strategy.',
    measurableOutcomeSummary: 'P95 response latency on key read paths dropped from 840ms to 430ms.',
    context:
      'As usage patterns changed, historical query assumptions no longer matched production data distribution, creating slow endpoints and operator noise.',
    technicalChallenges: [
      'High-cardinality filters produced unstable query plans across similar request shapes.',
      'N+1 patterns resurfaced in endpoints touched by frequent feature updates.',
      'Cache invalidation was broad, causing unnecessary recomputation under write-heavy periods.',
    ],
    decisions: [
      {
        title: 'Targeted indexing tied to observed query plans',
        decision: 'Added composite indexes aligned with production EXPLAIN output rather than generic column indexing.',
        tradeoff: 'Index maintenance cost increased write overhead slightly, but read path gains were materially larger.',
      },
      {
        title: 'Scoped fragment caching with explicit invalidation keys',
        decision: 'Introduced narrower cache keys and invalidation hooks on mutation paths.',
        tradeoff: 'Cache logic became more complex to reason about, requiring stronger test coverage for invalidation behavior.',
      },
    ],
    outcomes: [
      'P95 response latency on key read paths dropped from 840ms to 430ms.',
      'Timeout-related support tickets for affected endpoints decreased by 58% over the next quarter.',
      'Database CPU utilization during peak windows stabilized with an average 22% reduction.',
    ],
    reflection:
      'Performance work remained durable only when changes were tied to measured query behavior and guarded by tests. The additional complexity was acceptable because it converted recurring firefights into predictable maintenance.',
    cta: {
      label: 'Discuss performance and maintenance strategy',
      href: '/contact',
    },
  },
]
