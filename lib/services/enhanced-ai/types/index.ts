import { AnalysisResult } from '@/lib/types/analysis'

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

export interface CacheEntry {
  result: AnalysisResult
  timestamp: number
}

export interface AIServiceConfig {
  model: string
  temperature: number
  maxRetries: number
  cacheTTL: number
}

export interface ExampleSelectionConfig {
  maxExamples: number
  approvedRatio: number
  minSimilarity: number
}

export interface PromptConfig {
  systemPrompt: string
  userPromptTemplate: string
}

export interface EnhancedAIServiceDeps {
  config: AIServiceConfig
  exampleConfig: ExampleSelectionConfig
  promptConfig: PromptConfig
} 