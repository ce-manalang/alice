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
    period: 'Early Career',
    title: 'Web Delivery Foundations',
    summary: 'Built delivery fundamentals in web development, client communication, and release ownership.',
  },
  {
    period: 'Rails Focus',
    title: 'Backend System Ownership',
    summary: 'Specialized in Rails architecture, data modeling, and test-supported feature development.',
  },
  {
    period: 'Current',
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

export const resumeSummary =
  'Rails engineer with a track record of shipping and maintaining production systems over multiple years, with a focus on reliability, predictable delivery, and long-term code stewardship.'

export const resumeExperience: ResumeExperience[] = [
  {
    period: '2022-Present',
    company: 'Centimentalcomics / Independent Product Work',
    role: 'Rails Engineer',
    bullets: [
      'Owned end-to-end delivery of portfolio and commerce features across planning, implementation, and post-release support.',
      'Maintained production stability through incident triage, bug resolution, and routine maintenance workflows.',
      'Improved request performance through query reviews, indexing, and targeted caching updates.',
      'Kept releases predictable with test-backed changes and rollback-aware deployment practices.',
    ],
  },
  {
    period: '2018-2022',
    company: 'Client and Product Projects',
    role: 'Full-Stack Web Engineer',
    bullets: [
      'Delivered web features across backend and frontend layers while managing scope and release timing.',
      'Implemented Rails service and data model patterns that reduced duplication and clarified ownership boundaries.',
      'Stabilized recurring production issues by documenting failure modes and introducing repeatable fixes.',
      'Supported iterative product delivery through clear technical communication and requirement breakdown.',
    ],
  },
  {
    period: 'Early Career',
    company: 'Web Development Foundations',
    role: 'Web Developer',
    bullets: [
      'Built delivery fundamentals in HTML/CSS/JavaScript and server-side web workflows.',
      'Developed team habits around release checklists, issue tracking, and post-release follow-up.',
      'Strengthened debugging discipline through production support and defect triage.',
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
  'Delivered and maintained multi-page portfolio architecture with stable route ownership and SEO-safe metadata patterns.',
  'Reduced release risk through test-backed implementation and issue-focused production maintenance workflow.',
  'Improved application responsiveness with indexing and query-level optimizations in Rails-backed flows.',
]
