'use server'

import { auth } from '../utils/auth'
import { SubmissionRepository } from '../data-store/repositories/submission'

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

    return submission
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
    return submissions
  } catch (error) {
    console.error('Error fetching submissions:', error)
    throw error
  }
}

export async function listRecentSubmissions(limit: number = 5) {
  try {
    // 1. Verify user is logged in
    const { userId } = auth()
    if (!userId) {
      throw new Error('Unauthorized')
    }

    // 2. Get recent submissions
    const submissions = await SubmissionRepository.listRecent(limit)
    return submissions
  } catch (error) {
    console.error('Error fetching recent submissions:', error)
    throw error
  }
}

interface CreateSubmissionData {
  briefId: string
  type: 'video_topic' | 'draft_script' | 'draft_video' | 'live_video'
  content: string
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
      influencerId: userId,
    })

    return { success: true }
  } catch (error) {
    console.error('Error creating submission:', error)
    return { success: false, error: 'Failed to create submission' }
  }
} 