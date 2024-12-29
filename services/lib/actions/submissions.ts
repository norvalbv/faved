'use server'

import { z } from 'zod'
import type { Submission, SubmissionType } from '../types/submission'

const submissionSchema = z.object({
  briefId: z.string(),
  type: z.enum(['video_topic', 'draft_script', 'draft_video', 'live_video']),
  content: z.string(),
})

export async function createSubmission(formData: FormData) {
  const validatedFields = submissionSchema.safeParse({
    briefId: formData.get('briefId'),
    type: formData.get('type'),
    content: formData.get('content'),
  })

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    }
  }

  // TODO: Save submission to data-store
  return {
    success: true,
    data: validatedFields.data,
  }
}

export async function getSubmission(id: string): Promise<Submission | null> {
  // TODO: Implement submission retrieval from data-store
  return null
}

export async function listSubmissions(briefId: string): Promise<Submission[]> {
  // TODO: Implement submission listing from data-store
  return []
} 