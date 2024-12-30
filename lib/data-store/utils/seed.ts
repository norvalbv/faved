import { drizzleDb } from '..'
import { briefs } from '../schema'
import { ALL_BRIEFS } from '../constants/briefs'

async function seed() {
  console.log('🌱 Seeding database...')

  // Insert briefs
  for (const brief of ALL_BRIEFS) {
    await drizzleDb.insert(briefs).values({
      id: brief.id,
      type: brief.type,
      title: brief.title,
      description: brief.description,
      overview: brief.overview,
      guidelines: brief.guidelines,
      collaborationTimeline: brief.collaborationTimeline,
      examples: brief.examples,
      suggestions: 'suggestions' in brief ? brief.suggestions : null,
      productionTools: 'productionTools' in brief ? brief.productionTools : null,
      designProcess: 'designProcess' in brief ? brief.designProcess : null,
      writingTools: 'writingTools' in brief ? brief.writingTools : null,
      createdAt: brief.createdAt,
      updatedAt: brief.updatedAt
    }).onConflictDoUpdate({
      target: briefs.id,
      set: {
        type: brief.type,
        title: brief.title,
        description: brief.description,
        overview: brief.overview,
        guidelines: brief.guidelines,
        collaborationTimeline: brief.collaborationTimeline,
        examples: brief.examples,
        suggestions: 'suggestions' in brief ? brief.suggestions : null,
        productionTools: 'productionTools' in brief ? brief.productionTools : null,
        designProcess: 'designProcess' in brief ? brief.designProcess : null,
        writingTools: 'writingTools' in brief ? brief.writingTools : null,
        updatedAt: brief.updatedAt
      }
    })
  }

  console.log('✅ Database seeded!')
}

seed().catch(console.error) 