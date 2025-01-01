'use server'

import { revalidatePath } from 'next/cache'
import { drizzleDb } from '../data-store'
import { aiService } from '../services/ai'
import { submissions } from '../data-store/schema/submissions'
import { briefs } from '../data-store/schema/briefs'
import { campaigns } from '../data-store/schema/campaigns'
import { eq } from 'drizzle-orm'
import { nanoid } from 'nanoid'
import { auth } from '../utils/auth'
import { analyzeCalibratedSubmission } from './calibrated-analysis'
import { SubmissionMetadata } from '@/lib/types/submission'
import { BriefMetadata } from '@/lib/types/brief'

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
        // Ensure submission has required fields for analysis
        const submissionForAnalysis = {
          ...submission[0],
          projectId: submission[0].projectId || '',
          campaignId: submission[0].campaignId || undefined,
          metadata: submission[0].metadata as SubmissionMetadata
        }
        
        const briefForAnalysis = {
          ...brief[0],
          metadata: brief[0].metadata as BriefMetadata
        }
        
        const analysis = await analyzeCalibratedSubmission(submissionForAnalysis, briefForAnalysis)
        
        // Format AI feedback
        const aiFeedback = [
          'Content Quality Analysis:',
          `Clarity: ${analysis.content.quality.clarity}/100`,
          `Engagement: ${analysis.content.quality.engagement}/100`,
          `Technical Accuracy: ${analysis.content.quality.technicalAccuracy}/100`,
          '',
          'Strengths:',
          ...analysis.content.quality.strengths.map((s: string) => `• ${s}`),
          '',
          'Areas for Improvement:',
          ...analysis.content.quality.improvements.map((i: string) => `• ${i}`),
          '',
          'Brand Safety Analysis:',
          `Overall Score: ${analysis.brandSafety.score}/100`,
          `Confidence: ${analysis.brandSafety.confidence}%`,
          analysis.brandSafety.issues.length > 0 ? [
            '',
            'Safety Issues:',
            ...analysis.brandSafety.issues.map((i: string) => `• ${i}`)
          ].join('\n') : '',
          '',
          'Brand Alignment:',
          `Score: ${analysis.brandAlignment.score}/100`,
          `Confidence: ${analysis.brandAlignment.confidence}%`,
          analysis.brandAlignment.alignment.length > 0 ? [
            '',
            'Alignment Strengths:',
            ...analysis.brandAlignment.alignment.map((i: string) => `• ${i}`)
          ].join('\n') : '',
          analysis.brandAlignment.misalignment.length > 0 ? [
            '',
            'Alignment Issues:',
            ...analysis.brandAlignment.misalignment.map((i: string) => `• ${i}`)
          ].join('\n') : '',
          '',
          'Selling Points:',
          'Present:',
          ...analysis.content.sellingPoints.present.map((p: string) => `• ${p}`),
          '',
          'Missing:',
          ...analysis.content.sellingPoints.missing.map((m: string) => `• ${m}`)
        ].filter(Boolean).join('\n')

        // Update submission with analysis results
        await drizzleDb
          .update(submissions)
          .set({
            metadata: {
              ...submission[0].metadata as Record<string, any>,
              feedbackHistory: [{
                feedback: aiFeedback,
                brandSafety: {
                  issues: analysis.brandSafety.issues,
                  score: analysis.brandSafety.score,
                  confidence: analysis.brandSafety.confidence
                },
                brandAlignment: {
                  alignment: analysis.brandAlignment.alignment,
                  misalignment: analysis.brandAlignment.misalignment,
                  score: analysis.brandAlignment.score,
                  confidence: analysis.brandAlignment.confidence
                },
                contentQuality: {
                  score: analysis.content.quality.score,
                  strengths: analysis.content.quality.strengths,
                  improvements: analysis.content.quality.improvements,
                  tone: analysis.content.quality.tone
                },
                sellingPoints: {
                  present: analysis.content.sellingPoints.present,
                  missing: analysis.content.sellingPoints.missing,
                  effectiveness: analysis.content.sellingPoints.effectiveness
                },
                createdAt: now,
                isAiFeedback: true,
                status: 'comment'
              }]
            }
          })
          .where(eq(submissions.id, submission[0].id))
      } catch (error) {
        console.error('AI analysis failed:', error)
      }
    }

    revalidatePath('/dashboard')
    revalidatePath('/campaigns')
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