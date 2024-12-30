'use server'

import { auth } from '../utils/auth'
import { FeedbackRepository } from '../../../data-store/repositories/feedback'

export async function createFeedback(data: {
  submissionId: string
  type: 'suggestion' | 'correction' | 'approval' | 'rejection'
  content: string
}) {
  try {
    // 1. Verify user is logged in
    const { userId } = auth()
    if (!userId) {
      throw new Error('Unauthorized')
    }

    // 2. Create feedback
    await FeedbackRepository.create(data)

    return { success: true }
  } catch (error) {
    console.error('Error creating feedback:', error)
    throw error
  }
}

export async function listFeedback(submissionId: string) {
  try {
    // 1. Verify user is logged in
    const { userId } = auth()
    if (!userId) {
      throw new Error('Unauthorized')
    }

    // 2. Get feedback for submission
    const feedback = await FeedbackRepository.listBySubmission(submissionId)

    return feedback
  } catch (error) {
    console.error('Error fetching feedback:', error)
    throw error
  }
} 