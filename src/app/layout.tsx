import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "../styles/globals.css"
import { cn } from "../../lib/utils"
import { Navigation } from "../components/layout/Navigation"
import { Toaster } from "sonner"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
})

export const metadata: Metadata = {
  title: "Faved - Content Review Platform",
  description: "A platform for managing content submissions and approvals",
  icons: {
    icon: '/favicon.ico',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}): React.ReactElement {
  return (
    <html lang="en" className={cn("h-full scroll-smooth antialiased", inter.variable)}>
      <body className="min-h-full bg-background font-sans">
        <Navigation />
        <Toaster />
        <main className="pt-16">
          {children}
        </main>
      </body>
    </html>
  )
} 