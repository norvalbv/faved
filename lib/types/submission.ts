export interface SubmissionMetadata {
  id?: string
  createdAt?: string
  campaignId?: string
  offerId?: string
  sender: string
  message?: string
  type: string
  userId?: string
  stageId: string
  input: string
  dateInput?: string
  attachments?: string
  submitted?: boolean
  approved?: boolean
  feedback?: string
  feedbackAttachments?: string
}

export interface Submission {
  id: string
  metadata: SubmissionMetadata
  createdAt: Date
  updatedAt: Date
  campaignId: string | null
  type: string
  content: string
}

export interface CreateSubmissionData {
  briefId: string
  type: 'submission'
  content: string
  metadata: SubmissionMetadata
} 