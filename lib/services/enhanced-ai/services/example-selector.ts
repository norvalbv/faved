import { drizzleDb } from '@/lib/data-store'
import { calibrationData } from '@/lib/data-store/schema'
import { eq, desc } from 'drizzle-orm'
import { CalibrationExample, ExampleSelectionConfig } from '../types'
import { SimilarityCalculator } from '../utils/similarity'
import { Submission } from '@/lib/types/submission'

export class ExampleSelector {
  private readonly config: ExampleSelectionConfig
  private readonly similarityCalculator: SimilarityCalculator

  constructor(config: ExampleSelectionConfig) {
    this.config = config
    this.similarityCalculator = new SimilarityCalculator()
  }

  async getCalibrationExamples(briefId: string, submission: Submission): Promise<CalibrationExample[]> {
    const examples = await drizzleDb.query.calibrationData.findMany({
      where: eq(calibrationData.briefId, briefId),
      orderBy: [
        desc(calibrationData.approved),
        desc(calibrationData.createdAt)
      ]
    })

    const sortedExamples = this.similarityCalculator.sortByRelevance(
      examples,
      submission.content,
      example => example.content
    )

    const approvedCount = Math.ceil(this.config.maxExamples * this.config.approvedRatio)
    const rejectedCount = this.config.maxExamples - approvedCount

    return [
      ...this.filterExamplesByApproval(sortedExamples, true).slice(0, approvedCount),
      ...this.filterExamplesByApproval(sortedExamples, false).slice(0, rejectedCount)
    ].map(this.mapToCalibrationExample)
  }

  private filterExamplesByApproval(examples: any[], approved: boolean) {
    return examples.filter(e => {
      const similarity = this.similarityCalculator.calculateSimilarity(e.content, '')
      return e.approved === approved && similarity >= this.config.minSimilarity
    })
  }

  private mapToCalibrationExample(example: any): CalibrationExample {
    return {
      content: example.content,
      approved: example.approved,
      feedback: example.feedback,
      analysis: {
        contentQuality: (example.contentAnalysis as any)?.quality?.score,
        brandSafety: (example.brandAnalysis as any)?.safety?.score,
        effectiveness: (example.contentAnalysis as any)?.sellingPoints?.effectiveness,
      }
    }
  }
} 