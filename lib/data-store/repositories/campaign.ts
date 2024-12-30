import { eq } from 'drizzle-orm'
import { drizzleDb } from '..'
import { campaigns } from '../schema'
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

    // Use a transaction to ensure atomicity
    return await drizzleDb.transaction(async (tx) => {
      // Check if campaign exists for this brief
      const [existing] = await tx
        .select()
        .from(campaigns)
        .where(eq(campaigns.briefId, data.briefId))
        .limit(1)
        .execute()

      if (existing) {
        return {
          ...existing,
          metadata: existing.metadata as Record<string, unknown> | null
        }
      }

      // Create new campaign if none exists
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

      await tx
        .insert(campaigns)
        .values(campaign)
        .execute()

      return {
        ...campaign,
        metadata: campaign.metadata as Record<string, unknown> | null
      }
    })
  }
} 