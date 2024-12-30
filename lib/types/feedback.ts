export type FeedbackType = 'suggestion' | 'correction' | 'approval' | 'rejection'

export interface Feedback {
  id: string
  submissionId: string
  type: FeedbackType
  content: string
  createdAt: Date
  updatedAt: Date
} 