"use client"

import type { SubmissionFeedback } from "@/types/submission"
import { FeedbackList } from "./feedback-list"
import { FeedbackForm } from "./feedback-form"

interface FeedbackSectionProps {
  submissionId: string
  feedback: SubmissionFeedback[]
}

export const FeedbackSection = ({ submissionId, feedback }: FeedbackSectionProps): React.ReactElement => {
  const handleSubmitFeedback = async (data: Omit<SubmissionFeedback, "id" | "createdAt" | "reviewerId">) => {
    // In a real app, this would make an API call
    console.log("Submitting feedback:", data)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold tracking-tight">Feedback</h2>
        <span className="text-sm text-muted-foreground">
          {feedback.length} {feedback.length === 1 ? "response" : "responses"}
        </span>
      </div>

      <FeedbackList items={feedback} />

      <div className="rounded-lg border bg-card p-6">
        <div className="mb-4">
          <h3 className="text-sm font-medium">Add Feedback</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Provide feedback based on the brief guidelines and requirements.
          </p>
        </div>
        <FeedbackForm submissionId={submissionId} onSubmit={handleSubmitFeedback} />
      </div>
    </div>
  )
} 