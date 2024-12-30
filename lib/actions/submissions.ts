'use server'

import { SubmissionRepository } from '../data-store/repositories/submission'
import { CampaignRepository } from '../data-store/repositories/campaign'
import { BriefRepository } from '../data-store/repositories/brief'
import { Submission, SubmissionMetadata } from '../types/submission'
import { auth } from '../utils/auth'
import { nanoid } from 'nanoid'
import { analyzeSubmission } from '../services/ai'
import { revalidatePath } from 'next/cache'

export async function getSubmission(id: string) {
  try {
    // 1. Verify user is logged in
    const { userId } = auth()
    if (!userId) {
      throw new Error('Unauthorized')
    }

    // 2. Get submission
    const submission = await SubmissionRepository.getById(id)
    if (!submission) {
      throw new Error('Submission not found')
    }

    return submission as Submission
  } catch (error) {
    console.error('Error fetching submission:', error)
    throw error
  }
}

export async function listSubmissions(campaignId?: string) {
  try {
    // 1. Verify user is logged in
    const { userId } = auth()
    if (!userId) {
      throw new Error('Unauthorized')
    }

    // 2. Get submissions
    const submissions = await SubmissionRepository.list(campaignId)
    return submissions as Submission[]
  } catch (error) {
    console.error('Error fetching submissions:', error)
    throw error
  }
}

export async function listRecentSubmissions(limit: number = 5): Promise<Submission[]> {
  try {
    // 1. Verify user is logged in
    const { userId } = auth()
    if (!userId) {
      throw new Error('Unauthorized')
    }

    // 2. Get recent submissions
    const submissions = await SubmissionRepository.listRecent(limit)
    return submissions as Submission[]
  } catch (error) {
    console.error('Error fetching recent submissions:', error)
    throw error
  }
}

export async function createSubmission(data: {
  briefId: string
  content: string
  metadata: Omit<SubmissionMetadata, 'userId'> & { isHistoricalImport?: boolean }
}) {
  try {
    // 1. Verify user is logged in
    const { userId } = auth()
    if (!userId) {
      throw new Error('Unauthorized')
    }

    // 2. Get the brief for AI analysis
    const brief = await BriefRepository.getById(data.briefId)
    if (!brief) {
      throw new Error('Brief not found')
    }

    // Cast brief metadata to expected type
    const briefWithMetadata = {
      ...brief,
      metadata: {
        overview: {
          what: brief.description,
          gettingStarted: (brief.metadata as { gettingStarted?: string } | undefined)?.gettingStarted || ''
        },
        guidelines: (brief.metadata as { guidelines?: { category: string; items: string[] }[] } | undefined)?.guidelines || [{
          category: 'Requirements',
          items: [brief.description]
        }]
      }
    }

    // 3. Find or create campaign
    const campaign = await CampaignRepository.findByBriefId(data.briefId)
    let campaignId: string

    if (campaign) {
      campaignId = campaign.id
    } else {
      // Create new campaign
      const newCampaign = await CampaignRepository.create({
        id: nanoid(),
        title: `${data.metadata.type} Submission`,
        description: data.content.slice(0, 100) + (data.content.length > 100 ? '...' : ''),
        status: 'active',
        briefId: data.briefId,
        metadata: {
          submissionType: data.metadata.type,
          userId
        }
      })
      campaignId = newCampaign.id
    }

    // 4. Perform AI analysis if not a historical import
    let feedbackHistory = data.metadata.feedbackHistory || []
    if (!data.metadata.isHistoricalImport) {
      try {
        const mockSubmission: Submission = {
          id: nanoid(), // Temporary ID for analysis
          type: 'submission',
          content: data.content,
          metadata: data.metadata as SubmissionMetadata,
          projectId: data.briefId,
          campaignId,
          createdAt: new Date(),
          updatedAt: new Date()
        }

        const aiAnalysis = await analyzeSubmission(mockSubmission, briefWithMetadata)
        
        // Add AI feedback to history
        feedbackHistory.push({
          feedback: aiAnalysis.matches.map((m: { category: string; items: string[] }) => `${m.category}:\n${m.items.join('\n')}`).join('\n\n') +
            (aiAnalysis.mismatches.length > 0 ? `\n\nAreas for Improvement:\n${aiAnalysis.mismatches.map((m: { items: string[] }) => m.items.join('\n')).join('\n')}` : ''),
          createdAt: new Date().toISOString(),
          status: aiAnalysis.brandSafety.pass ? 'comment' : 'rejected',
          isAiFeedback: true
        })

        // Update metadata with rejection status
        data.metadata.status = aiAnalysis.brandSafety.pass ? 'pending' : 'rejected'
        data.metadata.stageId = aiAnalysis.brandSafety.pass ? '1' : '3' // Stage 3 for rejected, Stage 1 for pending
      } catch (error) {
        console.error('AI analysis failed:', error)
        // Continue with submission creation even if AI analysis fails
      }
    }

    // 5. Create submission
    await SubmissionRepository.create({
      campaignId,
      type: 'submission',
      content: data.content,
      metadata: {
        ...data.metadata,
        userId,
        feedbackHistory
      }
    })

    // Revalidate the submissions page
    revalidatePath('/campaigns/[id]/submissions/[submissionId]', 'page')

    return { success: true, campaignId }
  } catch (error) {
    console.error('Error creating submission:', error)
    return { success: false, error: 'Failed to create submission' }
  }
} 