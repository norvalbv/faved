export interface FeedbackMetric {
  label: string
  value: number
  max: number
}

export interface FeedbackSection {
  title: string
  content: string[]
  type?: 'metrics' | 'list' | 'score' | 'header' | 'section_header' | 'subsection'
  metrics?: FeedbackMetric[]
}

export interface ParsedFeedback {
  contentQuality: {
    clarity: number
    engagement: number
    technicalAccuracy: number
    strengths: string[]
    improvements: string[]
  }
  brandSafety: {
    score: number
    confidence: number
    issues: string[]
  }
  brandAlignment: {
    toneMatch: number
    issues: string[]
  }
  sellingPoints: {
    present: string[]
    missing: string[]
  }
} 