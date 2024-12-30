export type SubmissionType = 'video_topic' | 'draft_script' | 'draft_video' | 'live_video'

export interface Submission {
  id: string
  briefId: string
  type: SubmissionType
  content: string
  status: 'pending' | 'approved' | 'rejected'
  feedback?: string[]
  createdAt: Date
  updatedAt: Date
} 