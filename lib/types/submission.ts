export interface SubmissionMetadata {
  sender?: string
  message?: string
  type?: string
  stageId?: string
  campaignId?: string
  approved?: boolean
  status?: 'pending' | 'approved' | 'rejected'
  input?: string
  userId?: string
  submitted?: boolean
  createdAt?: string
  feedbackHistory: Array<{
    feedback: string
    createdAt: string
    status: 'comment' | 'changes_requested' | 'approved' | 'rejected'
    isAiFeedback?: boolean
    aiMetadata?: {
      scores: {
        contentQuality: number
        brandSafety: number
        effectiveness: number
      }
      confidence: number
      nextSteps: readonly string[]
    }
  }>
  aiAnalysis?: {
    reviewScore: number
    confidence: number
    contentQuality: number
    effectiveness: number
  }
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