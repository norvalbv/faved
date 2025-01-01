'use client'

import { ReactElement, useState } from 'react'
import { Card, CardContent } from '@/src/components/ui/card'
import type { Submission } from '@/lib/types/submission'
import { SubmissionCard } from './submission-card'

interface Props {
  submissions: Submission[]
  onApprove: (id: string, feedback: string) => Promise<void>
  onRequestChanges: (id: string, feedback: string) => Promise<void>
  onAddFeedback: (id: string, feedback: string) => Promise<void>
  onReject: (id: string, feedback: string) => Promise<void>
}

export const SubmissionThread = ({ 
  submissions, 
  onApprove, 
  onRequestChanges, 
  onAddFeedback,
  onReject,
}: Props): ReactElement => {
  const [feedback, setFeedback] = useState<string>('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleApprove = async (id: string) => {
    if (!feedback.trim()) return
    try {
      setIsSubmitting(true)
      await onApprove(id, feedback)
      setFeedback('')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleRequestChanges = async (id: string) => {
    if (!feedback.trim()) return
    try {
      setIsSubmitting(true)
      await onRequestChanges(id, feedback)
      setFeedback('')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleReject = async (id: string) => {
    if (!feedback.trim()) return
    try {
      setIsSubmitting(true)
      await onReject(id, feedback)
      setFeedback('')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleAddFeedback = async (id: string) => {
    if (!feedback.trim()) return
    try {
      setIsSubmitting(true)
      await onAddFeedback(id, feedback)
      setFeedback('')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="grid gap-4">
      {submissions.map(submission => (
        <SubmissionCard
          key={submission.id}
          submission={submission}
          isSubmitting={isSubmitting}
          feedback={feedback}
          onApprove={handleApprove}
          onRequestChanges={handleRequestChanges}
          onAddFeedback={handleAddFeedback}
          onReject={handleReject}
        />
      ))}

      {submissions.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-8 text-center">
            <h3 className="mb-2 text-lg font-medium">No submissions yet</h3>
            <p className="mb-4 text-sm text-muted-foreground">
              There are no submissions for this campaign yet
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
} 