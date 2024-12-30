import { eq } from 'drizzle-orm'
import { drizzleDb } from '..'
import { campaigns } from '../schema'
import { nanoid } from 'nanoid'
import type { NewCampaign } from '../schema/campaigns'

export class CampaignRepository {
  static async create(data: Omit<NewCampaign, 'id' | 'createdAt' | 'updatedAt'>) {
    const id = nanoid()
    const now = new Date()
    
    await drizzleDb.insert(campaigns).values({
      id,
      ...data,
      createdAt: now,
      updatedAt: now,
    }).execute()

    return { id, ...data, createdAt: now, updatedAt: now }
  }

  static async getById(id: string) {
    const [result] = await drizzleDb
      .select()
      .from(campaigns)
      .where(eq(campaigns.id, id))
      .limit(1)
      .execute()
    return result
  }

  static async list() {
    return drizzleDb
      .select()
      .from(campaigns)
      .orderBy(campaigns.createdAt)
      .execute()
  }

  static async update(id: string, data: Partial<Omit<NewCampaign, 'id' | 'createdAt' | 'updatedAt'>>) {
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