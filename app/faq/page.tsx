import type { Metadata } from 'next'
import Accordion from '@/app/components/Accordion'

export const metadata: Metadata = {
  title: 'FAQ',
  description: 'Frequently asked questions about ordering, fulfillment, product availability, and pre-orders from centimentalcomics.',
  alternates: { canonical: '/faq' },
  openGraph: {
    title: 'FAQ | centimentalcomics',
    description: 'Frequently asked questions about ordering and fulfillment.',
    url: '/faq',
  },
}

const FAQ_SECTIONS = [
  {
    title: 'Ordering',
    items: [
      {
        question: 'How do I order?',
        answer: "Browse the shop, pick what you want, and fill out the checkout form with your contact details. We'll reach out via email or phone to confirm your order and arrange a meetup.",
      },
      {
        question: 'Do you ship?',
        answer: "Currently, we primarily do in-person meetup fulfillment in Metro Manila. If you're based elsewhere, email us at cm@centimentalcomics.com — we'll figure it out together.",
      },
      {
        question: 'Can I order multiple items?',
        answer: "Yes! Add everything you want to your cart before checking out. We'll confirm the full order in one go.",
      },
    ],
  },
  {
    title: 'Fulfillment & Meetups',
    items: [
      {
        question: 'How does meetup fulfillment work?',
        answer: "After you submit your order, we'll contact you at your provided email or phone number to arrange a convenient meetup location and time. Most meetups happen in central Manila.",
      },
      {
        question: 'How long does fulfillment take?',
        answer: 'We typically confirm orders within 1-3 days and arrange meetups within the same week, depending on availability. Pre-order items may take longer — see item descriptions for timelines.',
      },
      {
        question: 'Can I cancel my order?',
        answer: "Yes, reach out before the meetup and we'll cancel it. No hard feelings.",
      },
    ],
  },
  {
    title: 'Products',
    items: [
      {
        question: "What's in each zine?",
        answer: 'Each zine covers a specific CS topic — algorithms, data structures, web concepts — written in plain language with hand-drawn illustrations. Check the product description for contents.',
      },
      {
        question: 'Are products suitable for beginners?',
        answer: 'Yes. Our zines are written for curious learners at any level. We focus on intuition and storytelling over jargon.',
      },
      {
        question: 'Do you accept returns?',
        answer: "We accept returns for damaged or incorrect items. Get in touch within 7 days of your meetup and we'll sort it out.",
      },
    ],
  },
  {
    title: 'Pre-Orders & Availability',
    items: [
      {
        question: 'What does "Pre-order" mean?',
        answer: "Pre-order items are in production. You can reserve yours now and we'll contact you when they're ready — usually within 2-4 weeks. No payment until meetup.",
      },
      {
        question: 'What does "Sold Out" mean?',
        answer: "Sold-out items are temporarily unavailable. We restock regularly. Follow us on Instagram for restock announcements.",
      },
      {
        question: "Can I be notified when something's back in stock?",
        answer: "Follow @centimentalcomics on Instagram or email us — we'll add you to our restock notification list for specific items.",
      },
    ],
  },
]

export default function FAQPage() {
  return (
    <div className="shop-page">
      <div className="shop-container" style={{ paddingTop: '3rem', paddingBottom: '5rem', maxWidth: '720px' }}>
        <h1 style={{ fontFamily: "'Inter', system-ui, sans-serif", fontSize: '2rem', fontWeight: 700, color: '#111111', margin: '0 0 2.5rem', lineHeight: 1.1 }}>
          FAQ
        </h1>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
          {FAQ_SECTIONS.map((section) => (
            <div key={section.title}>
              <h2 style={{ fontFamily: "'Inter', system-ui, sans-serif", fontSize: '0.8125rem', fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 0.5rem' }}>
                {section.title}
              </h2>
              <div style={{ borderTop: '1px solid #e5e7eb' }}>
                {section.items.map((item) => (
                  <Accordion key={item.question} question={item.question} answer={item.answer} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
