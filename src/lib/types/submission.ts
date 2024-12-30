export interface SubmissionMetadata {
  sender: string
  type: string
  input?: string
  message?: string
  campaignId?: string
  stageId?: string
  approved?: boolean
  feedback?: string
}

export interface Submission {
  id: string
  metadata: unknown
  createdAt: Date
  updatedAt: Date
  campaignId: string | null
  type: string
  content: string
} 