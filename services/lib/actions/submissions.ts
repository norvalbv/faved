'use server'

import { db } from '../../data-store'
import { submissions } from '../../data-store/schema'
import { nanoid } from 'nanoid'
import { eq } from 'drizzle-orm'
import { submissionSchema, type SubmissionData } from '../validations/submissions'
import { requireAuth } from './auth'

export async function createSubmission(data: SubmissionData) {
  const user = await requireAuth('influencer')
  const timestamp = new Date()

  // Validate submission data
  const validatedData = submissionSchema.parse(data)

  // Create submission
  const submissionId = nanoid()
  await db.insert(submissions).values({
    id: submissionId,
    briefId: validatedData.briefId,
    type: validatedData.type,
    content: JSON.stringify(validatedData.content),
    status: 'pending',
    createdAt: timestamp,
    updatedAt: timestamp,
  })

  return {
    success: true,
    submissionId,
  }
}

export async function getSubmission(id: string) {
  const user = await requireAuth()

  const [submission] = await db
    .select()
    .from(submissions)
    .where(eq(submissions.id, id))

  if (!submission) {
    throw new Error('Submission not found')
  }

  return {
    ...submission,
    content: JSON.parse(submission.content),
  }
}

export async function listSubmissions(briefId?: string) {
  const user = await requireAuth()

  let query = db.select().from(submissions)
  if (briefId) {
    query = query.where(eq(submissions.briefId, briefId))
  }

  const results = await query

  return results.map(submission => ({
    ...submission,
    content: JSON.parse(submission.content),
  }))
}

export async function updateSubmissionStatus(
  id: string,
  status: 'approved' | 'rejected'
) {
  const user = await requireAuth('brand')
  const timestamp = new Date()

  await db
    .update(submissions)
    .set({
      status,
      updatedAt: timestamp,
    })
    .where(eq(submissions.id, id))

  return {
    success: true,
  }
} 