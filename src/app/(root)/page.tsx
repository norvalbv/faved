import { Metadata } from "next"
import { BriefCard } from "@/src/components/dashboard/brief-card"
import { SubmissionsSection } from "@/src/components/dashboard/submissions-section"
import { listBriefs } from "@/lib/actions/briefs"
import { listRecentSubmissions } from "@/lib/actions/submissions"
import { Button } from "@/src/components/ui/button"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Dashboard | Content Review Platform",
  description: "Manage and review content submissions",
}

export default async function HomePage(): Promise<React.ReactElement> {
  const [briefs, submissions] = await Promise.all([
    listBriefs(),
    listRecentSubmissions(5)
  ])

  // Only show the first 3 briefs on dashboard
  const recentBriefs = briefs.slice(0, 3)

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      {/* Briefs Section */}
      <section className="py-16">
        <div className="faved-container">
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <h2 className="text-2xl font-bold text-gray-900">Featured Briefs</h2>
                <p className="text-muted-foreground">
                  Start with one of these brand collaboration opportunities
                </p>
              </div>
              <Link href="/briefs">
                <Button variant="outline">
                  View All Briefs
                </Button>
              </Link>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {recentBriefs.map((brief) => (
                <BriefCard key={brief.id} brief={brief} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Recent Submissions */}
      <section className="py-16 bg-white">
        <div className="faved-container">
          <SubmissionsSection submissions={submissions} />
        </div>
      </section>
    </div>
  )
} 