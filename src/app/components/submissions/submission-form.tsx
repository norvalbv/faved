"use client"

import { useState } from "react"
import { createSubmission } from "@/lib/actions/submissions"

interface SubmissionFormProps {
  briefId: string
}

const SUBMISSION_TYPES = [
  { value: 'video_topic', label: 'Video Topic' },
  { value: 'draft_script', label: 'Draft Script' },
  { value: 'draft_video', label: 'Draft Video' },
  { value: 'live_video', label: 'Live Video' },
] as const

export const SubmissionForm = ({ briefId }: SubmissionFormProps): React.ReactElement => {
  const [type, setType] = useState<typeof SUBMISSION_TYPES[number]['value']>('video_topic')
  const [content, setContent] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)
    
    try {
      const result = await createSubmission({
        briefId,
        type,
        content,
      })

      if (result.success) {
        setContent('')
      } else {
        setError(result.error || 'Failed to submit content')
      }
    } catch (error) {
      console.error('Error submitting content:', error)
      setError('Failed to submit content')
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
            onChange={(e) => setType(e.target.value as typeof type)}
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

      {error && (
        <p className="text-sm text-red-500">{error}</p>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="inline-flex w-full items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:pointer-events-none disabled:opacity-50"
      >
        {isSubmitting ? 'Submitting...' : 'Submit for Review'}
      </button>
    </form>
  )
} 