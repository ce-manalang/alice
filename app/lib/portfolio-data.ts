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
