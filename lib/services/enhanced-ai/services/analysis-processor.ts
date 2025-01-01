import { AnalysisResult, DEFAULT_ANALYSIS_RESULT } from '../types'
import { ImportanceWeights } from '@/lib/types/calibration'

export class AnalysisProcessor {
  processAnalysis(rawAnalysis: Partial<AnalysisResult>): AnalysisResult {
    return {
      ...DEFAULT_ANALYSIS_RESULT,
      ...rawAnalysis,
      content: {
        ...DEFAULT_ANALYSIS_RESULT.content,
        ...rawAnalysis.content,
        quality: {
          ...DEFAULT_ANALYSIS_RESULT.content.quality,
          ...(rawAnalysis.content?.quality || {})
        },
        sellingPoints: {
          ...DEFAULT_ANALYSIS_RESULT.content.sellingPoints,
          ...(rawAnalysis.content?.sellingPoints || {})
        }
      },
      brandAlignment: {
        ...DEFAULT_ANALYSIS_RESULT.brandAlignment,
        ...(rawAnalysis.brandAlignment || {})
      },
      brandSafety: {
        ...DEFAULT_ANALYSIS_RESULT.brandSafety,
        ...(rawAnalysis.brandSafety || {})
      }
    }
  }

  applyWeights(analysis: AnalysisResult, weights: ImportanceWeights): AnalysisResult {
    const weightedAnalysis = {
      ...analysis,
      content: {
        ...analysis.content,
        quality: {
          ...analysis.content.quality,
          score: analysis.content.quality.score * weights.content
        },
        sellingPoints: {
          ...analysis.content.sellingPoints,
          score: analysis.content.sellingPoints.score * weights.guidelines
        }
      },
      brandAlignment: {
        ...analysis.brandAlignment,
        score: analysis.brandAlignment.score * weights.brandAlignment
      }
    }

    const overallConfidence = (
      analysis.content.quality.confidence * weights.content +
      analysis.brandAlignment.confidence * weights.brandAlignment +
      analysis.content.sellingPoints.confidence * weights.guidelines
    ) / (weights.content + weights.brandAlignment + weights.guidelines)

    return {
      ...weightedAnalysis,
      brandSafety: {
        ...weightedAnalysis.brandSafety,
        confidence: overallConfidence
      }
    }
  }

  getDefaultResult(): AnalysisResult {
    return { ...DEFAULT_ANALYSIS_RESULT }
  }
} 