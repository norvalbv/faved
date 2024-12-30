import { neon } from '@neondatabase/serverless'
import { drizzle } from 'drizzle-orm/neon-http'
import { submissions } from '../lib/data-store/schema'
import { desc } from 'drizzle-orm'

const sql = neon(process.env.DATABASE_URL!)
const db = drizzle(sql)

async function main() {
  const [firstRow] = await db
    .select()
    .from(submissions)
    .orderBy(desc(submissions.createdAt))
    .limit(1)

  console.log('First row:', JSON.stringify(firstRow, null, 2))
}

main().catch(console.error) 