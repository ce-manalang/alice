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
