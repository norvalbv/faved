export interface SubmissionMetadata {
  sender?: string
  message?: string
  type?: string
  stageId?: string
  campaignId?: string
  approved?: boolean
  status?: 'pending' | 'approved' | 'rejected'
  feedbackHistory: Array<{
    feedback: string
    createdAt: string
    status: 'comment' | 'changes_requested' | 'approved' | 'rejected'
  }>
}

export interface Submission {
  id: string
  projectId: string
  campaignId?: string
  type: string
  content: string
  metadata: SubmissionMetadata
  createdAt: Date
  updatedAt: Date
}

export interface CreateSubmissionData {
  campaignId: string
  type: 'submission'
  content: string
  metadata: Omit<SubmissionMetadata, 'userId'>
}