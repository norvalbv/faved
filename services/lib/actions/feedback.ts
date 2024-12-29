'use server'

import { z } from 'zod'
import type { Feedback } from '../types/feedback'

const feedbackSchema = z.object({
  submissionId: z.string(),
  content: z.string(),
  type: z.enum(['suggestion', 'correction', 'approval', 'rejection']),
})

export async function createFeedback(formData: FormData) {
  const validatedFields = feedbackSchema.safeParse({
    submissionId: formData.get('submissionId'),
    content: formData.get('content'),
    type: formData.get('type'),
  })

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    }
  }

  // TODO: Save feedback to data-store
  return {
    success: true,
    data: validatedFields.data,
  }
}

export async function getFeedback(submissionId: string): Promise<Feedback[]> {
  // TODO: Implement feedback retrieval from data-store
  return []
}

export async function analyzeBriefCompliance(submissionId: string): Promise<{
  matches: string[]
  mismatches: string[]
}> {
  // TODO: Implement brief compliance analysis
  return {
    matches: [],
    mismatches: [],
  }
} 