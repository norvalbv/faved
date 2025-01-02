import { CalibrationData } from '@/lib/data-store/schema'
import { AnalysisResult } from '../types'

interface ExtendedCalibrationData extends CalibrationData {
  analysis?: AnalysisResult
}

export class CalibrationProcessor {
  /**
   * Analyzes a collection of calibration data to identify patterns and insights
   * from successful submissions. This helps establish benchmarks and guidelines
   * for future content evaluation.
   */
  processCalibrationData(data: ExtendedCalibrationData[]): string {
    // Only analyze approved submissions to identify successful patterns
    const approvedData = data.filter(item => item.approved)
    
    // Extract recurring patterns across different content dimensions
    const patterns = this.extractCommonPatterns(approvedData)
    
    // Convert the patterns into a structured prompt format
    return this.formatPatternsForPrompt(patterns)
  }

  private extractCommonPatterns(data: ExtendedCalibrationData[]) {
    // Initialize pattern tracking for different content aspects
    const patterns = {
      contentPatterns: new Map<string, number>(), // Tracks content quality indicators
      brandPatterns: new Map<string, number>(),   // Tracks brand alignment elements
      stylePatterns: new Map<string, number>(),   // Tracks writing style/tone patterns
      successFactors: new Map<string, number>()   // Tracks characteristics of high-scoring content
    }

    data.forEach(item => {
      // Aggregate content quality strengths
      if (item.analysis?.content?.quality) {
        const quality = item.analysis.content.quality
        quality.strengths?.forEach((strength: string) => {
          const count = patterns.contentPatterns.get(strength) || 0
          patterns.contentPatterns.set(strength, count + 1)
        })
      }

      // Track successful brand alignment strategies
      if (item.analysis?.brandAlignment) {
        const alignment = item.analysis.brandAlignment
        alignment.alignment?.forEach((point: string) => {
          const count = patterns.brandPatterns.get(point) || 0
          patterns.brandPatterns.set(point, count + 1)
        })
      }

      // Record effective writing tones and styles
      if (item.analysis?.content?.quality?.tone) {
        item.analysis.content.quality.tone.forEach((tone: string) => {
          const count = patterns.stylePatterns.get(tone) || 0
          patterns.stylePatterns.set(tone, count + 1)
        })
      }

      // Identify success factors from high-performing content (85+ score)
      const score = item.analysis?.content?.quality?.score
      if (score && score >= 85) {
        const factors = this.extractSuccessFactors(item)
        factors.forEach(factor => {
          const count = patterns.successFactors.get(factor) || 0
          patterns.successFactors.set(factor, count + 1)
        })
      }
    })

    return patterns
  }

  /**
   * Extracts key success indicators from high-performing content
   * Looks at multiple dimensions including quality, clarity, engagement,
   * selling points effectiveness, and brand alignment
   */
  private extractSuccessFactors(item: ExtendedCalibrationData): string[] {
    const factors: string[] = []
    const analysis = item.analysis

    if (!analysis) return factors

    const quality = analysis.content?.quality
    const sellingPoints = analysis.content?.sellingPoints
    const brandAlignment = analysis.brandAlignment

    // Identify exceptional performance metrics (85+ threshold)
    if (quality?.score && quality.score >= 85) {
      factors.push('High content quality score')
    }
    if (quality?.clarity && quality.clarity >= 85) {
      factors.push('Excellent clarity')
    }
    if (quality?.engagement && quality.engagement >= 85) {
      factors.push('Strong engagement')
    }
    if (sellingPoints?.effectiveness && sellingPoints.effectiveness >= 85) {
      factors.push('Effective selling points')
    }
    if (brandAlignment?.score && brandAlignment.score >= 85) {
      factors.push('Strong brand alignment')
    }

    return factors
  }

  /**
   * Formats identified patterns into a structured prompt that highlights
   * the most frequent and successful content characteristics
   */
  private formatPatternsForPrompt(patterns: {
    contentPatterns: Map<string, number>
    brandPatterns: Map<string, number>
    stylePatterns: Map<string, number>
    successFactors: Map<string, number>
  }): string {
    const formatTopPatterns = (patterns: Map<string, number>, count: number) => {
      return Array.from(patterns.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, count)
        .map(([pattern, count]) => `- ${pattern} (found in ${count} successful submissions)`)
        .join('\n')
    }

    return `
Based on analysis of successful submissions, here are the key patterns:

Content Quality Patterns:
${formatTopPatterns(patterns.contentPatterns, 5)}

Brand Alignment Patterns:
${formatTopPatterns(patterns.brandPatterns, 5)}

Effective Style Elements:
${formatTopPatterns(patterns.stylePatterns, 5)}

Key Success Factors:
${formatTopPatterns(patterns.successFactors, 5)}
`.trim()
  }
} 