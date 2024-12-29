'use server'

import { parse } from 'csv-parse'
import { db } from '../../data-store'
import { submissions, feedback } from '../../data-store/schema'
import { nanoid } from 'nanoid'
import { eq } from 'drizzle-orm'
import { requireAuth } from './auth'

interface ActivityRecord {
  input: string
  feedback: string
  message: string
  brief_id: string
  influencer_id: string
  timestamp: string
}

export async function importActivities(fileContent: string) {
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
  records.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())

  for (const record of records) {
    const timestamp = new Date(record.timestamp)
    
    if (record.message.toLowerCase().includes('submitted')) {
      // Create submission
      await db.insert(submissions).values({
        id: nanoid(),
        briefId: record.brief_id,
        type: 'draft_script', // Default to draft_script for now
        content: record.input,
        status: 'pending',
        createdAt: timestamp,
        updatedAt: timestamp,
      })
    } 
    else if (record.message.toLowerCase().includes('feedback') && record.feedback) {
      // Create feedback
      await db.insert(feedback).values({
        id: nanoid(),
        submissionId: record.brief_id, // We'll need to update this to link to actual submission
        type: 'suggestion',
        content: record.feedback,
        createdAt: timestamp,
        updatedAt: timestamp,
      })
    }
    else if (record.message.toLowerCase().includes('approved')) {
      // Update submission status
      await db
        .update(submissions)
        .set({ 
          status: 'approved',
          updatedAt: timestamp,
        })
        .where(eq(submissions.briefId, record.brief_id))
    }
    else if (record.message.toLowerCase().includes('rejected')) {
      // Update submission status
      await db
        .update(submissions)
        .set({ 
          status: 'rejected',
          updatedAt: timestamp,
        })
        .where(eq(submissions.briefId, record.brief_id))

      // Create a "fake" original submission based on feedback
      if (record.feedback) {
        await db.insert(submissions).values({
          id: nanoid(),
          briefId: record.brief_id,
          type: 'draft_script',
          content: generateRejectedContent(record.input, record.feedback),
          status: 'rejected',
          createdAt: new Date(timestamp.getTime() - 1000), // 1 second before
          updatedAt: timestamp,
        })
      }
    }
  }

  return { success: true }
}

function generateRejectedContent(approvedContent: string, feedback: string): string {
  // TODO: Implement more sophisticated content generation
  // For now, we'll just make some basic modifications based on the feedback
  let rejectedContent = approvedContent

  // Remove key points mentioned in feedback
  const keyPoints = extractKeyPoints(feedback)
  for (const point of keyPoints) {
    rejectedContent = rejectedContent.replace(point, '')
  }

  return rejectedContent
}

function extractKeyPoints(feedback: string): string[] {
  // TODO: Implement more sophisticated key point extraction
  // For now, we'll just split on common markers
  return feedback
    .split(/[.,;]/)
    .map(point => point.trim())
    .filter(point => point.length > 10) // Only keep substantial points
} 