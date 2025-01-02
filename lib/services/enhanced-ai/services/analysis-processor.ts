import { AnalysisResult, DEFAULT_ANALYSIS_RESULT } from '../types'
import { ImportanceWeights } from '@/lib/types/calibration'

export class AnalysisProcessor {
  processAnalysis(rawAnalysis: Partial<AnalysisResult>): AnalysisResult {
    // Helper function to round scores
    const roundScore = (score: number) => Math.round(score)

    // Process the raw analysis
    const processed = {
      ...DEFAULT_ANALYSIS_RESULT,
      ...rawAnalysis,
      content: {
        ...DEFAULT_ANALYSIS_RESULT.content,
        ...rawAnalysis.content,
        quality: {
          ...DEFAULT_ANALYSIS_RESULT.content.quality,
          ...(rawAnalysis.content?.quality || {}),
          // Round all numeric scores
          score: roundScore(rawAnalysis.content?.quality?.score || 0),
          clarity: roundScore(rawAnalysis.content?.quality?.clarity || 0),
          engagement: roundScore(rawAnalysis.content?.quality?.engagement || 0),
          technicalAccuracy: roundScore(rawAnalysis.content?.quality?.technicalAccuracy || 0)
        },
        sellingPoints: {
          ...DEFAULT_ANALYSIS_RESULT.content.sellingPoints,
          ...(rawAnalysis.content?.sellingPoints || {}),
          score: roundScore(rawAnalysis.content?.sellingPoints?.score || 0),
          effectiveness: roundScore(rawAnalysis.content?.sellingPoints?.effectiveness || 0)
        }
      },
      brandAlignment: {
        ...DEFAULT_ANALYSIS_RESULT.brandAlignment,
        ...(rawAnalysis.brandAlignment || {}),
        score: roundScore(rawAnalysis.brandAlignment?.score || 0)
      },
      brandSafety: {
        ...DEFAULT_ANALYSIS_RESULT.brandSafety,
        ...(rawAnalysis.brandSafety || {}),
        score: roundScore(rawAnalysis.brandSafety?.score || 0)
      }
    }

    return processed
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