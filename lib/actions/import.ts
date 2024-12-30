'use server'

import { SubmissionRepository } from '@/lib/data-store/repositories/submission'
import { auth } from '@/lib/utils/auth'

const BRIEF_ID = 'visual-creator-brief-1'

function mapSubmissionType(type: string) {
  switch (type.toLowerCase()) {
    case 'video topic':
      return 'video_topic' as const
    case 'draft script':
      return 'draft_script' as const
    case 'draft video':
      return 'draft_video' as const
    case 'live video':
      return 'live_video' as const
    default:
      throw new Error(`Invalid submission type: ${type}`)
  }
}

export async function importSubmissions(file: File) {
  try {
    // 1. Verify user is logged in
    const { userId } = auth()
    if (!userId) {
      throw new Error('Unauthorized')
    }

    // 2. Parse CSV file
    const text = await file.text()
    const records = text.split('\n').slice(1).map(line => {
      const [type, input, status] = line.split(',').map(s => s.trim())
      return { type, input, status }
    })

    // 3. Process each record
    const results = []
    for (const record of records) {
      try {
        // Skip empty lines
        if (!record.type || !record.input) {
          continue
        }

        // Create submission
        const submission = await SubmissionRepository.create({
          briefId: BRIEF_ID,
          influencerId: userId,
          type: mapSubmissionType(record.type),
          content: record.input,
          status: record.status === 'approved' ? 'approved' : 'pending',
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