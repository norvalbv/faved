import { ImportanceWeights } from '@/lib/types/calibration'
import OpenAI from 'openai'
import { AnalysisResult, Brief, Submission, DEFAULT_ANALYSIS_RESULT } from './types'
import { InsightsGenerator } from './services/insights-generator'
import { PromptBuilder } from './services/prompt-builder'
import { CalibrationProcessor } from './services/calibration-processor'
import { AnalysisProcessor } from './services/analysis-processor'
import { ExampleSelector } from './services/example-selector'
import { drizzleDb } from '@/lib/data-store'
import { calibrationWeights } from '@/lib/data-store/schema'
import { eq } from 'drizzle-orm'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export class EnhancedAIService {
  private insightsGenerator: InsightsGenerator
  private promptBuilder: PromptBuilder
  private calibrationProcessor: CalibrationProcessor
  private analysisProcessor: AnalysisProcessor
  private exampleSelector: ExampleSelector

  constructor() {
    this.calibrationProcessor = new CalibrationProcessor()
    this.insightsGenerator = new InsightsGenerator()
    this.promptBuilder = new PromptBuilder({
      model: 'gpt-4-1106-preview',
      temperature: 0.7,
      maxTokens: 1000,
      analysisPrompt: `Analyze the following content based on historical patterns and brief requirements:

Content: {submission}
Brief: {brief}
Historical Context: {calibrationContext}
Priority Context: {priorityContext}
Analysis Instructions: {analysisInstructions}`,
      summaryPrompt: `Provide a concise, actionable summary focusing on the most important aspects based on the weights and historical patterns.`
    })
    this.analysisProcessor = new AnalysisProcessor()
    this.exampleSelector = new ExampleSelector({
      maxExamples: 20,
      approvedRatio: 0.6,
      minSimilarity: 0.1
    })
  }

  async analyzeSubmission(
    submission: Submission,
    brief: Brief,
    weights: ImportanceWeights
  ): Promise<AnalysisResult & { summary: string; feedbackHistory: any[] }> {
    try {
      // Get calibration examples using the example selector
      const examples = await this.exampleSelector.getCalibrationExamples(brief.id, submission)
      
      // Get calibration weights from database
      const dbWeights = await drizzleDb.query.calibrationWeights.findFirst({
        where: eq(calibrationWeights.briefId, brief.id)
      })

      // Use calibration weights if available, otherwise use provided weights
      const effectiveWeights: ImportanceWeights = dbWeights?.weights as ImportanceWeights || weights
      
      // Build prompt using the prompt builder
      const prompt = this.promptBuilder.buildAnalysisPrompt(
        submission,
        brief,
        effectiveWeights,
        examples.map(e => ({
          id: '',
          submissionId: null,
          briefId: brief.id,
          content: e.content,
          approved: e.approved,
          feedback: e.feedback,
          metadata: {},
          feedbackAttachments: [],
          brandAnalysis: e.analysis?.brandSafety || {},
          contentAnalysis: {
            quality: { score: e.analysis?.contentQuality || 0 },
            sellingPoints: { effectiveness: e.analysis?.effectiveness || 0 }
          },
          briefAnalysis: {},
          createdAt: new Date(),
          updatedAt: new Date()
        }))
      )

      // Get AI analysis
      const response = await openai.chat.completions.create({
        model: 'gpt-4-1106-preview',
        messages: [
          {
            role: 'system',
            content: `You are a calibrated AI content analyzer. Return only valid JSON matching this exact structure. All scores should be integers between 0 and 100:
{
  "brandSafety": {
    "score": number (0-100),
    "issues": string[],
    "confidence": number (0-100)
  },
  "content": {
    "quality": {
      "score": number (0-100),
      "clarity": number (0-100),
      "engagement": number (0-100),
      "confidence": number (0-100),
      "technicalAccuracy": number (0-100),
      "tone": string[],
      "strengths": string[],
      "improvements": string[]
    },
    "sellingPoints": {
      "score": number (0-100),
      "confidence": number (0-100),
      "effectiveness": number (0-100),
      "present": string[],
      "missing": string[]
    }
  },
  "brandAlignment": {
    "score": number (0-100),
    "confidence": number (0-100),
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

      // Process analysis using the analysis processor
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

      const processedAnalysis = this.analysisProcessor.processAnalysis(analysis)
      const weightedAnalysis = this.analysisProcessor.applyWeights(processedAnalysis, effectiveWeights)
      
      // Generate insights using the insights generator
      const insights = await this.insightsGenerator.generateStructuredInsights(
        submission,
        brief,
        effectiveWeights,
        examples.map(e => ({
          id: '',
          submissionId: null,
          briefId: brief.id,
          content: e.content,
          approved: e.approved,
          feedback: e.feedback,
          metadata: {},
          feedbackAttachments: [],
          brandAnalysis: e.analysis?.brandSafety || {},
          contentAnalysis: {
            quality: { score: e.analysis?.contentQuality || 0 },
            sellingPoints: { effectiveness: e.analysis?.effectiveness || 0 }
          },
          briefAnalysis: {},
          createdAt: new Date(),
          updatedAt: new Date()
        }))
      )

      // Create feedback entry
      const feedback = {
        status: 'comment',
        weights: effectiveWeights,
        analysis: {
          content: {
            quality: {
              tone: weightedAnalysis.content.quality.tone,
              score: weightedAnalysis.content.quality.score,
              clarity: weightedAnalysis.content.quality.clarity,
              strengths: weightedAnalysis.content.quality.strengths,
              confidence: weightedAnalysis.content.quality.confidence,
              engagement: weightedAnalysis.content.quality.engagement,
              improvements: weightedAnalysis.content.quality.improvements,
              technicalAccuracy: weightedAnalysis.content.quality.technicalAccuracy
            },
            sellingPoints: {
              score: weightedAnalysis.content.sellingPoints.score,
              missing: weightedAnalysis.content.sellingPoints.missing,
              present: weightedAnalysis.content.sellingPoints.present,
              confidence: weightedAnalysis.content.sellingPoints.confidence,
              effectiveness: weightedAnalysis.content.sellingPoints.effectiveness
            }
          },
          summary: weightedAnalysis.summary || '',
          insights,
          metadata: insights.metadata
        }
      }
      
      return { 
        ...weightedAnalysis,
        insights,
        feedbackHistory: [feedback]
      }
    } catch (error) {
      console.error('Analysis error:', error)
      return {
        ...DEFAULT_ANALYSIS_RESULT,
        summary: 'Failed to analyze submission. Please try again.',
        feedbackHistory: []
      }
    }
  }
} 