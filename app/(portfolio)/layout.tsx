import type React from 'react'
import type { Metadata } from 'next'
import PortfolioNavigation from '@/app/components/portfolio-navigation'
import PortfolioFooter from '@/app/components/portfolio-footer'

export const metadata: Metadata = {
  title: {
    template: 'Rails Engineer | %s',
    default: 'Rails Engineer Portfolio',
  },
  description: 'Portfolio of a Rails engineer - case studies, tech stack, and resume.',
  authors: [{ name: 'ce manalang' }],
  creator: 'ce manalang',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://centimentalcomics.com',
    siteName: 'centimentalcomics',
    title: 'Rails Engineer Portfolio',
    description: 'Portfolio of a Rails engineer - case studies, tech stack, and resume.',
    images: [
      {
        url: '/og-portfolio.jpg',
        width: 1200,
        height: 630,
        alt: 'Rails Engineer Portfolio',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Rails Engineer Portfolio',
    description: 'Portfolio of a Rails engineer - case studies, tech stack, and resume.',
    images: ['/og-portfolio.jpg'],
    creator: '@centimentalcomx',
  },
}

export default function PortfolioLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <PortfolioNavigation />
      <main style={{ flex: 1 }}>{children}</main>
      <PortfolioFooter />
    </>
  )
}
