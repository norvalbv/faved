'use server'

import { revalidatePath } from 'next/cache'
import { drizzleDb } from '../data-store'
import { submissions } from '../data-store/schema/submissions'
import { briefs } from '../data-store/schema/briefs'
import { campaigns } from '../data-store/schema/campaigns'
import { calibrationData, calibrationWeights } from '../data-store/schema'
import { eq, desc } from 'drizzle-orm'
import { nanoid } from 'nanoid'
import { auth } from '../utils/auth'
import { SubmissionMetadata } from '@/lib/types/submission'
import { BriefMetadata } from '@/lib/types/brief'
import { EnhancedAIService } from '../services/enhanced-ai/index'
import { AnalysisResult, Brief, Submission } from '../services/enhanced-ai/types'
import { ImportanceWeights } from '@/lib/types/calibration'

const DEFAULT_WEIGHTS: ImportanceWeights = {
  content: 0.8,
  brandAlignment: 0.7,
  guidelines: 0.7,
  formatting: 0.6,
  pronunciation: 0.6
}

function formatAnalysisToText(analysis: AnalysisResult, weights: ImportanceWeights): string {
  // Sort weights by importance
  const sortedWeights = Object.entries(weights)
    .sort(([, a], [, b]) => b - a)
    .map(([key, value]) => `${key}: ${(value * 100).toFixed(0)}%`)

  return [
    'Content Analysis Summary:',
    '',
    'Weight Configuration:',
    ...sortedWeights.map(w => `• ${w}`),
    '',
    `Overall Content Quality: ${analysis.content.quality.score}/100`,
    'Key Strengths:',
    ...analysis.content.quality.strengths.map((s: string) => `• ${s}`),
    '',
    'Areas for Improvement:',
    ...analysis.content.quality.improvements.map((i: string) => `• ${i}`),
    '',
    `Brand Safety Score: ${analysis.brandSafety.score}/100`,
    analysis.brandSafety.issues.length > 0 ? [
      'Safety Concerns:',
      ...analysis.brandSafety.issues.map((i: string) => `• ${i}`)
    ].join('\n') : 'No safety concerns identified.',
    '',
    `Brand Alignment Score: ${analysis.brandAlignment.score}/100`,
    'Alignment Details:',
    ...analysis.brandAlignment.alignment.map((i: string) => `• ${i}`),
    '',
    'Misalignment Issues:',
    ...analysis.brandAlignment.misalignment.map((i: string) => `• ${i}`),
    '',
    'Key Points Coverage:',
    'Present:',
    ...analysis.content.sellingPoints.present.map((p: string) => `• ${p}`),
    '',
    'Missing:',
    ...analysis.content.sellingPoints.missing.map((p: string) => `• ${p}`),
    '',
    `Overall Effectiveness: ${(analysis.content.sellingPoints.effectiveness * 100).toFixed(0)}%`,
    '',
    'Additional Metrics:',
    `• Clarity: ${analysis.content.quality.clarity}/100`,
    `• Engagement: ${analysis.content.quality.engagement}/100`,
    `• Technical Accuracy: ${analysis.content.quality.technicalAccuracy}/100`,
    `• Confidence: ${(analysis.content.quality.confidence * 100).toFixed(0)}%`
  ].filter(Boolean).join('\n')
}

export async function createSubmission(data: {
  content: string
  briefId: string
  campaignId?: string
  isHistoricalImport?: boolean
  metadata?: Record<string, any>
}): Promise<{ success: boolean; campaignId?: string; error?: string }> {
  try {
    const { userId } = auth()
    if (!userId) throw new Error('Unauthorized')

    const brief = await drizzleDb.select().from(briefs).where(eq(briefs.id, data.briefId)).execute()
    if (!brief[0]) throw new Error('Brief not found')

    let campaign = null
    if (data.campaignId) {
      campaign = await drizzleDb.select().from(campaigns).where(eq(campaigns.id, data.campaignId)).execute()
      if (!campaign[0]) throw new Error('Campaign not found')
    } else {
      // Create new campaign if one doesn't exist
      const existingCampaign = await drizzleDb
        .select()
        .from(campaigns)
        .where(eq(campaigns.briefId, data.briefId))
        .execute()

      if (existingCampaign[0]) {
        campaign = existingCampaign
      } else {
        campaign = await drizzleDb
          .insert(campaigns)
          .values({
            id: nanoid(),
            title: `${brief[0].type} Campaign`,
            description: brief[0].description,
            status: 'active',
            briefId: data.briefId,
            projectId: brief[0].projectId,
            metadata: {
              submissionType: data.metadata?.type || 'submission',
              userId
            }
          })
          .returning()
      }
    }

    const now = new Date().toISOString()

    // Create submission
    const submission = await drizzleDb.insert(submissions).values({
      id: nanoid(),
      content: data.content,
      projectId: brief[0].projectId,
      campaignId: campaign[0].id,
      type: 'submission',
      metadata: {
        userId,
        status: 'pending_review',
        feedbackHistory: [],
        createdAt: now,
        ...data.metadata
      }
    }).returning()

    // Run AI analysis if not historical import
    if (!data.isHistoricalImport) {
      try {
        // Get calibration weights
        const weightsResult = await drizzleDb.query.calibrationWeights.findFirst({
          where: eq(calibrationWeights.briefId, data.briefId)
        })

        const weights = weightsResult?.weights as ImportanceWeights || DEFAULT_WEIGHTS

        // Ensure submission has required fields for analysis
        const submissionForAnalysis: Submission = {
          id: submission[0].id,
          content: submission[0].content,
          type: submission[0].type,
          projectId: submission[0].projectId || '',
          campaignId: submission[0].campaignId || undefined,
          metadata: submission[0].metadata as SubmissionMetadata,
          createdAt: new Date((submission[0].metadata as SubmissionMetadata).createdAt || new Date()),
          updatedAt: new Date()
        }
        
        const briefForAnalysis: Brief = {
          id: brief[0].id,
          type: brief[0].type,
          projectId: brief[0].projectId,
          title: brief[0].title,
          description: brief[0].description,
          metadata: brief[0].metadata as BriefMetadata,
          createdAt: brief[0].createdAt || new Date(),
          updatedAt: brief[0].updatedAt || new Date()
        }

        // Use EnhancedAIService for analysis
        const aiService = new EnhancedAIService()
        const analysis = await aiService.analyzeSubmission(
          submissionForAnalysis,
          briefForAnalysis,
          weights
        )

        // Update submission with analysis results
        await drizzleDb
          .update(submissions)
          .set({
            metadata: {
              ...submission[0].metadata as SubmissionMetadata,
              feedbackHistory: [
                ...(submission[0].metadata as SubmissionMetadata).feedbackHistory,
                {
                  feedback: analysis.summary || formatAnalysisToText(analysis, weights),
                  createdAt: new Date().toISOString(),
                  status: 'comment',
                  isAiFeedback: true,
                  analysis,
                  weights
                }
              ]
            }
          })
          .where(eq(submissions.id, submission[0].id))
      } catch (error) {
        console.error('AI analysis failed:', error)
      }
    }

    return {
      success: true,
      campaignId: campaign[0].id
    }
  } catch (error) {
    console.error('Error creating submission:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create submission'
    }
  }
} 