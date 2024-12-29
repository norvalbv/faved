import { db } from '../index'
import { briefs } from '../schema'

async function seed() {
  try {
    const now = new Date()
    // Insert sample briefs
    await db.insert(briefs).values([
      {
        id: 'game-design',
        title: 'Game Design Brief',
        type: 'game_design',
        description: 'Create engaging game design content',
        overview: JSON.stringify({
          title: 'Game Design Brief Overview',
          description: 'Create engaging content about game design principles'
        }),
        guidelines: JSON.stringify([
          'Focus on core game mechanics',
          'Explain design decisions clearly'
        ]),
        examples: JSON.stringify([
          'Game mechanic analysis videos',
          'Design process breakdowns'
        ]),
        createdAt: now,
        updatedAt: now
      },
      {
        id: 'filmmaking',
        title: 'Filmmaking Brief',
        type: 'filmmaking',
        description: 'Create compelling video content',
        overview: JSON.stringify({
          title: 'Filmmaking Brief Overview',
          description: 'Create engaging content about filmmaking techniques'
        }),
        guidelines: JSON.stringify([
          'Focus on cinematography techniques',
          'Explain storytelling through visuals'
        ]),
        examples: JSON.stringify([
          'Camera movement tutorials',
          'Lighting setup guides'
        ]),
        createdAt: now,
        updatedAt: now
      }
    ])
    
    console.log('Database seeded successfully')
  } catch (error) {
    console.error('Seeding failed:', error)
    process.exit(1)
  }
}

seed() 