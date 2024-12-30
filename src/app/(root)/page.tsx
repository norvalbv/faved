import { Metadata } from "next"
import { BriefCard } from "@/src/components/dashboard/brief-card"
import { SubmissionsSection } from "@/src/components/dashboard/submissions-section"
import { listBriefs } from "@/lib/actions/briefs"
import { listRecentSubmissions } from "@/lib/actions/submissions"

export const metadata: Metadata = {
  title: "Dashboard | Content Review Platform",
  description: "Manage and review content submissions",
}

export default async function HomePage(): Promise<React.ReactElement> {
  const [briefs, submissions] = await Promise.all([
    listBriefs(),
    listRecentSubmissions(5)
  ])

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      {/* Briefs Section */}
      <section className="py-16">
        <div className="faved-container">
          <div className="space-y-8">
            <div className="text-center space-y-4">
              <h2 className="text-4xl font-bold text-gray-900">Available Briefs</h2>
              <p className="text-xl text-gray-600">
                Choose from our selection of brand collaboration opportunities.
              </p>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {briefs.map((brief) => (
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