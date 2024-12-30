import { neon } from '@neondatabase/serverless'
import { drizzle } from 'drizzle-orm/neon-http'
import { campaigns } from '../lib/data-store/schema'

const sql = neon(process.env.DATABASE_URL!)
const db = drizzle(sql)

async function main() {
  // Insert the campaign from your example
  await db.insert(campaigns).values({
    id: '021b7fc2-b4cb-4d6f-81f9-04e3e0cba46f',
    title: 'Milanote Campaign',
    description: 'Campaign for Milanote content creators',
    status: 'active',
    metadata: {
      client: 'Milanote',
      platform: 'YouTube'
    },
    createdAt: new Date('2024-11-25T19:01:26.423Z'),
    updatedAt: new Date()
  })

  console.log('Campaign created!')

  // Verify it was created
  const allCampaigns = await db
    .select()
    .from(campaigns)

  console.log('All campaigns:', JSON.stringify(allCampaigns, null, 2))
}

main().catch(console.error) 