import OpenAI from 'openai'
import { BriefAnalysisResult } from '../types'
import { AnalyzerConfig } from '../../shared/types'
import { Submission } from '../../../types/submission'
import { Brief } from '../../../types/brief'

export class BriefAnalyzer {
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

  async analyze(submission: Submission, brief: Brief): Promise<BriefAnalysisResult> {
    const prompt = this.buildPrompt(submission, brief)
    
    try {
      const response = await this.openai.chat.completions.create({
        model: this.config.model,
        messages: [
          {
            role: 'system',
            content: `You are a requirements analyst checking submissions against brief specifications.
            
ANALYSIS FRAMEWORK:
1. Requirements Compliance
   - Core requirements met
   - Missing requirements
   - Guidelines followed
   - Format specifications

RESPONSE FORMAT:
{{compliance}}
requirements_met: [comma separated list]
requirements_missing: [comma separated list]
guidelines_followed: [true/false]
format_correct: [true/false]
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
      console.error('Brief analysis failed:', error)
      return this.getErrorResult()
    }
  }

  private buildPrompt(submission: Submission, brief: Brief): string {
    return `Analyze this submission for requirements compliance:

BRIEF:
${brief.title}
${brief.description}
${JSON.stringify(brief.metadata, null, 2)}

SUBMISSION:
${submission.content}`
  }

  private parseResponse(response: string): BriefAnalysisResult {
    const complianceMatch = response.match(/{{compliance}}([\s\S]*?)(?={{|$)/)
    
    const compliance = {
      requirementsMet: [] as readonly string[],
      requirementsMissing: [] as readonly string[],
      guidelinesFollowed: false,
      formatCorrect: false,
      score: 0,
      confidence: 0
    }

    if (complianceMatch) {
      const complianceLines = complianceMatch[1].trim().split('\n')
      complianceLines.forEach(line => {
        const [key, value] = line.split(':').map(s => s.trim())
        switch (key) {
          case 'requirements_met':
            compliance.requirementsMet = value.split(',').map(i => i.trim()).filter(Boolean)
            break
          case 'requirements_missing':
            compliance.requirementsMissing = value.split(',').map(i => i.trim()).filter(Boolean)
            break
          case 'guidelines_followed':
            compliance.guidelinesFollowed = value === 'true'
            break
          case 'format_correct':
            compliance.formatCorrect = value === 'true'
            break
          case 'score':
            compliance.score = parseInt(value)
            break
          case 'confidence':
            compliance.confidence = parseInt(value)
            break
        }
      })
    }

    return {
      compliance
    }
  }

  private getErrorResult(): BriefAnalysisResult {
    return {
      compliance: {
        requirementsMet: [],
        requirementsMissing: ['Analysis failed'],
        guidelinesFollowed: false,
        formatCorrect: false,
        score: 0,
        confidence: 0
      }
    }
  }
} 