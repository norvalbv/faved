'use server'

import { SubmissionRepository } from '@/lib/data-store/repositories/submission'
import { auth } from '@/lib/utils/auth'
import type { SubmissionMetadata } from '@/lib/types/submission'

export async function importSubmissions(fileContent: string) {
  try {
    // 1. Verify user is logged in
    const { userId } = auth()
    if (!userId) {
      throw new Error('Unauthorized')
    }

    // 2. Parse CSV content
    const lines = fileContent.split('\n')
    const headers = lines[0].split(',')
    const records = lines.slice(1).map(line => {
      // Split by comma but respect quotes
      const values = line.match(/(?:\"([^\"]*(?:\"\"[^\"]*)*)\")|([^\",]+)/g) || []
      const record: Record<string, string> = {}
      
      headers.forEach((header, index) => {
        let value = values[index] || ''
        // Remove quotes and clean the value
        value = value.replace(/^"|"$/g, '').trim()
        record[header.trim()] = value
      })
      
      return record
    }).filter(record => {
      // Validate required fields
      return record.input && record.id
    })

    // 3. Process each record
    const results = []
    for (const record of records) {
      try {
        const metadata: SubmissionMetadata = {
          id: record.id,
          createdAt: record.createdAt,
          campaignId: record.campaignId,
          offerId: record.offerId,
          sender: record.sender,
          message: record.message,
          type: record.type,
          userId: record.userId,
          stageId: record.stageId,
          input: record.input,
          dateInput: record.dateInput,
          attachments: record.attachments,
          submitted: record.submitted === 'true',
          approved: record.approved === 'true',
          feedback: record.feedback,
          feedbackAttachments: record.feedbackAttachments
        }

        // Create submission
        const submission = await SubmissionRepository.create({
          briefId: record.campaignId || record.id, // Use campaignId if available, fallback to id
          type: 'submission',
          content: record.input,
          status: record.approved === 'true' ? 'approved' : 'pending',
          metadata
        })

        results.push({
          success: true,
          data: submission,
        })
      } catch (error) {
        console.error('Error processing record:', error)
        results.push({
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error',
        })
      }
    }

    return {
      success: true,
      results,
    }
  } catch (error) {
    console.error('Error importing submissions:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
} 