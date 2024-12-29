import { nanoid } from 'nanoid'
import { eq, desc } from 'drizzle-orm'
import { db } from '../index'
import { feedback, type Feedback } from '../schema/feedback'

type CreateFeedbackProps = Omit<Feedback, 'id' | 'createdAt' | 'updatedAt'>

export class FeedbackRepository {
  static create({
    submissionId,
    type,
    content
  }: CreateFeedbackProps) {
    const timestamp = new Date()
    const feedbackData = {
      id: nanoid(),
      submissionId,
      type,
      content,
      createdAt: timestamp,
      updatedAt: timestamp
    } as const

    return db
      .insert(feedback)
      .values(feedbackData)
  }

  static async getById(id: string): Promise<Feedback | undefined> {
    const [result] = await db
      .select()
      .from(feedback)
      .where(eq(feedback.id, id))

    if (!result) return undefined
    return result
  }

  static async listBySubmission(submissionId: string): Promise<Feedback[]> {
    const results = await db
      .select()
      .from(feedback)
      .where(eq(feedback.submissionId, submissionId))
      .orderBy(desc(feedback.createdAt))

    return results
  }

  static update(id: string, data: Partial<Omit<Feedback, 'id' | 'submissionId' | 'createdAt' | 'updatedAt'>>) {
    return db
      .update(feedback)
      .set({ 
        ...data,
        updatedAt: new Date()
      })
      .where(eq(feedback.id, id))
  }

  static delete(id: string) {
    return db
      .delete(feedback)
      .where(eq(feedback.id, id))
  }
} 