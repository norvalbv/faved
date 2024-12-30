import { drizzleDb } from '..'
import { briefs } from '../schema'
import { ALL_BRIEFS } from '../../constants/briefs'
import { projects } from '../schema/projects'

async function seed() {
  console.log('🌱 Seeding database...')

  try {
    // Insert Milanote project
    const projectId = 'milanote_project_001'
    await drizzleDb.insert(projects).values({
      id: projectId,
      title: 'Milanote',
      description: 'Milanote content creation project',
      status: 'active',
      metadata: {
        client: 'Milanote',
        platform: 'YouTube'
      },
      createdAt: new Date('2024-11-25T19:01:26.423Z'),
      updatedAt: new Date()
    }).onConflictDoUpdate({
      target: projects.id,
      set: {
        title: 'Milanote',
        description: 'Milanote content creation project',
        status: 'active',
        metadata: {
          client: 'Milanote',
          platform: 'YouTube'
        },
        updatedAt: new Date()
      }
    })

    // Insert briefs
    for (const brief of ALL_BRIEFS) {
      await drizzleDb.insert(briefs).values({
        id: brief.id,
        projectId,
        title: brief.title,
        description: brief.description,
        type: brief.type,
        metadata: {
          overview: brief.overview,
          guidelines: brief.guidelines,
          collaborationTimeline: brief.collaborationTimeline,
          examples: brief.examples,
          ...(brief.type === 'filmmaking' && { productionTools: brief.productionTools }),
          ...(brief.type === 'logo_design' && { designProcess: brief.designProcess }),
          ...(brief.type === 'booktuber' && { writingTools: brief.writingTools }),
          ...(brief.type === 'game_design' && { suggestions: brief.suggestions }),
        },
        createdAt: brief.createdAt,
        updatedAt: brief.updatedAt
      }).onConflictDoUpdate({
        target: briefs.id,
        set: {
          projectId,
          title: brief.title,
          description: brief.description,
          type: brief.type,
          metadata: {
            overview: brief.overview,
            guidelines: brief.guidelines,
            collaborationTimeline: brief.collaborationTimeline,
            examples: brief.examples,
            ...(brief.type === 'filmmaking' && { productionTools: brief.productionTools }),
            ...(brief.type === 'logo_design' && { designProcess: brief.designProcess }),
            ...(brief.type === 'booktuber' && { writingTools: brief.writingTools }),
            ...(brief.type === 'game_design' && { suggestions: brief.suggestions }),
          },
          updatedAt: brief.updatedAt
        }
      })
    }

    console.log('✅ Database seeded!')
  } catch (error) {
    console.error('❌ Seeding failed:', error)
    throw error
  }
}

seed().catch(console.error)