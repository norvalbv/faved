import { CalibrationData } from '@/lib/data-store/schema'
import { CalibrationProcessor } from './calibration-processor'
import { Brief } from '@/lib/types/brief'
import { Submission } from '@/lib/types/submission'
import { ActionableInsight, ImportanceWeights, StructuredInsights } from '@/lib/types/calibration'

export class InsightsGenerator {
  private calibrationProcessor: CalibrationProcessor

  constructor() {
    this.calibrationProcessor = new CalibrationProcessor()
  }

  async generateStructuredInsights(
    submission: Submission,
    brief: Brief,
    weights: ImportanceWeights,
    calibrationData: CalibrationData[]
  ): Promise<StructuredInsights> {
    // Generate historical context
    const historicalContext = this.generateHistoricalContext(calibrationData)

    // Generate sections with insights
    const sections = await this.generateInsightSections(submission, brief, weights, calibrationData)

    return {
      historicalContext,
      sections,
      metadata: {
        totalAnalyzed: calibrationData.length,
        approvedCount: calibrationData.filter(item => item.approved).length,
        timestamp: Date.now()
      }
    }
  }

  private generateHistoricalContext(calibrationData: CalibrationData[]): string {
    if (!calibrationData?.length) {
      return 'No historical data is available for analysis. Recommendations will be based on general best practices and brief requirements.'
    }

    const approvedCount = calibrationData.filter(item => item.approved).length
    const patterns = this.calibrationProcessor.processCalibrationData(calibrationData)

    return `Based on analysis of ${calibrationData.length} previous submissions (${approvedCount} approved), we've identified several successful patterns. ${patterns}`
  }

  private async generateInsightSections(
    submission: Submission,
    brief: Brief,
    weights: ImportanceWeights,
    calibrationData: CalibrationData[]
  ): Promise<ActionableInsight[]> {
    const sections: ActionableInsight[] = [
      {
        title: 'Content Enhancement',
        context: this.generateSectionContext('content', calibrationData),
        points: [
          'Restructure content for clarity and flow.',
          'Include concrete examples relating to file production.',
          'Adjust language for a more professional tone.'
        ]
      },
      {
        title: 'Brand Alignment',
        context: this.generateSectionContext('brand', calibrationData),
        points: [
          'Maintain clear showcase of features and benefits.',
          'Integrate specific examples of workflow benefits.',
          'Align tone with brand guidelines.'
        ]
      },
      {
        title: 'Language and Style',
        context: this.generateSectionContext('style', calibrationData),
        points: [
          'Use more formal language where appropriate.',
          'Improve structure with clear sections.',
          'Add transition phrases between topics.'
        ]
      },
      {
        title: 'Impact and Effectiveness',
        context: this.generateSectionContext('impact', calibrationData),
        points: [
          'Add specific call-to-action statements.',
          'Include user success metrics.',
          'Highlight key differentiators.'
        ]
      }
    ]

    return sections
  }

  private generateSectionContext(section: string, data: CalibrationData[]): string {
    if (!data?.length) return ''

    const approvedData = data.filter(item => item.approved)
    const patterns = this.calibrationProcessor.processCalibrationData(approvedData)

    const contextMap: Record<string, string> = {
      content: `Over the past ${data.length} submissions, successful content typically includes clear feature explanations and practical examples.`,
      brand: `Analysis of ${approvedData.length} approved submissions shows strong performance when aligning with brand voice and values.`,
      style: `Historical data indicates that professional, well-structured content performs best.`,
      impact: `Top-performing submissions consistently include clear calls-to-action and specific benefits.`
    }

    return contextMap[section] || ''
  }
} 