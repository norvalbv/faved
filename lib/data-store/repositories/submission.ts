import { Submission, SubmissionMetadata } from '@/lib/types/submission'
import { submissions, campaigns } from '../schema'
import { eq, desc } from 'drizzle-orm'
import { nanoid } from 'nanoid'
import { drizzleDb } from '..'

type CreateSubmissionInput = {
  campaignId?: string
  type: string
  content: string
  metadata: Record<string, unknown>
  projectId?: string
}

export class SubmissionRepository {
  static async getById(id: string): Promise<Submission | null> {
    const [result] = await drizzleDb
      .select()
      .from(submissions)
      .where(eq(submissions.id, id))
      .limit(1)
      .execute()
    
    if (!result) return null
    return {
      ...result,
      metadata: result.metadata as SubmissionMetadata
    } as Submission
  }

  static async list(campaignId?: string): Promise<Submission[]> {
    const query = drizzleDb.select().from(submissions)
    
    if (campaignId) {
      const results = await query.where(eq(submissions.campaignId, campaignId)).execute()
      return results.map(result => ({
        ...result,
        metadata: result.metadata as SubmissionMetadata
      })) as Submission[]
    }

    const results = await query.execute()
    return results.map(result => ({
      ...result,
      metadata: result.metadata as SubmissionMetadata
    })) as Submission[]
  }

  static async listRecent(limit: number = 5): Promise<Submission[]> {
    const results = await drizzleDb
      .select()
      .from(submissions)
      .orderBy(desc(submissions.createdAt))
      .limit(limit)
      .execute()

    return results.map(result => ({
      ...result,
      metadata: result.metadata as SubmissionMetadata
    })) as Submission[]
  }

  static async create(data: CreateSubmissionInput): Promise<void> {
    const id = nanoid()
    const now = new Date()

    // Then create the submission
    await drizzleDb.insert(submissions).values({
      id,
      campaignId: data.campaignId,
      type: data.type,
      content: data.content,
      metadata: data.metadata || {},
      projectId: data.projectId || 'milanote_project_001',
      createdAt: now,
      updatedAt: now,
    }).execute()
  }

  static async updateStatus(id: string, status: 'pending' | 'approved' | 'rejected'): Promise<void> {
    const submission = await this.getById(id)
    if (!submission) throw new Error('Submission not found')

    const metadata = {
      ...submission.metadata,
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
  }
}