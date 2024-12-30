import { neon } from '@neondatabase/serverless'
import { drizzle } from 'drizzle-orm/neon-http'
import { campaigns } from '../lib/data-store/schema'

const sql = neon(process.env.DATABASE_URL!)
const db = drizzle(sql)

async function main() {
  const allCampaigns = await db
    .select()
    .from(campaigns)

  console.log('All campaigns:', JSON.stringify(allCampaigns, null, 2))
}

main().catch(console.error) 