'use server'

import { parse } from 'csv-parse/sync'
import { createSubmission } from './submissions'
import { auth } from '@/lib/utils/auth'

interface CSVRecord {
  id: string
  campaignId?: string
  message?: string
  type?: string
  sender?: string
  offerId?: string
  userId?: string
  stageId?: string
  input?: string
  dateInput?: string
  attachments?: string
  submitted?: string
  approved?: string
  feedback?: string
  feedbackAttachments?: string
  createdAt?: string
}

const parseBoolean = (value: string): boolean => {
  return value?.toLowerCase() === 'true'
}

export async function importSubmissions(fileContent: string) {
  try {
    // 1. Verify user is logged in
    const { userId } = auth()
    if (!userId) {
      throw new Error('Unauthorized')
    }

    // 2. Parse CSV content using csv-parse
    const records = parse(fileContent, {
      columns: true,
      skip_empty_lines: true,
      trim: true,
    }) as CSVRecord[]

    // 3. Process each record
    const results = []
    for (const record of records) {
      try {
        // Skip if no message
        if (!record.message?.trim()) {
          results.push({
            success: false,
            error: 'Missing message',
            record,
          })
          continue
        }

        const message = record.message.trim()

        // Create submission (this will also handle campaign creation)
        const submissionResult = await createSubmission({
          briefId: record.campaignId?.trim() || 'imported_brief', // Use campaignId as briefId or default
          content: message,
          metadata: {
            type: record.type || 'content',
            message,
            stageId: record.stageId || '1',
            input: record.input || '',
            sender: record.sender || 'Anonymous',
            submitted: parseBoolean(record.submitted || ''),
            importMetadata: {
              imported: true,
              importedAt: new Date().toISOString()
            }
          }
        })

        if (submissionResult.success) {
          results.push({
            success: true,
            data: { 
              campaignId: submissionResult.campaignId,
              message 
            }
          })
        } else {
          results.push({
            success: false,
            error: submissionResult.error,
            record,
          })
        }
      } catch (error) {
        console.error('Error processing record:', error)
        results.push({
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error',
          record,
        })
      }
    }

    const successCount = results.filter(r => r.success).length
    const failureCount = results.filter(r => !r.success).length

    return {
      success: true,
      summary: {
        total: results.length,
        successful: successCount,
        failed: failureCount
      },
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