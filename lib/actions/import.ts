'use server'

import { parse } from 'csv-parse'
import { requireAuth } from '../utils/auth'
import { SubmissionRepository } from '../../../data-store/repositories/submission'
import { FeedbackRepository } from '../../../data-store/repositories/feedback'

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
    if (record.message.toLowerCase().includes('submitted')) {
      // Create submission
      await SubmissionRepository.create({
        briefId: record.brief_id,
        type: 'draft_script', // Default to draft_script for now
        content: record.input,
        status: 'pending'
      })
    } 
    else if (record.message.toLowerCase().includes('feedback') && record.feedback) {
      // Find the latest submission for this brief
      const submissions = await SubmissionRepository.list(record.brief_id)
      const latestSubmission = submissions[0] // list() returns ordered by createdAt desc

      if (latestSubmission) {
        // Create feedback
        await FeedbackRepository.create({
          submissionId: latestSubmission.id,
          type: 'suggestion',
          content: record.feedback
        })
      }
    }
    else if (record.message.toLowerCase().includes('approved')) {
      // Find the latest submission for this brief
      const submissions = await SubmissionRepository.list(record.brief_id)
      const latestSubmission = submissions[0]

      if (latestSubmission) {
        await SubmissionRepository.updateStatus(latestSubmission.id, 'approved')
      }
    }
    else if (record.message.toLowerCase().includes('rejected')) {
      // Find the latest submission for this brief
      const submissions = await SubmissionRepository.list(record.brief_id)
      const latestSubmission = submissions[0]

      if (latestSubmission) {
        await SubmissionRepository.updateStatus(latestSubmission.id, 'rejected')

        // Create a "fake" original submission based on feedback
        if (record.feedback) {
          await SubmissionRepository.create({
            briefId: record.brief_id,
            type: 'draft_script',
            content: generateRejectedContent(record.input, record.feedback),
            status: 'rejected'
          })
        }
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