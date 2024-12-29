"use client"

import type { SubmissionType } from "@/types/submission"
import { SubmissionForm } from "./submission-form"

interface BriefSubmissionSectionProps {
  briefId: string
}

export const BriefSubmissionSection = ({ briefId }: BriefSubmissionSectionProps): React.ReactElement => {
  const handleSubmit = async (data: { type: SubmissionType; content: string }) => {
    // In a real app, this would make an API call
    console.log("Submitting for brief:", briefId, data)
  }

  return (
    <div className="rounded-lg border bg-card p-6">
      <SubmissionForm onSubmit={handleSubmit} />
    </div>
  )
} 