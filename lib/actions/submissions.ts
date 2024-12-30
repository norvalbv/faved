'use server'

import { SubmissionRepository } from '../data-store/repositories/submission'
import { CampaignRepository } from '../data-store/repositories/campaign'
import { Submission, SubmissionMetadata } from '../types/submission'
import { auth } from '../utils/auth'
import { nanoid } from 'nanoid'

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

    // 2. Find or create campaign
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

    // 3. Create submission
    await SubmissionRepository.create({
      campaignId,
      type: 'submission',
      content: data.content,
      metadata: {
        ...data.metadata,
        userId
      }
    })

    return { success: true, campaignId }
  } catch (error) {
    console.error('Error creating submission:', error)
    return { success: false, error: 'Failed to create submission' }
  }
} 