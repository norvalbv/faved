'use server'

import { SubmissionRepository } from '../data-store/repositories/submission'
import { CampaignRepository } from '../data-store/repositories/campaign'
import { BriefRepository } from '../data-store/repositories/brief'
import { Submission, SubmissionMetadata } from '../types/submission'
import { auth } from '../utils/auth'
import { nanoid } from 'nanoid'
import { analyzeSubmission } from './analyze'

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
        
        // Format AI feedback
        const formattedAnalysis = [
          aiAnalysis.matches.length > 0 && `ANALYSIS:\n${aiAnalysis.matches.map(m => `${m.category}:\n${m.items.join('\n')}`).join('\n\n')}`,
          aiAnalysis.mismatches.length > 0 && `AREAS FOR IMPROVEMENT:\n${aiAnalysis.mismatches.map(m => `${m.category}:\n${m.items.join('\n')}`).join('\n\n')}`,
          aiAnalysis.brandSafety.issues.length > 0 && `BRAND SAFETY ISSUES:\n${aiAnalysis.brandSafety.issues.join('\n')}`,
          aiAnalysis.sellingPoints.missing.length > 0 && `MISSING KEY POINTS:\n${aiAnalysis.sellingPoints.missing.join('\n')}`
        ].filter(Boolean).join('\n\n')
        
        const isRejected = !aiAnalysis.brandSafety.pass
        
        feedbackHistory.push({
          feedback: formattedAnalysis,
          createdAt: new Date().toISOString(),
          status: isRejected ? 'rejected' : 'comment',
          isAiFeedback: true
        })

        // Update metadata with rejection status
        data.metadata.status = isRejected ? 'rejected' : 'pending'
        data.metadata.stageId = isRejected ? '3' : '1' // Stage 3 for rejected, Stage 1 for pending
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

    return { success: true, campaignId }
  } catch (error) {
    console.error('Error creating submission:', error)
    return { success: false, error: 'Failed to create submission' }
  }
} 