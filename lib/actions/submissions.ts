'use server'

import { SubmissionRepository } from '../data-store/repositories/submission'
import { Submission, SubmissionMetadata } from '../types/submission'
import { auth } from '../utils/auth'

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
  campaignId: string
  content: string
  metadata: Omit<SubmissionMetadata, 'userId'>
}) {
  try {
    // 1. Verify user is logged in
    const { userId } = auth()
    if (!userId) {
      throw new Error('Unauthorized')
    }

    // 2. Create submission
    await SubmissionRepository.create({
      campaignId: data.campaignId,
      type: 'submission',
      content: data.content,
      metadata: {
        ...data.metadata,
        userId
      }
    })

    return { success: true }
  } catch (error) {
    console.error('Error creating submission:', error)
    return { success: false, error: 'Failed to create submission' }
  }
} 