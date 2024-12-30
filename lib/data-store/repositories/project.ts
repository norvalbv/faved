import { drizzleDb } from '..'
import { projects } from '../schema/projects'
import { briefs } from '../schema/briefs'
import { eq } from 'drizzle-orm'
import type { Project } from '../schema/projects'

export class ProjectRepository {
  static async getById(id: string): Promise<Project | null> {
    const [result] = await drizzleDb
      .select()
      .from(projects)
      .where(eq(projects.id, id))
      .limit(1)
      .execute()
    
    return result || null
  }

  static async list(): Promise<Project[]> {
    return drizzleDb
      .select()
      .from(projects)
      .execute()
  }

  static async getByBriefId(briefId: string): Promise<Project | null> {
    const [result] = await drizzleDb
      .select({
        project: projects
      })
      .from(projects)
      .innerJoin(briefs, eq(briefs.projectId, projects.id))
      .where(eq(briefs.id, briefId))
      .limit(1)
      .execute()
    
    return result?.project || null
  }
}