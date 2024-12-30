"use client"

import { SubmissionForm } from './submission-form'

interface BriefSubmissionSectionProps {
  briefId: string
}

export const BriefSubmissionSection = ({ briefId }: BriefSubmissionSectionProps) => {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-4">Submit Content</h2>
      <SubmissionForm briefId={briefId} />
    </div>
  )
} 