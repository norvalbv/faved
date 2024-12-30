import { eq, count } from 'drizzle-orm'
import { drizzleDb } from '..'
import { campaigns, submissions } from '../schema'
import { nanoid } from 'nanoid'
import type { Campaign } from '@/lib/types/campaign'

type CreateCampaignInput = {
  id?: string
  title: string
  description: string
  status: 'active' | 'draft' | 'completed'
  briefId: string
  projectId?: string
  metadata?: Record<string, unknown>
}

export class CampaignRepository {
  static async getById(id: string): Promise<Campaign | null> {
    const [result] = await drizzleDb
      .select()
      .from(campaigns)
      .where(eq(campaigns.id, id))
      .limit(1)
      .execute()
    return result ? {
      ...result,
      metadata: result.metadata as Record<string, unknown> | null
    } : null
  }

  static async list(): Promise<Campaign[]> {
    const results = await drizzleDb
      .select()
      .from(campaigns)
      .execute()
    
    return results.map(result => ({
      ...result,
      metadata: result.metadata as Record<string, unknown> | null
    }))
  }

  static async listWithSubmissionCount(): Promise<(Campaign & { submissionCount: number })[]> {
    const results = await drizzleDb
      .select({
        id: campaigns.id,
        title: campaigns.title,
        description: campaigns.description,
        status: campaigns.status,
        briefId: campaigns.briefId,
        projectId: campaigns.projectId,
        metadata: campaigns.metadata,
        createdAt: campaigns.createdAt,
        updatedAt: campaigns.updatedAt,
        submissionCount: count(submissions.id)
      })
      .from(campaigns)
      .leftJoin(submissions, eq(submissions.campaignId, campaigns.id))
      .groupBy(campaigns.id)
      .execute()
    
    return results.map(result => ({
      ...result,
      metadata: result.metadata as Record<string, unknown> | null,
      submissionCount: Number(result.submissionCount)
    })) as (Campaign & { submissionCount: number })[]
  }

  static async findByBriefId(briefId: string): Promise<Campaign | null> {
    const [result] = await drizzleDb
      .select()
      .from(campaigns)
      .where(eq(campaigns.briefId, briefId))
      .orderBy(campaigns.createdAt)
      .limit(1)
      .execute()
    
    return result ? {
      ...result,
      metadata: result.metadata as Record<string, unknown> | null
    } : null
  }

  static async create(data: CreateCampaignInput): Promise<Campaign> {
    const id = data.id || nanoid()
    const now = new Date()

    // Create new campaign
    const campaign = {
      id,
      title: data.title,
      description: data.description,
      status: data.status,
      briefId: data.briefId,
      projectId: data.projectId || 'milanote_project_001', // Use default project ID if not provided
      metadata: data.metadata || {},
      createdAt: now,
      updatedAt: now,
    }

    await drizzleDb
      .insert(campaigns)
      .values(campaign)
      .execute()

    return {
      ...campaign,
      metadata: campaign.metadata as Record<string, unknown> | null
    }
  }
} 