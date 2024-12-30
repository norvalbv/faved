'use server'

import { SubmissionRepository } from '../data-store/repositories/submission'
import { CampaignRepository } from '../data-store/repositories/campaign'
import { BriefRepository } from '../data-store/repositories/brief'
import { Submission, SubmissionMetadata } from '../types/submission'
import type { BriefMetadata } from '../types/brief'
import { auth } from '../utils/auth'
import { nanoid } from 'nanoid'
import { analyzeSubmission } from '../services/ai'

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
  metadata: Omit<SubmissionMetadata, 'userId'>
}) {
  try {
    // 1. Verify user is logged in
    const { userId } = auth()
    if (!userId) {
      throw new Error('Unauthorized')
    }

    // 2. Get brief details for AI analysis
    const brief = await BriefRepository.getById(data.briefId)
    if (!brief) {
      throw new Error('Brief not found')
    }

    // Cast brief to correct type
    const briefWithMetadata = {
      ...brief,
      metadata: brief.metadata as BriefMetadata
    }

    // 3. Get AI feedback
    console.log('Getting AI feedback...')
    const aiFeedback = await analyzeSubmission({ content: data.content }, briefWithMetadata)
    console.log('AI Feedback received:', aiFeedback)

    // Check if AI rejected the submission
    const isRejected = aiFeedback.includes('{{reject}}')
    const feedbackText = isRejected 
      ? aiFeedback.split('REASON:')[1]?.trim() 
      : aiFeedback

    // 4. Find or create campaign
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

    // 5. Create submission with AI feedback
    const feedbackHistory = [{
      feedback: feedbackText,
      createdAt: new Date().toISOString(),
      status: isRejected ? 'rejected' : 'comment',
      isAiFeedback: true
    }]

    console.log('Feedback history:', feedbackHistory)

    const submissionMetadata = {
      type: data.metadata.type,
      input: data.metadata.input,
      sender: data.metadata.sender,
      userId,
      message: data.metadata.message,
      stageId: isRejected ? '3' : '1', // Set to stage 3 if rejected
      status: isRejected ? 'rejected' : 'pending',
      submitted: true,
      feedbackHistory
    }

    console.log('Final metadata before creation:', submissionMetadata)

    try {
      await SubmissionRepository.create({
        campaignId,
        type: 'submission',
        content: data.content,
        metadata: submissionMetadata
      })

      console.log('Submission created successfully')
      return { success: true, campaignId }
    } catch (error) {
      console.error('Error in final submission creation:', error)
      throw error
    }
  } catch (error) {
    console.error('Error creating submission:', error)
    return { success: false, error: 'Failed to create submission' }
  }
} 