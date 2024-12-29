import { eq } from 'drizzle-orm'
import { drizzleDb } from '../index'
import { feedback } from '../schema'
import { nanoid } from 'nanoid'

export class FeedbackRepository {
  static async create(data: {
    submissionId: string
    type: 'suggestion' | 'correction' | 'approval' | 'rejection'
    content: string
  }) {
    const now = new Date()
    return drizzleDb.insert(feedback).values({
      id: nanoid(),
      ...data,
      createdAt: now,
      updatedAt: now,
    })
  }

  static async getById(id: string) {
    const results = await drizzleDb
      .select()
      .from(feedback)
      .where(eq(feedback.id, id))
      .limit(1)
    return results[0]
  }

  static async listBySubmission(submissionId: string) {
    return drizzleDb
      .select()
      .from(feedback)
      .where(eq(feedback.submissionId, submissionId))
      .orderBy(feedback.createdAt)
  }
} 