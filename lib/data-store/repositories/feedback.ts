import { eq } from 'drizzle-orm'
import { drizzleDb } from '..'
import { feedback } from '../schema'
import { nanoid } from 'nanoid'

export class FeedbackRepository {
  static async create(data: {
    submissionId: string
    type: 'suggestion' | 'approval'
    content: string
  }) {
    const id = nanoid()
    const now = new Date()
    
    await drizzleDb.insert(feedback).values({
      id,
      ...data,
      createdAt: now,
      updatedAt: now,
    }).execute()

    return { id, ...data, createdAt: now, updatedAt: now }
  }

  static async getById(id: string) {
    const [result] = await drizzleDb
      .select()
      .from(feedback)
      .where(eq(feedback.id, id))
      .limit(1)
      .execute()
    return result
  }

  static async list(submissionId?: string) {
    const query = drizzleDb.select().from(feedback)
    
    if (submissionId) {
      return query.where(eq(feedback.submissionId, submissionId)).execute()
    }

    return query.execute()
  }
} 