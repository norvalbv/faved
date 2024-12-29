import { eq } from 'drizzle-orm'
import { drizzleDb } from '../index'
import { submissions } from '../schema'
import { nanoid } from 'nanoid'

export class SubmissionRepository {
  static async create(data: {
    briefId: string
    type: 'video_topic' | 'draft_script' | 'draft_video' | 'live_video'
    content: string
    status?: 'pending' | 'approved' | 'rejected'
  }) {
    const now = new Date()
    return drizzleDb.insert(submissions).values({
      id: nanoid(),
      ...data,
      status: data.status || 'pending',
      createdAt: now,
      updatedAt: now,
    })
  }

  static async getById(id: string) {
    const results = await drizzleDb
      .select()
      .from(submissions)
      .where(eq(submissions.id, id))
      .limit(1)
    return results[0]
  }

  static async list(briefId?: string) {
    let query = drizzleDb
      .select()
      .from(submissions)
      .orderBy(submissions.createdAt)
    
    if (briefId) {
      query = query.where(eq(submissions.briefId, briefId))
    }

    return query
  }

  static async updateStatus(id: string, status: 'pending' | 'approved' | 'rejected') {
    return drizzleDb
      .update(submissions)
      .set({ 
        status,
        updatedAt: new Date()
      })
      .where(eq(submissions.id, id))
  }
} 