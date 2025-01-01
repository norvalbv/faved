export interface BaseAnalysisResult {
  score: number
  confidence: number
}

export interface AnalyzerConfig {
  temperature?: number
  maxTokens?: number
  model?: string
}

export type ReviewStatus = 'pending_review' | 'approved' | 'rejected'

export interface ReviewResult {
  status: ReviewStatus
  reason: string
  nextSteps?: string[]
} 