import { BaseAnalysisResult } from '../../shared/types'

export interface BrandSafetyResult extends BaseAnalysisResult {
  pass: boolean
  issues: readonly string[]
}

export interface BrandAlignmentResult extends BaseAnalysisResult {
  toneMatch: number
  valueAlignment: number
  audienceMatch: number
  issues: readonly string[]
}

export interface BrandAnalysisResult {
  safety: BrandSafetyResult
  alignment: BrandAlignmentResult
} 