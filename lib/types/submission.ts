export interface SubmissionMetadata {
  id: string
  createdAt: string
  campaignId?: string
  offerId?: string
  sender?: string
  message?: string
  type?: string
  userId?: string
  stageId?: string
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
  briefId: string
  type: 'submission'
  content: string
  status: 'pending' | 'approved' | 'rejected'
  metadata?: SubmissionMetadata
  createdAt: Date
  updatedAt: Date
} 