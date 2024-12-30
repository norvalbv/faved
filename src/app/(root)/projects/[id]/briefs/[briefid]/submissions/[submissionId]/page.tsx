import { Metadata } from "next"
import { notFound } from "next/navigation"
import Link from "next/link"
import { formatDistanceToNow } from "date-fns"
import { cn } from "@/lib/utils"
import { GAME_DESIGN_BRIEF } from "@/lib/constants/briefs"
import { FeedbackSection } from "@/src/components/submissions/feedback-section"
import type { Feedback } from "@/lib/data-store/schema/feedback"

interface SubmissionPageProps {
  params: {
    id: string
    submissionId: string
  }
}

// Mock data - in a real app this would come from an API
const mockSubmission = {
  id: "1",
  type: "video_topic",
  content: "Game Design Workflow Overview",
  status: "pending",
  briefId: GAME_DESIGN_BRIEF.id,
  createdAt: new Date(),
  updatedAt: new Date(),
  influencerId: "user-1",
}

// Mock feedback data
const mockFeedback: Feedback[] = [
  {
    id: "1",
    submissionId: "1",
    type: "suggestion",
    content: "Consider adding more details about how Milanote can be used for character design documentation.",
    createdAt: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
    updatedAt: new Date(Date.now() - 30 * 60 * 1000),
  },
]

export const metadata: Metadata = {
  title: "Submission Details | Content Review Platform",
  description: "View submission details and feedback",
}

export default async function SubmissionPage({ params }: SubmissionPageProps): Promise<React.ReactElement> {
  const { id: briefId, submissionId } = params
  
  // In a real app, we would fetch the submission and verify it belongs to the brief
  if (submissionId !== mockSubmission.id || briefId !== mockSubmission.briefId) {
    notFound()
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="mx-auto max-w-4xl space-y-8">
        {/* Header */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold tracking-tight">Submission Details</h1>
            <Link
              href={`/projects/${briefId}`}
              className="text-sm text-primary hover:underline"
            >
              View Brief
            </Link>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-medium">
              {mockSubmission.type.split("_").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ")}
            </span>
            <span className={cn(
              "inline-flex items-center rounded-full px-2 py-1 text-xs font-medium",
              {
                "bg-yellow-100 text-yellow-800": mockSubmission.status === "pending",
                "bg-green-100 text-green-800": mockSubmission.status === "approved",
                "bg-red-100 text-red-800": mockSubmission.status === "rejected",
              }
            )}>
              {mockSubmission.status.charAt(0).toUpperCase() + mockSubmission.status.slice(1)}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold tracking-tight">Content</h2>
          <div className="rounded-lg border bg-card p-6">
            <p className="whitespace-pre-wrap text-sm">{mockSubmission.content}</p>
          </div>
        </div>

        {/* Metadata */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold tracking-tight">Details</h2>
          <dl className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1">
              <dt className="text-sm font-medium text-muted-foreground">Submitted</dt>
              <dd className="text-sm">
                {formatDistanceToNow(mockSubmission.createdAt, { addSuffix: true })}
              </dd>
            </div>
            <div className="space-y-1">
              <dt className="text-sm font-medium text-muted-foreground">Last Updated</dt>
              <dd className="text-sm">
                {formatDistanceToNow(mockSubmission.updatedAt, { addSuffix: true })}
              </dd>
            </div>
          </dl>
        </div>

        {/* Feedback Section */}
        <FeedbackSection
          submissionId={mockSubmission.id}
          feedback={mockFeedback}
        />
      </div>
    </main>
  )
}