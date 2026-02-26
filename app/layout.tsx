import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { GoogleTagManager, GoogleAnalytics } from "@next/third-parties/google"
import Navigation from "@/app/components/Navigation"
import Footer from "@/app/components/Footer"

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
})

export const metadata: Metadata = {
  title: {
    template: "centimentalcomics: %s",
    default: "centimentalcomics",
  },
  description: "some comics about art and internet",
  keywords: ["comics", "art", "internet", "webcomics", "illustration"],
  authors: [{ name: "ce manalang" }],
  creator: "ce manalang",
  publisher: "centimentalcomics",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://centimentalcomics.com",
    siteName: "centimentalcomics",
    title: "centimentalcomics",
    description: "some comics about art and internet",
    images: [
      {
        url: "/assets/images/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "centimentalcomics",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "centimentalcomics",
    description: "some comics about art and internet",
    images: ["/assets/images/og-image.jpg"],
    creator: "@centimentalcomx",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
  metadataBase: new URL("https://centimentalcomics.com"),
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const gtmId = process.env.NEXT_PUBLIC_GTM_ID
  const gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID

  return (
    <html lang="en">
      {gtmId && <GoogleTagManager gtmId={gtmId} />}
      {gaId && <GoogleAnalytics gaId={gaId} />}
      <body className={inter.className} style={{ margin: 0, display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Navigation />
        <main style={{ flex: 1 }}>
          {children}
        </main>
        <Footer />
      </body>
    </html>
  )
}
