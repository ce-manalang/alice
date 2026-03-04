import type React from "react"
import Navigation from "@/app/components/Navigation"
import Footer from "@/app/components/Footer"

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navigation />
      <main style={{ flex: 1 }}>
        {children}
      </main>
      <Footer />
    </>
  )
}
