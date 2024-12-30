import { Submission, SubmissionMetadata } from '@/lib/types/submission'
import { submissions } from '../schema'
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

    await drizzleDb.insert(submissions).values({
      id,
      campaignId: data.campaignId,
      type: data.type,
      content: data.content,
      metadata: data.metadata,
      projectId: data.projectId || 'milanote_project_001',
      createdAt: now,
      updatedAt: now,
    }).execute()
  }

  static async updateStatus(id: string, status: 'pending' | 'approved' | 'rejected', feedback?: string): Promise<void> {
    const submission = await this.getById(id)
    if (!submission) throw new Error('Submission not found')

    // Determine stage based on status
    let stageId = '1' // Default stage
    if (status === 'approved') {
      stageId = '5'
    } else if (status === 'rejected') {
      stageId = '3'
    } else if (feedback) {
      stageId = '2'
    }

    const feedbackEntry = feedback ? {
      feedback,
      createdAt: new Date().toISOString(),
      status: status === 'approved' ? 'approved' : status === 'rejected' ? 'rejected' : 'changes_requested'
    } : null

    const metadata = {
      ...submission.metadata,
      status,
      stageId,
      approved: status === 'approved',
      feedbackHistory: [
        ...(submission.metadata.feedbackHistory || []),
        ...(feedbackEntry ? [feedbackEntry] : [])
      ]
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

  static async addFeedback(id: string, feedback: string): Promise<void> {
    const submission = await this.getById(id)
    if (!submission) throw new Error('Submission not found')

    const metadata = {
      ...submission.metadata,
      stageId: '2', // Set to stage 2 when feedback is added
      feedbackHistory: [
        ...(submission.metadata.feedbackHistory || []),
        {
          feedback,
          createdAt: new Date().toISOString(),
          status: 'comment'
        }
      ]
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

  static async updateMetadata(id: string, metadata: SubmissionMetadata): Promise<void> {
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