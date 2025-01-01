import { BaseAnalysisResult } from '../../shared/types'

export interface ContentQualityResult extends BaseAnalysisResult {
  clarity: number
  engagement: number
  technicalAccuracy: number
  strengths: readonly string[]
  improvements: readonly string[]
  tone: readonly string[]
}

export interface SellingPointsResult extends BaseAnalysisResult {
  present: readonly string[]
  missing: readonly string[]
  effectiveness: number
}

export interface ContentAnalysisResult {
  quality: ContentQualityResult
  sellingPoints: SellingPointsResult
} 