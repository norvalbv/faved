"use client"

import { useState } from "react"
import type { SubmissionType } from "@/types/submission"

interface SubmissionFormProps {
  onSubmit: (data: {
    type: SubmissionType
    content: string
  }) => void
}

const SUBMISSION_TYPES: { value: SubmissionType; label: string }[] = [
  { value: "video_topic", label: "Video Topic" },
  { value: "draft_script", label: "Draft Script" },
  { value: "draft_video", label: "Draft Video" },
  { value: "live_video", label: "Live Video" },
]

export const SubmissionForm = ({ onSubmit }: SubmissionFormProps): React.ReactElement => {
  const [type, setType] = useState<SubmissionType>("video_topic")
  const [content, setContent] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    try {
      await onSubmit({ type, content })
      setContent("")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Submit Content</h3>
        <p className="text-sm text-muted-foreground">
          Submit your content for review. Make sure it aligns with the brief guidelines.
        </p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="type" className="text-sm font-medium">
            Submission Type
          </label>
          <select
            id="type"
            value={type}
            onChange={(e) => setType(e.target.value as SubmissionType)}
            className="w-full rounded-md border bg-background px-3 py-2 text-sm"
            required
          >
            {SUBMISSION_TYPES.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label htmlFor="content" className="text-sm font-medium">
            Content
          </label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="h-32 w-full rounded-md border bg-background px-3 py-2 text-sm"
            placeholder="Enter your content here..."
            required
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="inline-flex w-full items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:pointer-events-none disabled:opacity-50"
      >
        {isSubmitting ? "Submitting..." : "Submit for Review"}
      </button>
    </form>
  )
} 