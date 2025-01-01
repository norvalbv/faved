import { Brief as DrizzleBrief } from '../data-store/schema/briefs'
import { Submission as DrizzleSubmission } from '../data-store/schema/submissions'
import { BrandAnalyzer } from '../agents/brand/analyzers/brandAnalyzer'
import { ContentAnalyzer } from '../agents/content/analyzers/contentAnalyzer'
import { BriefAnalyzer } from '../agents/brief/analyzers/briefAnalyzer'
import { Submission } from '../types/submission'
import { Brief, BriefMetadata } from '../types/brief'

export class AIService {
  private brandAnalyzer: BrandAnalyzer
  private contentAnalyzer: ContentAnalyzer
  private briefAnalyzer: BriefAnalyzer

  constructor() {
    const apiKey = process.env.OPENAI_API_KEY!
    this.brandAnalyzer = new BrandAnalyzer(apiKey)
    this.contentAnalyzer = new ContentAnalyzer(apiKey)
    this.briefAnalyzer = new BriefAnalyzer(apiKey)
  }

  async analyzeSubmission(drizzleSubmission: DrizzleSubmission, drizzleBrief: DrizzleBrief) {
    // Convert Drizzle submission to analyzer submission type
    const submission: Submission = {
      id: drizzleSubmission.id,
      projectId: drizzleSubmission.projectId || 'milanote_project_001',
      campaignId: drizzleSubmission.campaignId || undefined,
      type: drizzleSubmission.type,
      content: drizzleSubmission.content,
      metadata: drizzleSubmission.metadata as any,
      createdAt: drizzleSubmission.createdAt,
      updatedAt: drizzleSubmission.updatedAt
    }

    // Convert Drizzle brief to analyzer brief type
    const brief: Brief = {
      id: drizzleBrief.id,
      projectId: drizzleBrief.projectId,
      title: drizzleBrief.title,
      description: drizzleBrief.description,
      type: drizzleBrief.type as Brief['type'],
      metadata: drizzleBrief.metadata as BriefMetadata,
      createdAt: drizzleBrief.createdAt,
      updatedAt: drizzleBrief.updatedAt
    }

    const [brandResults, contentResults] = await Promise.all([
      this.brandAnalyzer.analyze(submission, brief),
      this.contentAnalyzer.analyze(submission, brief)
    ])

    return {
      brandSafety: brandResults.safety,
      brandAlignment: brandResults.alignment,
      content: contentResults,
      timestamp: new Date().toISOString()
    }
  }
}

// Export singleton instance
export const aiService = new AIService()
export const analyzeSubmission = aiService.analyzeSubmission.bind(aiService) 