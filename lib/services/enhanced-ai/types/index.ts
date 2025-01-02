import { ImportanceWeights } from '@/lib/types/calibration'
import { Brief } from '@/lib/types/brief'
import { Submission } from '@/lib/types/submission'
import { StructuredInsights } from '@/lib/types/calibration'

export type { Brief, Submission }

export interface CacheEntry {
  result: AnalysisResult
  timestamp: number
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

export interface ContentQuality {
  score: number
  clarity: number
  engagement: number
  confidence: number
  technicalAccuracy: number
  tone: string[]
  strengths: string[]
  improvements: string[]
}

export interface SellingPoints {
  score: number
  confidence: number
  effectiveness: number
  present: string[]
  missing: string[]
}

export interface BrandSafety {
  score: number
  issues: string[]
  confidence: number
}

export interface BrandAlignment {
  score: number
  confidence: number
  alignment: string[]
  misalignment: string[]
}

export interface AnalysisResult {
  content: {
    quality: ContentQuality
    sellingPoints: SellingPoints
  }
  brandSafety: BrandSafety
  brandAlignment: BrandAlignment
  summary: string
  insights: StructuredInsights
  metadata: {
    timestamp: number
    approvedCount: number
    totalAnalyzed: number
  }
}

export interface PromptConfig {
  model: string
  temperature: number
  maxTokens: number
  analysisPrompt: string
  summaryPrompt: string
}

export interface ExampleSelectionConfig {
  maxExamples: number
  approvedRatio: number
  minSimilarity: number
}

export interface AIServiceConfig {
  model: string
  temperature: number
  maxRetries: number
  cacheTTL: number
}

export const DEFAULT_ANALYSIS_RESULT: AnalysisResult = {
  brandSafety: {
    score: 0,
    issues: [],
    confidence: 0,
  },
  content: {
    quality: {
      score: 0,
      clarity: 0,
      engagement: 0,
      confidence: 0,
      technicalAccuracy: 0,
      tone: [],
      strengths: [],
      improvements: [],
    },
    sellingPoints: {
      score: 0,
      confidence: 0,
      effectiveness: 0,
      present: [],
      missing: [],
    },
  },
  brandAlignment: {
    score: 0,
    confidence: 0,
    alignment: [],
    misalignment: [],
  },
  summary: '',
  insights: {
    historicalContext: '',
    sections: [],
    metadata: {
      totalAnalyzed: 0,
      approvedCount: 0,
      timestamp: Date.now()
    }
  },
  metadata: {
    timestamp: Date.now(),
    approvedCount: 0,
    totalAnalyzed: 0
  }
}

export interface EnhancedAIServiceInterface {
  analyzeSubmission(
    submission: Submission,
    brief: Brief,
    weights: ImportanceWeights
  ): Promise<AnalysisResult & { summary: string }>
} 