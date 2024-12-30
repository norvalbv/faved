import { neon } from '@neondatabase/serverless'
import { drizzle } from 'drizzle-orm/neon-http'
import { submissions } from '../lib/data-store/schema'
import { eq } from 'drizzle-orm'

const sql = neon(process.env.DATABASE_URL!)
const db = drizzle(sql)

const CAMPAIGN_ID = '021b7fc2-b4cb-4d6f-81f9-04e3e0cba46f'

async function main() {
  // Get all submissions
  const allSubmissions = await db
    .select()
    .from(submissions)

  console.log(`Found ${allSubmissions.length} submissions to update...`)

  for (const submission of allSubmissions) {
    const metadata = submission.metadata as any
    
    // Update metadata with campaign ID
    const updatedMetadata = {
      ...metadata,
      campaignId: CAMPAIGN_ID
    }

    // Update the submission
    await db.update(submissions)
      .set({ 
        metadata: updatedMetadata,
        campaignId: CAMPAIGN_ID
      })
      .where(eq(submissions.id, submission.id))

    console.log(`Updated submission ${submission.id}`)
  }

  console.log('All submissions updated!')

  // Verify one submission
  const [firstSubmission] = await db
    .select()
    .from(submissions)
    .limit(1)

  console.log('Sample submission:', JSON.stringify(firstSubmission, null, 2))
}

main().catch(console.error) 