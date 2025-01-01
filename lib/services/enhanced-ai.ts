import OpenAI from 'openai'
import { Brief } from '@/lib/types/brief'
import { Submission } from '@/lib/types/submission'
import { AnalysisResult } from '@/lib/types/analysis'
import { ImportanceWeights } from '@/lib/types/calibration'
import { drizzleDb } from '@/lib/data-store'
import { calibrationData } from '@/lib/data-store/schema'
import { eq } from 'drizzle-orm'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

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

interface CalibrationExample {
  content: string
  approved: boolean
  feedback: string
  analysis?: {
    contentQuality?: number
    brandSafety?: number
    effectiveness?: number
  }
}

export class EnhancedAIService {
  private async getCalibrationExamples(briefId: string): Promise<CalibrationExample[]> {
    const examples = await drizzleDb.query.calibrationData.findMany({
      where: eq(calibrationData.briefId, briefId),
      limit: 5, // Start with 5 examples, we can adjust this
    })

    return examples.map(example => ({
      content: example.content,
      approved: example.approved,
      feedback: example.feedback,
      analysis: {
        contentQuality: (example.contentAnalysis as any)?.quality?.score,
        brandSafety: (example.brandAnalysis as any)?.safety?.score,
        effectiveness: (example.contentAnalysis as any)?.sellingPoints?.effectiveness,
      }
    }))
  }

  private buildPromptWithCalibration(
    submission: Submission,
    brief: Brief,
    weights: ImportanceWeights,
    examples: CalibrationExample[]
  ): string {
    const approvedExamples = examples
      .filter(e => e.approved)
      .map(e => `
Content: ${e.content}
Feedback: ${e.feedback}
Scores: ${e.analysis ? JSON.stringify(e.analysis, null, 2) : 'Not available'}
      `.trim())
      .join('\n\n')

    const rejectedExamples = examples
      .filter(e => !e.approved)
      .map(e => `
Content: ${e.content}
Feedback: ${e.feedback}
Scores: ${e.analysis ? JSON.stringify(e.analysis, null, 2) : 'Not available'}
      `.trim())
      .join('\n\n')

    return `You are an AI content analyzer calibrated with historical data. Analyze content based on brand guidelines, briefs, and past examples.

BRIEF DETAILS:
Title: ${brief.title}
Description: ${brief.description}
Requirements: ${JSON.stringify(brief.metadata?.requirements || [], null, 2)}
Guidelines: ${JSON.stringify(brief.metadata?.guidelines || {}, null, 2)}

IMPORTANCE WEIGHTS:
Content Quality: ${weights.content * 100}%
Brand Alignment: ${weights.brandAlignment * 100}%
Guidelines Adherence: ${weights.guidelines * 100}%
Formatting & Structure: ${weights.formatting * 100}%
Language & Tone: ${weights.pronunciation * 100}%

HISTORICAL APPROVED EXAMPLES:
${approvedExamples || 'No approved examples available'}

HISTORICAL REJECTED EXAMPLES:
${rejectedExamples || 'No rejected examples available'}

CONTENT TO ANALYZE:
${submission.content}

Analyze the submission considering:
1. Content Quality (weighted ${weights.content * 100}%)
   - Clarity and engagement
   - Technical accuracy
   - Structure and formatting
   - Compare with approved examples

2. Brand Safety & Alignment (weighted ${weights.brandAlignment * 100}%)
   - Brand voice consistency
   - Guidelines adherence
   - Professional standards
   - Compare with historical brand alignment patterns

3. Effectiveness (weighted ${weights.guidelines * 100}%)
   - Key message delivery
   - Target audience fit
   - Call-to-action clarity
   - Compare with successful examples

Return a JSON object with scores and detailed feedback, maintaining the exact structure specified.`
  }

  async analyzeSubmission(
    submission: Submission,
    brief: Brief,
    weights: ImportanceWeights
  ): Promise<AnalysisResult> {
    try {
      // Get calibration examples
      const examples = await this.getCalibrationExamples(brief.id)
      
      // Build calibrated prompt
      const prompt = this.buildPromptWithCalibration(submission, brief, weights, examples)

      // Get AI analysis
      const response = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        temperature: 0.2,
        messages: [
          {
            role: 'system',
            content: `You are a calibrated AI content analyzer. Return only valid JSON matching this exact structure:
{
  "brandSafety": {
    "score": number,
    "issues": string[],
    "confidence": number
  },
  "content": {
    "quality": {
      "score": number,
      "clarity": number,
      "engagement": number,
      "confidence": number,
      "technicalAccuracy": number,
      "tone": string[],
      "strengths": string[],
      "improvements": string[]
    },
    "sellingPoints": {
      "score": number,
      "confidence": number,
      "effectiveness": number,
      "present": string[],
      "missing": string[]
    }
  },
  "brandAlignment": {
    "score": number,
    "confidence": number,
    "alignment": string[],
    "misalignment": string[]
  }
}`
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        response_format: { type: "json_object" }
      })

      // Parse and validate response
      const rawAnalysis = JSON.parse(response.choices[0].message.content || '{}')
      
      // Ensure the response has the correct structure
      const analysis: AnalysisResult = {
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

      // Apply importance weights to scores
      const weightedAnalysis = this.applyWeights(analysis, weights)

      return weightedAnalysis
    } catch (error) {
      console.error('Enhanced AI analysis failed:', error)
      return DEFAULT_ANALYSIS_RESULT
    }
  }

  private applyWeights(analysis: AnalysisResult, weights: ImportanceWeights): AnalysisResult {
    // Apply weights to relevant scores
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

    // Calculate overall confidence based on weights
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
}

// Export singleton instance
export const enhancedAiService = new EnhancedAIService() 