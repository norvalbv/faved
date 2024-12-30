'use server'

import { parse } from 'csv-parse'
import { requireAuth } from '../utils/auth'
import { SubmissionRepository } from '../data-store/repositories/submission'
import { FeedbackRepository } from '../data-store/repositories/feedback'
import { BriefRepository } from '../data-store/repositories/brief'

interface ActivityRecord {
  id: string
  createdAt: string
  campaignId: string
  offerId: string
  sender: string
  message: string
  type: string
  userId: string
  stageId: string
  input: string
  dateInput: string
  attachments: string
  submitted: string
  approved: string
  feedback: string
  feedbackAttachments: string
}

const mapSubmissionType = (type: string): 'video_topic' | 'draft_script' | 'draft_video' | 'live_video' => {
  switch (type) {
    case 'draft_script':
    case 'draft_video':
    case 'live_video':
      return type
    default:
      return 'video_topic'
  }
}

// Map all campaign IDs to our visual creator brief
const BRIEF_ID = 'visual-creator-brief-1'

export async function importActivities(fileContent: string) {
  try {
    // Only allow brand users to import data
    await requireAuth('brand')

    const records: ActivityRecord[] = []
    
    // Parse CSV content
    const parser = parse(fileContent, {
      columns: true,
      skip_empty_lines: true,
    })

    // Process each record
    for await (const record of parser) {
      records.push(record)
    }

    // Process records chronologically
    records.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())

    // Keep track of processed records
    const skippedRecords: ActivityRecord[] = []
    const successfulRecords: ActivityRecord[] = []

    // Verify brief exists
    const brief = await BriefRepository.getById(BRIEF_ID)
    if (!brief) {
      throw new Error('Visual creator brief not found')
    }

    for (const record of records) {
      try {
        // Skip if no input
        if (!record.input) {
          console.warn('Skipping record without input:', record)
          skippedRecords.push(record)
          continue
        }

        // Create submission
        const submission = await SubmissionRepository.create({
          briefId: BRIEF_ID,
          type: mapSubmissionType(record.type),
          content: record.input,
          status: record.approved === 'true' ? 'approved' : 'pending'
        })

        // Create feedback if exists
        if (record.feedback && submission) {
          await FeedbackRepository.create({
            submissionId: submission.id,
            type: record.approved === 'true' ? 'approval' : 'suggestion',
            content: record.feedback
          })
        }

        successfulRecords.push(record)
      } catch (error) {
        console.error('Error processing record:', error)
        skippedRecords.push(record)
      }
    }

    if (skippedRecords.length > 0) {
      console.warn(`Skipped ${skippedRecords.length} records:`, skippedRecords)
    }

    return { 
      success: true,
      processed: successfulRecords.length,
      skipped: skippedRecords.length,
      details: {
        successful: successfulRecords,
        skipped: skippedRecords
      }
    }
  } catch (error) {
    console.error('Import failed:', error)
    throw error
  }
} 