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
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
    updatedAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
    influencerId: "user-1",
  },
]

export default function HomePage(): React.ReactElement {
  return (
    <main className="min-h-screen bg-white p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="space-y-4 border-b border-gray-200 pb-8">
          <h1 className="text-4xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-xl text-gray-600">
            Welcome to the Content Review Platform. Manage and review content submissions from influencers.
          </p>
        </div>

        {/* Available Briefs */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-900">Available Briefs</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <BriefCard brief={GAME_DESIGN_BRIEF} />
            {/* More briefs will be added here */}
          </div>
        </div>

        {/* Recent Submissions */}
        <SubmissionsSection submissions={mockSubmissions} />
      </div>
    </main>
  )
} 