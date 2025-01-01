import { AnalysisResult } from '@/lib/types/analysis'
import { ImportanceWeights } from '@/lib/types/calibration'

const DEFAULT_ANALYSIS_RESULT: AnalysisResult = {
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
}

export class AnalysisProcessor {
  processAnalysis(rawAnalysis: any): AnalysisResult {
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
    return DEFAULT_ANALYSIS_RESULT
  }
} 