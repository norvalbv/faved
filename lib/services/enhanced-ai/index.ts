import OpenAI from 'openai'
import { Brief } from '@/lib/types/brief'
import { Submission } from '@/lib/types/submission'
import { AnalysisResult } from '@/lib/types/analysis'
import { ImportanceWeights } from '@/lib/types/calibration'
import { EnhancedAIServiceDeps } from './types'
import { AnalysisCache } from './utils/cache'
import { RetryHandler } from './utils/retry'
import { ExampleSelector } from './services/example-selector'
import { PromptBuilder } from './services/prompt-builder'
import { AnalysisProcessor } from './services/analysis-processor'
import { defaultAIConfig, defaultExampleConfig, defaultPromptConfig } from './config/default'

export class EnhancedAIService {
  private readonly openai: OpenAI
  private readonly cache: AnalysisCache
  private readonly retryHandler: RetryHandler
  private readonly exampleSelector: ExampleSelector
  private readonly promptBuilder: PromptBuilder
  private readonly analysisProcessor: AnalysisProcessor

  constructor(deps?: Partial<EnhancedAIServiceDeps>) {
    const config = { ...defaultAIConfig, ...deps?.config }
    const exampleConfig = { ...defaultExampleConfig, ...deps?.exampleConfig }
    const promptConfig = { ...defaultPromptConfig, ...deps?.promptConfig }

    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    })

    this.cache = new AnalysisCache(config.cacheTTL)
    this.retryHandler = new RetryHandler(config.maxRetries)
    this.exampleSelector = new ExampleSelector(exampleConfig)
    this.promptBuilder = new PromptBuilder(promptConfig)
    this.analysisProcessor = new AnalysisProcessor()
  }

  async analyzeSubmission(
    submission: Submission,
    brief: Brief,
    weights: ImportanceWeights
  ): Promise<AnalysisResult> {
    try {
      const cacheKey = this.cache.generateKey(submission.id, brief.id, weights)
      const cachedResult = this.cache.get(cacheKey)
      if (cachedResult) return cachedResult

      const examples = await this.exampleSelector.getCalibrationExamples(brief.id, submission)
      const systemPrompt = this.promptBuilder.buildSystemPrompt()
      const userPrompt = this.promptBuilder.buildUserPrompt(submission, brief, weights, examples)

      const response = await this.retryHandler.withRetry(() => 
        this.openai.chat.completions.create({
          model: defaultAIConfig.model,
          temperature: defaultAIConfig.temperature,
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt }
          ],
          response_format: { type: "json_object" }
        })
      )

      const rawAnalysis = JSON.parse(response.choices[0].message.content || '{}')
      const analysis = this.analysisProcessor.processAnalysis(rawAnalysis)
      const weightedAnalysis = this.analysisProcessor.applyWeights(analysis, weights)

      this.cache.set(cacheKey, weightedAnalysis)
      return weightedAnalysis
    } catch (error) {
      console.error('Enhanced AI analysis failed:', error)
      return this.analysisProcessor.getDefaultResult()
    }
  }
}

// Export singleton instance
export const enhancedAiService = new EnhancedAIService() 