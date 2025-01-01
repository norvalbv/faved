import { ImportanceWeights } from '@/lib/types/calibration'
import OpenAI from 'openai'
import { AnalysisResult, Brief, Submission, CalibrationExample, DEFAULT_ANALYSIS_RESULT } from './types'
import { drizzleDb } from '@/lib/data-store'
import { calibrationData } from '@/lib/data-store/schema'
import { eq, desc } from 'drizzle-orm'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export class EnhancedAIService {
  private async getCalibrationExamples(briefId: string): Promise<CalibrationExample[]> {
    const examples = await drizzleDb.query.calibrationData.findMany({
      where: eq(calibrationData.briefId, briefId),
      orderBy: desc(calibrationData.approved),
      limit: 5
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

  private async generateSummary(analysis: AnalysisResult, weights: ImportanceWeights): Promise<string> {
    const prompt = `Based on the following analysis results and importance weights, generate a concise summary:

Analysis Results:
- Content Quality Score: ${analysis.content.quality.score}/100
- Brand Safety Score: ${analysis.brandSafety.score}/100
- Brand Alignment Score: ${analysis.brandAlignment.score}/100
- Selling Points Effectiveness: ${(analysis.content.sellingPoints.effectiveness * 100).toFixed(0)}%

Importance Weights:
${Object.entries(weights)
  .sort(([, a], [, b]) => b - a)
  .map(([key, value]) => `- ${key}: ${(value * 100).toFixed(0)}%`)
  .join('\n')}

Key Strengths:
${analysis.content.quality.strengths.map(s => `- ${s}`).join('\n')}

Areas for Improvement:
${analysis.content.quality.improvements.map(i => `- ${i}`).join('\n')}

Brand Safety Issues:
${analysis.brandSafety.issues.length > 0 ? analysis.brandSafety.issues.map(i => `- ${i}`).join('\n') : 'No safety concerns identified.'}

Missing Key Points:
${analysis.content.sellingPoints.missing.map(p => `- ${p}`).join('\n')}

Generate a concise, actionable summary focusing on the most important aspects based on the weights.`

    const response = await openai.chat.completions.create({
      model: 'gpt-4-1106-preview',
      messages: [
        {
          role: 'system',
          content: 'You are a concise content analyst. Provide a brief, actionable summary focusing on the most important aspects based on the weights.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 250
    })

    return response.choices[0]?.message?.content || 'Failed to generate summary.'
  }

  private applyWeights(analysis: AnalysisResult, weights: ImportanceWeights): AnalysisResult {
    return {
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
  }

  async analyzeSubmission(
    submission: Submission,
    brief: Brief,
    weights: ImportanceWeights
  ): Promise<AnalysisResult & { summary: string }> {
    try {
      // Get calibration examples
      const examples = await this.getCalibrationExamples(brief.id)
      
      // Build calibrated prompt
      const prompt = this.buildPromptWithCalibration(submission, brief, weights, examples)

      // Get AI analysis
      const response = await openai.chat.completions.create({
        model: 'gpt-4-1106-preview',
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
        temperature: 0.7,
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

      // Generate summary
      const summary = await this.generateSummary(weightedAnalysis, weights)

      return { ...weightedAnalysis, summary }
    } catch (error) {
      console.error('Enhanced AI analysis failed:', error)
      return { ...DEFAULT_ANALYSIS_RESULT, summary: 'Analysis failed to generate results.' }
    }
  }
} 