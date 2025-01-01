import { BaseAnalysisResult } from '../../shared/types'

export interface BriefComplianceResult extends BaseAnalysisResult {
  requirementsMet: readonly string[]
  requirementsMissing: readonly string[]
  guidelinesFollowed: boolean
  formatCorrect: boolean
}

export interface BriefAnalysisResult {
  compliance: BriefComplianceResult
} 