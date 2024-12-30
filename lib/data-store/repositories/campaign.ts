import { eq } from 'drizzle-orm'
import { drizzleDb } from '..'
import { campaigns } from '../schema'
import { nanoid } from 'nanoid'
import type { Campaign } from '@/lib/types/campaign'

export class CampaignRepository {
  static async create(
    data: Omit<Campaign, 'id' | 'createdAt' | 'updatedAt'>,
    customId?: string
  ): Promise<Campaign> {
    const id = customId || nanoid()
    const now = new Date()
    
    const campaign = {
      id,
      ...data,
      createdAt: now,
      updatedAt: now,
    }

    await drizzleDb.insert(campaigns).values(campaign).execute()
    return campaign
  }

  static async getById(id: string): Promise<Campaign | undefined> {
    const [result] = await drizzleDb
      .select()
      .from(campaigns)
      .where(eq(campaigns.id, id))
      .limit(1)
      .execute()
    return result as Campaign | undefined
  }

  static async list(): Promise<Campaign[]> {
    const results = await drizzleDb
      .select()
      .from(campaigns)
      .orderBy(campaigns.createdAt)
      .execute()
    return results as Campaign[]
  }

  static async update(id: string, data: Partial<Omit<Campaign, 'id' | 'createdAt' | 'updatedAt'>>): Promise<Campaign | undefined> {
    const now = new Date()
    await drizzleDb
      .update(campaigns)
      .set({ 
        ...data,
        updatedAt: now
      })
      .where(eq(campaigns.id, id))
      .execute()
    
    return this.getById(id)
  }
} 