import { PromptConfig } from '../types'
import { CalibrationProcessor } from './calibration-processor'
import { CalibrationData } from '@/lib/data-store/schema'
import { Brief } from '@/lib/types/brief'
import { ImportanceWeights } from '@/lib/types/calibration'
import { Submission } from '@/lib/types/submission'

export class PromptBuilder {
  private config: PromptConfig
  private calibrationProcessor: CalibrationProcessor

  constructor(config: PromptConfig) {
    this.config = config
    this.calibrationProcessor = new CalibrationProcessor()
  }

  buildAnalysisPrompt(
    submission: Submission,
    brief: Brief,
    weights: ImportanceWeights,
    calibrationData: CalibrationData[]
  ): string {
    const briefContext = this.buildBriefContext(brief)
    const calibrationContext = this.buildCalibrationContext(calibrationData)
    const priorityContext = this.buildPriorityContext(weights)
    const analysisInstructions = this.buildAnalysisInstructions(weights)

    return this.config.analysisPrompt
      .replace('{submission}', submission.content)
      .replace('{brief}', briefContext)
      .replace('{calibrationContext}', calibrationContext)
      .replace('{priorityContext}', priorityContext)
      .replace('{analysisInstructions}', analysisInstructions)
  }

  buildSummaryPrompt(): string {
    return this.config.summaryPrompt
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

  private buildCalibrationContext(calibrationData: CalibrationData[]): string {
    if (!calibrationData?.length) {
      return 'No historical data is available for analysis. Recommendations will be based on general best practices and brief requirements.'
    }

    const approvedCount = calibrationData.filter(item => item.approved).length
    const patterns = this.calibrationProcessor.processCalibrationData(calibrationData)

    return `
Based on analysis of ${calibrationData.length} previous submissions (${approvedCount} approved):

${patterns}

These patterns should inform the recommendations while considering the current brief requirements.
    `.trim()
  }

  private buildPriorityContext(weights: ImportanceWeights): string {
    // Sort weights by importance
    const sortedWeights = Object.entries(weights)
      .sort(([, a], [, b]) => b - a)
      .map(([key]) => key)

    const priorityMapping = {
      content: 'Content Quality',
      brandAlignment: 'Brand Alignment',
      guidelines: 'Guidelines Adherence',
      formatting: 'Content Formatting',
      pronunciation: 'Language & Pronunciation'
    }

    return `
Analysis Priorities (in order of importance):
${sortedWeights.map((key, i) => `${i + 1}. ${priorityMapping[key as keyof typeof priorityMapping]}`).join('\n')}
    `.trim()
  }

  private buildAnalysisInstructions(weights: ImportanceWeights): string {
    return `
Please analyze the submission focusing on these key areas:

1. Content Quality
   - Clarity and engagement level
   - Technical accuracy and depth
   - Structure and formatting quality
   - Compare against successful examples
   - Identify specific strengths and areas for improvement

2. Brand Safety & Alignment
   - Brand voice consistency
   - Guidelines adherence
   - Professional standards
   - Compare with historical patterns
   - Flag any potential issues

3. Effectiveness & Impact
   - Key message delivery
   - Target audience resonance
   - Call-to-action effectiveness
   - Compare with successful examples
   - Identify missing elements

Provide specific, actionable recommendations that:
1. Reference historical patterns and successful examples when available
2. Focus on concrete, implementable improvements
3. Prioritize the most important areas for improvement
4. Include clear explanations of why each change matters
5. Avoid using percentages or scores in recommendations

Format your response in clear sections with numbered points, ensuring each recommendation is specific and actionable.
    `.trim()
  }
} 