import { eq } from 'drizzle-orm'
import { drizzleDb } from '../index'
import { briefs } from '../schema'
import { nanoid } from 'nanoid'

export class BriefRepository {
  static async create(data: {
    title: string
    type: 'game_design' | 'visual_creator' | 'filmmaking' | 'logo_design' | 'booktuber'
    description: string
    overview: Record<string, unknown>
    guidelines: Record<string, unknown>
    examples?: Record<string, unknown>
  }) {
    const now = new Date()
    return drizzleDb.insert(briefs).values({
      id: nanoid(),
      ...data,
      createdAt: now,
      updatedAt: now,
    })
  }

  static async getById(id: string) {
    const results = await drizzleDb
      .select()
      .from(briefs)
      .where(eq(briefs.id, id))
      .limit(1)
    return results[0]
  }

  static async list() {
    return drizzleDb
      .select()
      .from(briefs)
      .orderBy(briefs.createdAt)
  }
} 