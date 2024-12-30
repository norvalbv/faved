import { drizzleDb } from '..'
import { briefs } from '../schema'
import { VISUAL_CREATOR_BRIEF } from '../constants/briefs'

async function seed() {
  console.log('🌱 Seeding database...')

  // Insert briefs
  await drizzleDb.insert(briefs).values({
    id: VISUAL_CREATOR_BRIEF.id,
    type: 'video_topic',
    title: VISUAL_CREATOR_BRIEF.title,
    description: VISUAL_CREATOR_BRIEF.description,
    metadata: {
      overview: VISUAL_CREATOR_BRIEF.overview,
      guidelines: VISUAL_CREATOR_BRIEF.guidelines,
      collaborationTimeline: VISUAL_CREATOR_BRIEF.collaborationTimeline,
      examples: VISUAL_CREATOR_BRIEF.examples,
    },
    createdAt: VISUAL_CREATOR_BRIEF.createdAt,
    updatedAt: VISUAL_CREATOR_BRIEF.updatedAt
  }).onConflictDoUpdate({
    target: briefs.id,
    set: {
      type: 'video_topic',
      title: VISUAL_CREATOR_BRIEF.title,
      description: VISUAL_CREATOR_BRIEF.description,
      metadata: {
        overview: VISUAL_CREATOR_BRIEF.overview,
        guidelines: VISUAL_CREATOR_BRIEF.guidelines,
        collaborationTimeline: VISUAL_CREATOR_BRIEF.collaborationTimeline,
        examples: VISUAL_CREATOR_BRIEF.examples,
      },
      updatedAt: VISUAL_CREATOR_BRIEF.updatedAt
    }
  })

  console.log('✅ Database seeded!')
}

seed().catch(console.error) 