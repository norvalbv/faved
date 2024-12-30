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
    
    await drizzleDb.insert(submissions).values({
      id,
      ...data,
      status: data.status || 'pending',
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
      return query.where(eq(submissions.briefId, briefId)).execute()
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
    await drizzleDb
      .update(submissions)
      .set({ 
        status,
        updatedAt: new Date()
      })
      .where(eq(submissions.id, id))
      .execute()
    
    return this.getById(id)
  }
} 