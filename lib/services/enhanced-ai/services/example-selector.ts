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

    // First, sort by relevance
    const sortedExamples = this.similarityCalculator.sortByRelevance(
      examples,
      submission.content,
      example => example.content
    )

    // Split into approved and rejected examples
    const approvedExamples = this.filterExamplesByApproval(sortedExamples, true)
    const rejectedExamples = this.filterExamplesByApproval(sortedExamples, false)

    // Calculate how many examples we want of each type
    const approvedCount = Math.ceil(this.config.maxExamples * this.config.approvedRatio)
    const rejectedCount = this.config.maxExamples - approvedCount

    // Get the most relevant examples of each type
    const selectedApproved = this.selectBestExamples(approvedExamples, approvedCount)
    const selectedRejected = this.selectBestExamples(rejectedExamples, rejectedCount)

    return [...selectedApproved, ...selectedRejected].map(this.mapToCalibrationExample)
  }

  private filterExamplesByApproval(examples: any[], approved: boolean) {
    return examples.filter(e => {
      const similarity = this.similarityCalculator.calculateSimilarity(e.content, '')
      return e.approved === approved && similarity >= this.config.minSimilarity
    })
  }

  private selectBestExamples(examples: any[], count: number): any[] {
    if (examples.length <= count) return examples

    // Ensure we have a diverse set of examples
    const selected: any[] = []
    const contentLengthGroups = this.groupByContentLength(examples)

    // Try to get examples from each content length group
    const examplesPerGroup = Math.max(1, Math.floor(count / contentLengthGroups.length))
    contentLengthGroups.forEach(group => {
      selected.push(...group.slice(0, examplesPerGroup))
    })

    // Fill remaining slots with the highest similarity examples not yet selected
    while (selected.length < count && examples.length > 0) {
      const nextBest = examples.find(e => !selected.includes(e))
      if (nextBest) selected.push(nextBest)
      else break
    }

    return selected
  }

  private groupByContentLength(examples: any[]): any[][] {
    // Group into short, medium, and long content
    const groups: any[][] = [[], [], []]
    examples.forEach(example => {
      const length = example.content.length
      if (length < 100) groups[0].push(example)
      else if (length < 500) groups[1].push(example)
      else groups[2].push(example)
    })
    return groups.filter(group => group.length > 0)
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