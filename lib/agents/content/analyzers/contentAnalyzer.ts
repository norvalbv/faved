import OpenAI from 'openai'
import { ContentAnalysisResult } from '../types'
import { AnalyzerConfig } from '../../shared/types'
import { Submission } from '../../../types/submission'
import { Brief } from '../../../types/brief'

export class ContentAnalyzer {
  private openai: OpenAI
  private config: Required<AnalyzerConfig>

  constructor(
    apiKey: string,
    config: AnalyzerConfig = {}
  ) {
    this.openai = new OpenAI({ apiKey })
    this.config = {
      temperature: config.temperature ?? 0.5,
      maxTokens: config.maxTokens ?? 1000,
      model: config.model ?? 'gpt-4'
    }
  }

  async analyze(submission: Submission, brief: Brief): Promise<ContentAnalysisResult> {
    const prompt = this.buildPrompt(submission, brief)
    
    try {
      const response = await this.openai.chat.completions.create({
        model: this.config.model,
        messages: [
          {
            role: 'system',
            content: `You are a content quality specialist analyzing submissions for effectiveness and selling points.
            
ANALYSIS FRAMEWORK:
1. Content Quality
   - Clarity (0-100)
   - Engagement (0-100)
   - Technical Accuracy (0-100)

2. Selling Points
   - Key messages present
   - Missing elements
   - Overall effectiveness (0-100)

RESPONSE FORMAT:
{{quality}}
clarity: [0-100]
engagement: [0-100]
technical_accuracy: [0-100]
strengths: [comma separated list]
improvements: [comma separated list]
tone: [comma separated list]
score: [0-100]
confidence: [0-100]

{{selling_points}}
present: [comma separated list]
missing: [comma separated list]
effectiveness: [0-100]
score: [0-100]
confidence: [0-100]`
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: this.config.temperature,
        max_tokens: this.config.maxTokens
      })

      return this.parseResponse(response.choices[0].message.content || '')
    } catch (error) {
      console.error('Content analysis failed:', error)
      return this.getErrorResult()
    }
  }

  private buildPrompt(submission: Submission, brief: Brief): string {
    return `Analyze this submission for content quality and effectiveness:

BRIEF:
${brief.title}
${brief.description}
${JSON.stringify(brief.metadata, null, 2)}

SUBMISSION:
${submission.content}`
  }

  private parseResponse(response: string): ContentAnalysisResult {
    const qualityMatch = response.match(/{{quality}}([\s\S]*?)(?={{|$)/)
    const sellingPointsMatch = response.match(/{{selling_points}}([\s\S]*?)(?={{|$)/)
    
    const quality = {
      clarity: 0,
      engagement: 0,
      technicalAccuracy: 0,
      strengths: [] as readonly string[],
      improvements: [] as readonly string[],
      tone: [] as readonly string[],
      score: 0,
      confidence: 0
    }

    const sellingPoints = {
      present: [] as readonly string[],
      missing: [] as readonly string[],
      effectiveness: 0,
      score: 0,
      confidence: 0
    }

    if (qualityMatch) {
      const qualityLines = qualityMatch[1].trim().split('\n')
      qualityLines.forEach(line => {
        const [key, value] = line.split(':').map(s => s.trim())
        switch (key) {
          case 'clarity':
            quality.clarity = parseInt(value)
            break
          case 'engagement':
            quality.engagement = parseInt(value)
            break
          case 'technical_accuracy':
            quality.technicalAccuracy = parseInt(value)
            break
          case 'strengths':
            quality.strengths = value.split(',').map(i => i.trim()).filter(Boolean)
            break
          case 'improvements':
            quality.improvements = value.split(',').map(i => i.trim()).filter(Boolean)
            break
          case 'tone':
            quality.tone = value.split(',').map(i => i.trim()).filter(Boolean)
            break
          case 'score':
            quality.score = parseInt(value)
            break
          case 'confidence':
            quality.confidence = parseInt(value)
            break
        }
      })
    }

    if (sellingPointsMatch) {
      const sellingPointsLines = sellingPointsMatch[1].trim().split('\n')
      sellingPointsLines.forEach(line => {
        const [key, value] = line.split(':').map(s => s.trim())
        switch (key) {
          case 'present':
            sellingPoints.present = value.split(',').map(i => i.trim()).filter(Boolean)
            break
          case 'missing':
            sellingPoints.missing = value.split(',').map(i => i.trim()).filter(Boolean)
            break
          case 'effectiveness':
            sellingPoints.effectiveness = parseInt(value)
            break
          case 'score':
            sellingPoints.score = parseInt(value)
            break
          case 'confidence':
            sellingPoints.confidence = parseInt(value)
            break
        }
      })
    }

    return {
      quality,
      sellingPoints
    }
  }

  private getErrorResult(): ContentAnalysisResult {
    return {
      quality: {
        clarity: 0,
        engagement: 0,
        technicalAccuracy: 0,
        strengths: [],
        improvements: ['Analysis failed'],
        tone: [],
        score: 0,
        confidence: 0
      },
      sellingPoints: {
        present: [],
        missing: ['Analysis failed'],
        effectiveness: 0,
        score: 0,
        confidence: 0
      }
    }
  }
} 