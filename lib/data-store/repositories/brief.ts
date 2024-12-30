import { eq } from 'drizzle-orm'
import { drizzleDb } from '..'
import { briefs } from '../schema'
import { nanoid } from 'nanoid'
import type { NewBrief } from '../schema/briefs'

export class BriefRepository {
  static async create(data: Omit<NewBrief, 'id' | 'createdAt' | 'updatedAt'>) {
    const id = nanoid()
    const now = new Date()
    
    await drizzleDb.insert(briefs).values({
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
      .from(briefs)
      .where(eq(briefs.id, id))
      .limit(1)
      .execute()
    return result
  }

  static async list() {
    return drizzleDb
      .select()
      .from(briefs)
      .orderBy(briefs.createdAt)
      .execute()
  }
} 