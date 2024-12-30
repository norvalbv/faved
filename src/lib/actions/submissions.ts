'use server'

import { auth } from '@/lib/utils/auth'
import { SubmissionRepository } from '@/lib/data-store/repositories/submission'
import { Submission, SubmissionMetadata, CreateSubmissionData } from '@/lib/types/submission'

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

export async function listSubmissions(briefId?: string) {
  try {
    // 1. Verify user is logged in
    const { userId } = auth()
    if (!userId) {
      throw new Error('Unauthorized')
    }

    // 2. Get submissions
    const submissions = await SubmissionRepository.list(briefId)
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

export async function createSubmission(data: CreateSubmissionData) {
  try {
    // 1. Verify user is logged in
    const { userId } = auth()
    if (!userId) {
      throw new Error('Unauthorized')
    }

    // 2. Create submission
    await SubmissionRepository.create({
      ...data,
      metadata: {
        ...data.metadata,
        userId,
      }
    })

    return { success: true }
  } catch (error) {
    console.error('Error creating submission:', error)
    return { success: false, error: 'Failed to create submission' }
  }
} 