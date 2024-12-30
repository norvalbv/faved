'use server'

import { auth } from '../utils/auth'
import { FeedbackRepository } from '@/lib/data-store/repositories/feedback'

interface CreateFeedbackData {
  submissionId: string
  type: 'suggestion' | 'approval'
  content: string
}

export async function createFeedback(data: CreateFeedbackData) {
  try {
    // 1. Validate data
    if (!data.submissionId || !data.type || !data.content) {
      throw new Error('Missing required fields')
    }

    // 2. Create feedback
    await FeedbackRepository.create(data)

    return { success: true }
  } catch (error) {
    console.error('Error creating feedback:', error)
    return { success: false, error: 'Failed to create feedback' }
  }
}

export async function listFeedback(submissionId: string) {
  try {
    return await FeedbackRepository.list(submissionId)
  } catch (error) {
    console.error('Error listing feedback:', error)
    return []
  }
} 