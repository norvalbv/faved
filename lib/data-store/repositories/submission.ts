import { eq, desc } from 'drizzle-orm'
import { drizzleDb } from '..'
import { submissions } from '../schema'
import { nanoid } from 'nanoid'
import type { SubmissionMetadata } from '@/lib/types/submission'

export class SubmissionRepository {
  static async create(data: {
    briefId: string
    type: 'submission'
    content: string
    status?: 'pending' | 'approved' | 'rejected'
    metadata?: SubmissionMetadata
  }) {
    const id = nanoid()
    const now = new Date()
    
    const metadata = {
      ...(data.metadata || {}),
      status: data.status || 'pending'
    }
    
    await drizzleDb.insert(submissions).values({
      id,
      campaignId: data.briefId,
      type: data.type,
      content: data.content,
      metadata,
      createdAt: now,
      updatedAt: now,
    }).execute()

    return { id, ...data, createdAt: now, updatedAt: now }
  }

  static async getById(id: string) {
    const [result] = await drizzleDb
      .select()
      .from(submissions)
      .where(eq(submissions.id, id))
      .limit(1)
      .execute()
    return result
  }

  static async list(briefId?: string) {
    const query = drizzleDb.select().from(submissions)
    
    if (briefId) {
      return query.where(eq(submissions.campaignId, briefId)).execute()
    }

    return query.execute()
  }

  static async listRecent(limit: number = 5) {
    return drizzleDb
      .select()
      .from(submissions)
      .orderBy(desc(submissions.createdAt))
      .limit(limit)
      .execute()
  }

  static async updateStatus(id: string, status: 'pending' | 'approved' | 'rejected') {
    const [submission] = await drizzleDb
      .select()
      .from(submissions)
      .where(eq(submissions.id, id))
      .limit(1)
      .execute()

    if (!submission) {
      throw new Error('Submission not found')
    }

    const metadata = {
      ...(submission.metadata as Record<string, unknown> || {}),
      status
    }

    await drizzleDb
      .update(submissions)
      .set({ 
        metadata,
        updatedAt: new Date()
      })
      .where(eq(submissions.id, id))
      .execute()
    
    return this.getById(id)
  }
} 