import { Metadata } from "next"
import { BriefCard } from "@/src/components/dashboard/brief-card"
import { SubmissionsSection } from "@/src/components/dashboard/submissions-section"
import { GAME_DESIGN_BRIEF } from "@/src/constants/briefs"
import type { Submission } from "@/src/types/submission"

export const metadata: Metadata = {
  title: "Dashboard | Content Review Platform",
  description: "Manage and review content submissions",
}

// Temporary mock data
const mockSubmissions: Submission[] = [
  {
    id: "1",
    type: "video_topic",
    content: "Game Design Workflow Overview",
    status: "pending",
    briefId: GAME_DESIGN_BRIEF.id,
    createdAt: new Date(),
    updatedAt: new Date(),
    influencerId: "user-1",
  },
  {
    id: "2",
    type: "draft_script",
    content: "Character Design Process",
    status: "approved",
    briefId: GAME_DESIGN_BRIEF.id,
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
    influencerId: "user-1",
  },
]

export default function HomePage(): React.ReactElement {
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
              <BriefCard brief={GAME_DESIGN_BRIEF} />
              {/* More briefs will be added here */}
            </div>
          </div>
        </div>
      </section>

      {/* Recent Submissions */}
      <section className="py-16 bg-white">
        <div className="faved-container">
          <SubmissionsSection submissions={mockSubmissions} />
        </div>
      </section>
    </div>
  )
} 