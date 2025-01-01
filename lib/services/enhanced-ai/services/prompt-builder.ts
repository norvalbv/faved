import { Brief } from '@/lib/types/brief'
import { Submission } from '@/lib/types/submission'
import { ImportanceWeights } from '@/lib/types/calibration'
import { CalibrationExample, PromptConfig } from '../types'

export class PromptBuilder {
  private readonly config: PromptConfig

  constructor(config: PromptConfig) {
    this.config = config
  }

  buildSystemPrompt(): string {
    return this.config.systemPrompt
  }

  buildUserPrompt(
    submission: Submission,
    brief: Brief,
    weights: ImportanceWeights,
    examples: CalibrationExample[]
  ): string {
    const briefContext = this.buildBriefContext(brief)
    const examplesContext = this.buildExamplesContext(examples)
    const weightsContext = this.buildWeightsContext(weights)
    const analysisInstructions = this.buildAnalysisInstructions(weights)

    return this.config.userPromptTemplate
      .replace('{{briefContext}}', briefContext)
      .replace('{{examplesContext}}', examplesContext)
      .replace('{{weightsContext}}', weightsContext)
      .replace('{{analysisInstructions}}', analysisInstructions)
      .replace('{{submissionContent}}', submission.content)
  }

  private buildBriefContext(brief: Brief): string {
    return `
Brief Type: ${brief.type}
Target Audience: ${brief.metadata?.targetAudience || 'Not specified'}
Key Requirements:
${brief.metadata?.requirements?.map(r => `- ${r}`).join('\n') || 'None specified'}

Style Guidelines:
${brief.metadata?.guidelines ? JSON.stringify(brief.metadata.guidelines, null, 2) : 'None specified'}
    `.trim()
  }

  private buildExamplesContext(examples: CalibrationExample[]): string {
    return examples.map(e => `
Example ${e.approved ? '(APPROVED)' : '(REJECTED)'}:
Content:
"""
${e.content}
"""
Feedback: ${e.feedback}
Key Metrics:
- Content Quality: ${e.analysis?.contentQuality ?? 'N/A'}
- Brand Safety: ${e.analysis?.brandSafety ?? 'N/A'}
- Effectiveness: ${e.analysis?.effectiveness ?? 'N/A'}
    `.trim()).join('\n\n')
  }

  private buildWeightsContext(weights: ImportanceWeights): string {
    return `
- Content Quality: ${weights.content * 100}%
- Brand Alignment: ${weights.brandAlignment * 100}%
- Guidelines: ${weights.guidelines * 100}%
- Formatting: ${weights.formatting * 100}%
- Language: ${weights.pronunciation * 100}%
    `.trim()
  }

  private buildAnalysisInstructions(weights: ImportanceWeights): string {
    return `
1. Content Quality (weighted ${weights.content * 100}%)
   - Clarity and engagement level
   - Technical accuracy and depth
   - Structure and formatting quality
   - Compare against approved examples
   - Identify specific strengths and areas for improvement

2. Brand Safety & Alignment (weighted ${weights.brandAlignment * 100}%)
   - Brand voice consistency
   - Guidelines adherence
   - Professional standards
   - Compare with historical patterns
   - Flag any potential issues

3. Effectiveness & Impact (weighted ${weights.guidelines * 100}%)
   - Key message delivery
   - Target audience resonance
   - Call-to-action effectiveness
   - Compare with successful examples
   - Identify missing elements
    `.trim()
  }
} 