import OpenAI from 'openai'
import { BrandAnalysisResult, BrandSafetyResult, BrandAlignmentResult } from '../types'
import { AnalyzerConfig } from '../../shared/types'
import { Submission } from '../../../types/submission'
import { Brief } from '../../../types/brief'

export class BrandAnalyzer {
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
      model: config.model ?? 'gpt-4o-mini'
    }
  }

  async analyze(submission: Submission, brief: Brief): Promise<BrandAnalysisResult> {
    const prompt = this.buildPrompt(submission, brief)
    
    try {
      const response = await this.openai.chat.completions.create({
        model: this.config.model,
        messages: [
          {
            role: 'system',
            content: `You are a brand alignment specialist analyzing content against brand guidelines.
            
ANALYSIS FRAMEWORK:
1. Brand Safety
   - Check for inappropriate content
   - Verify professional standards
   - Assess risk factors

2. Brand Alignment
   - Tone and voice consistency (0-100)
   - Value proposition alignment (0-100)
   - Target audience match (0-100)

RESPONSE FORMAT:
{{brand_safety}}
pass: [true/false]
issues: [comma separated list]
score: [0-100]
confidence: [0-100]

{{brand_alignment}}
tone_match: [0-100]
value_alignment: [0-100]
audience_match: [0-100]
issues: [comma separated list]
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
      console.error('Brand analysis failed:', error)
      return this.getErrorResult()
    }
  }

  private buildPrompt(submission: Submission, brief: Brief): string {
    return `Analyze this submission for brand alignment:

BRIEF:
${brief.title}
${brief.description}
${JSON.stringify(brief.metadata, null, 2)}

SUBMISSION:
${submission.content}`
  }

  private parseResponse(response: string): BrandAnalysisResult {
    const safetyMatch = response.match(/{{brand_safety}}([\s\S]*?)(?={{|$)/)
    const alignmentMatch = response.match(/{{brand_alignment}}([\s\S]*?)(?={{|$)/)
    
    const safety: BrandSafetyResult = {
      pass: true,
      issues: [] as readonly string[],
      score: 0,
      confidence: 0
    }

    const alignment: BrandAlignmentResult = {
      toneMatch: 0,
      valueAlignment: 0,
      audienceMatch: 0,
      issues: [] as readonly string[],
      score: 0,
      confidence: 0
    }

    if (safetyMatch) {
      const safetyLines = safetyMatch[1].trim().split('\n')
      let tempIssues: string[] = []
      
      safetyLines.forEach(line => {
        const [key, value] = line.split(':').map(s => s.trim())
        switch (key) {
          case 'pass':
            safety.pass = value === 'true'
            break
          case 'issues':
            tempIssues = value.split(',').map(i => i.trim()).filter(Boolean)
            break
          case 'score':
            safety.score = parseInt(value)
            break
          case 'confidence':
            safety.confidence = parseInt(value)
            break
        }
      })
      
      safety.issues = tempIssues
    }

    if (alignmentMatch) {
      const alignmentLines = alignmentMatch[1].trim().split('\n')
      let tempIssues: string[] = []
      
      alignmentLines.forEach(line => {
        const [key, value] = line.split(':').map(s => s.trim())
        switch (key) {
          case 'tone_match':
            alignment.toneMatch = parseInt(value)
            break
          case 'value_alignment':
            alignment.valueAlignment = parseInt(value)
            break
          case 'audience_match':
            alignment.audienceMatch = parseInt(value)
            break
          case 'issues':
            tempIssues = value.split(',').map(i => i.trim()).filter(Boolean)
            break
          case 'score':
            alignment.score = parseInt(value)
            break
          case 'confidence':
            alignment.confidence = parseInt(value)
            break
        }
      })
      
      alignment.issues = tempIssues
    }

    return {
      safety,
      alignment
    }
  }

  private getErrorResult(): BrandAnalysisResult {
    return {
      safety: {
        pass: false,
        issues: ['Analysis failed'] as readonly string[],
        score: 0,
        confidence: 0
      },
      alignment: {
        toneMatch: 0,
        valueAlignment: 0,
        audienceMatch: 0,
        issues: ['Analysis failed'] as readonly string[],
        score: 0,
        confidence: 0
      }
    }
  }
} 