import { nanoid } from 'nanoid'
import { eq, desc } from 'drizzle-orm'
import { db } from '../index'
import { submissions, type Submission } from '../schema/submissions'

type CreateSubmissionProps = Omit<Submission, 'id' | 'createdAt' | 'updatedAt' | 'status'> & {
  status?: 'pending' | 'approved' | 'rejected'
}

export class SubmissionRepository {
  static create({
    briefId,
    type,
    content,
    status = 'pending'
  }: CreateSubmissionProps) {
    const timestamp = new Date()
    const submissionData = {
      id: nanoid(),
      briefId,
      type,
      content: JSON.stringify(content),
      status,
      createdAt: timestamp,
      updatedAt: timestamp
    } as const

    return db
      .insert(submissions)
      .values(submissionData)
  }

  static async getById(id: string): Promise<Submission | undefined> {
    const [submission] = await db
      .select()
      .from(submissions)
      .where(eq(submissions.id, id))

    if (!submission) return undefined

    return {
      ...submission,
      content: JSON.parse(submission.content)
    }
  }

  static async list(briefId?: string): Promise<Submission[]> {
    const results = await db
      .select()
      .from(submissions)
      .where(briefId ? eq(submissions.briefId, briefId) : undefined)
      .orderBy(desc(submissions.createdAt))

    return results.map(submission => ({
      ...submission,
      content: JSON.parse(submission.content)
    }))
  }

  static updateStatus(id: string, status: 'pending' | 'approved' | 'rejected') {
    return db
      .update(submissions)
      .set({ 
        status,
        updatedAt: new Date()
      })
      .where(eq(submissions.id, id))
  }

  static delete(id: string) {
    return db
      .delete(submissions)
      .where(eq(submissions.id, id))
  }
} 