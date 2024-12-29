import { nanoid } from 'nanoid'
import { eq } from 'drizzle-orm'
import { db } from '../index'
import { briefs } from '../schema'
import type { Brief } from '../schema/briefs'

type CreateBriefProps = Omit<Brief, 'id' | 'createdAt' | 'updatedAt'>

export class BriefRepository {
  static create({
    title,
    type,
    description,
    overview,
    guidelines,
    examples
  }: CreateBriefProps) {
    const timestamp = new Date()
    const briefData = {
      id: nanoid(),
      title,
      type,
      description,
      overview: JSON.stringify(overview),
      guidelines: JSON.stringify(guidelines),
      examples: examples ? JSON.stringify(examples) : null,
      createdAt: timestamp,
      updatedAt: timestamp
    } as const

    return db
      .insert(briefs)
      .values(briefData)
  }

  static async getById(id: string): Promise<Brief | undefined> {
    const [brief] = await db
      .select()
      .from(briefs)
      .where(eq(briefs.id, id))

    if (!brief) return undefined

    return {
      ...brief,
      overview: JSON.parse(brief.overview),
      guidelines: JSON.parse(brief.guidelines),
      examples: brief.examples ? JSON.parse(brief.examples) : undefined
    }
  }

  static async list(): Promise<Brief[]> {
    const results = await db
      .select()
      .from(briefs)

    return results.map(brief => ({
      ...brief,
      overview: JSON.parse(brief.overview),
      guidelines: JSON.parse(brief.guidelines),
      examples: brief.examples ? JSON.parse(brief.examples) : undefined
    }))
  }

  static update(id: string, data: Partial<Omit<Brief, 'id' | 'createdAt' | 'updatedAt'>>) {
    const updateData: Record<string, any> = {
      ...data,
      updatedAt: new Date()
    }

    if (data.overview) {
      updateData.overview = JSON.stringify(data.overview)
    }
    if (data.guidelines) {
      updateData.guidelines = JSON.stringify(data.guidelines)
    }
    if (data.examples) {
      updateData.examples = JSON.stringify(data.examples)
    }

    return db
      .update(briefs)
      .set(updateData)
      .where(eq(briefs.id, id))
  }

  static delete(id: string) {
    return db
      .delete(briefs)
      .where(eq(briefs.id, id))
  }
} 