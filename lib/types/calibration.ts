import { CalibrationData } from '@/lib/data-store/schema/calibration'

export interface ImportanceWeights {
  content: number
  brandAlignment: number
  guidelines: number
  formatting: number
  pronunciation: number
}

export interface ActionableInsight {
  title: string
  points: string[]
  context?: string
}

export interface StructuredInsights {
  historicalContext: string
  sections: ActionableInsight[]
  metadata: {
    totalAnalyzed: number
    approvedCount: number
    timestamp: number
  }
}

export interface CalibrationExample {
  content: string
  approved: boolean
  feedback: string
  analysis?: {
    contentQuality?: number
    brandSafety?: number
    effectiveness?: number
  }
} 