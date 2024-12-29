import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Dashboard | Content Review Platform",
  description: "Manage and review content submissions",
}

export default function HomePage(): React.ReactElement {
  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold tracking-tight">Dashboard</h1>
      <p className="mt-4 text-lg text-muted-foreground">
        Welcome to the Content Review Platform. Manage and review content submissions from influencers.
      </p>
    </main>
  )
} 