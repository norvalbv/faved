import { neon } from '@neondatabase/serverless'
import { drizzle } from 'drizzle-orm/neon-http'
import { submissions } from '../lib/data-store/schema'
import { desc, eq } from 'drizzle-orm'

const sql = neon(process.env.DATABASE_URL!)
const db = drizzle(sql)

async function main() {
  // Get all submissions
  const allSubmissions = await db
    .select()
    .from(submissions)
    .orderBy(desc(submissions.createdAt))

  console.log(`Found ${allSubmissions.length} submissions to fix...`)

  for (const submission of allSubmissions) {
    const metadata = submission.metadata as any
    
    // Extract the actual message from various fields
    const actualMessage = metadata.message || metadata.userId || metadata.input || submission.content
    const actualUserId = metadata.userId && !metadata.userId.includes('creative') ? metadata.userId : ''
    
    // Get campaign ID from metadata if it exists
    const campaignId = metadata.campaignId || submission.campaignId || null
    
    // Fix the metadata mapping
    const fixedMetadata = {
      id: submission.id,
      createdAt: submission.createdAt.toISOString(),
      campaignId: campaignId,
      sender: metadata.sender || '',
      message: actualMessage,
      type: submission.type,
      userId: actualUserId,
      input: actualMessage,
      dateInput: metadata.dateInput || '',
      submitted: Boolean(metadata.submitted),
      approved: Boolean(metadata.approved),
      feedback: metadata.feedback || '',
      attachments: metadata.attachments || '',
      feedbackAttachments: metadata.feedbackAttachments || ''
    }

    // Update the submission with fixed metadata
    await db.update(submissions)
      .set({ 
        metadata: fixedMetadata,
        content: actualMessage,
        campaignId: campaignId // Make sure to set the campaignId in the main record
      })
      .where(eq(submissions.id, submission.id))

    console.log(`Fixed submission ${submission.id}`)
  }

  console.log('All submissions fixed!')
}

main().catch(console.error) 