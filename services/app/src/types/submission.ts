export type SubmissionType = "video_topic" | "draft_script" | "draft_video" | "live_video"
export type SubmissionStatus = "pending" | "approved" | "rejected"

export interface Submission {
  id: string
  briefId: string
  type: SubmissionType
  content: string
  status: SubmissionStatus
  feedback?: string
  createdAt: Date
  updatedAt: Date
  influencerId: string
}

export interface SubmissionFeedback {
  id: string
  submissionId: string
  content: string
  type: "correction" | "suggestion" | "approval"
  createdAt: Date
  reviewerId: string
} 