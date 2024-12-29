"use client"

import { useState } from "react"
import type { SubmissionFeedback } from "@/types/submission"

interface FeedbackFormProps {
  submissionId: string
  onSubmit: (data: Omit<SubmissionFeedback, "id" | "createdAt" | "reviewerId">) => void
}

const FEEDBACK_TYPES = [
  { value: "correction", label: "Needs Correction" },
  { value: "suggestion", label: "Suggestion" },
  { value: "approval", label: "Approval" },
] as const

export const FeedbackForm = ({ submissionId, onSubmit }: FeedbackFormProps): React.ReactElement => {
  const [type, setType] = useState<SubmissionFeedback["type"]>("suggestion")
  const [content, setContent] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      await onSubmit({
        submissionId,
        type,
        content,
      })
      setContent("")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="type" className="text-sm font-medium">
          Feedback Type
        </label>
        <select
          id="type"
          value={type}
          onChange={(e) => setType(e.target.value as SubmissionFeedback["type"])}
          className="w-full rounded-md border bg-background px-3 py-2 text-sm"
          required
        >
          {FEEDBACK_TYPES.map((type) => (
            <option key={type.value} value={type.value}>
              {type.label}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-2">
        <label htmlFor="content" className="text-sm font-medium">
          Feedback
        </label>
        <textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="h-32 w-full rounded-md border bg-background px-3 py-2 text-sm"
          placeholder="Enter your feedback here..."
          required
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="inline-flex w-full items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:pointer-events-none disabled:opacity-50"
      >
        {isSubmitting ? "Submitting..." : "Submit Feedback"}
      </button>
    </form>
  )
} 