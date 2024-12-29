import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "../styles/globals.css"
import { cn } from "../../lib/utils"
import { Navigation } from "../components/layout/Navigation"

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
      <body className="flex min-h-full flex-col bg-background font-sans">
        <Navigation />
        <main className="flex-1">
          {children}
        </main>
      </body>
    </html>
  )
} 