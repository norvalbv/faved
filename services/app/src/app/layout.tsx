import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "@/src/styles/globals.css"
import { cn } from "@/lib/utils"
import { Navigation } from "@/src/components/layout/Navigation"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Content Review Platform",
  description: "A platform for managing content submissions and approvals",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}): React.ReactElement {
  return (
    <html lang="en" className="h-full">
      <body className={cn("min-h-full bg-background font-sans antialiased", inter.className)}>
        <Navigation />
        {children}
      </body>
    </html>
  )
} 