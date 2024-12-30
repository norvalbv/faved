import { neon } from '@neondatabase/serverless'
import { drizzle } from 'drizzle-orm/neon-http'
import { submissions } from '../lib/data-store/schema'
import { eq } from 'drizzle-orm'

const sql = neon(process.env.DATABASE_URL!)
const db = drizzle(sql)

async function main() {
  const allSubmissions = await db
    .select()
    .from(submissions)

  console.log(`Found ${allSubmissions.length} submissions to fix...`)

  for (const submission of allSubmissions) {
    const metadata = submission.metadata as any
    
    // Move numeric content to stageId
    if (/^\d+$/.test(submission.content)) {
      metadata.stageId = submission.content
      
      // Use input as the actual content
      const actualContent = metadata.input || metadata.message || ''
      
      await db.update(submissions)
        .set({ 
          content: actualContent,
          metadata: {
            ...metadata,
            stageId: submission.content
          }
        })
        .where(eq(submissions.id, submission.id))

      console.log(`Fixed submission ${submission.id} - Stage: ${submission.content}`)
    }
  }

  console.log('All submissions fixed!')
}

main().catch(console.error) 