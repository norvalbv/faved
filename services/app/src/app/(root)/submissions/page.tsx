import { Metadata } from "next"
import { GAME_DESIGN_BRIEF } from "@/constants/briefs"
import { FilteredSubmissions } from "@/components/submissions/filtered-submissions"
import type { Submission } from "@/types/submission"

export const metadata: Metadata = {
  title: "Submissions | Content Review Platform",
  description: "View and manage content submissions",
}

// Mock data - in a real app this would come from an API
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
  {
    id: "3",
    type: "draft_video",
    content: "Level Design Walkthrough",
    status: "rejected",
    briefId: GAME_DESIGN_BRIEF.id,
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    influencerId: "user-1",
  },
]

export default async function SubmissionsPage(): Promise<React.ReactElement> {
  return (
    <main className="container mx-auto px-4 py-8">
      <div className="mx-auto max-w-5xl space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold tracking-tight">Submissions</h1>
            <p className="text-lg text-muted-foreground">
              View and manage your content submissions
            </p>
          </div>
        </div>

        {/* Filtered Submissions */}
        <FilteredSubmissions initialSubmissions={mockSubmissions} />
      </div>
    </main>
  )
} 