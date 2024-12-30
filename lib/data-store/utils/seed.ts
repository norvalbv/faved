import { drizzleDb } from '..'
import { briefs } from '../schema'
import { ALL_BRIEFS } from '../constants/briefs'

async function seed() {
  console.log('🌱 Seeding database...')

  try {
    // Insert briefs
    for (const brief of ALL_BRIEFS) {
      await drizzleDb.insert(briefs).values({
        id: brief.id,
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