'use server'

import { parse } from 'csv-parse/sync'
import { SubmissionRepository } from '@/lib/data-store/repositories/submission'
import { CampaignRepository } from '@/lib/data-store/repositories/campaign'
import { auth } from '@/lib/utils/auth'
import type { SubmissionMetadata } from '@/lib/types/submission'
import type { Campaign } from '@/lib/types/campaign'

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

    // Track unique campaign IDs
    const campaignIds = new Set<string>()
    records.forEach(record => {
      if (record.campaignId?.trim()) {
        campaignIds.add(record.campaignId.trim())
      }
    })

    // Create missing campaigns
    for (const campaignId of campaignIds) {
      try {
        const existingCampaign = await CampaignRepository.getById(campaignId)
        if (!existingCampaign) {
          const campaign: Omit<Campaign, 'id' | 'createdAt' | 'updatedAt'> = {
            title: `Campaign ${campaignId.slice(0, 8)}`,
            description: 'Imported campaign',
            status: 'active',
            metadata: {}
          }
          await CampaignRepository.create(campaign, campaignId)
          console.log(`Created campaign: ${campaignId}`)
        }
      } catch (error) {
        console.error(`Failed to create campaign ${campaignId}:`, error)
        throw new Error(`Failed to create campaign ${campaignId}: ${error instanceof Error ? error.message : 'Unknown error'}`)
      }
    }

    // 3. Process each record
    const results = []
    for (const record of records) {
      try {
        // Skip if no message or campaign ID
        if (!record.message?.trim() || !record.campaignId?.trim()) {
          results.push({
            success: false,
            error: !record.message?.trim() ? 'Missing message' : 'Missing campaign ID',
            record,
          })
          continue
        }

        const campaignId = record.campaignId.trim()
        const message = record.message.trim()

        // Verify campaign exists
        const campaign = await CampaignRepository.getById(campaignId)
        if (!campaign) {
          results.push({
            success: false,
            error: `Campaign ${campaignId} not found`,
            record,
          })
          continue
        }

        // Create metadata object
        const metadata: SubmissionMetadata = {
          id: record.id,
          createdAt: record.createdAt || new Date().toISOString(),
          campaignId,
          offerId: record.offerId || '',
          sender: record.sender || '',
          message,
          type: record.type || 'content',
          userId: record.userId || '',
          stageId: record.stageId || '1',
          input: record.input || '',
          dateInput: record.dateInput || '',
          attachments: record.attachments || '',
          submitted: parseBoolean(record.submitted || ''),
          approved: parseBoolean(record.approved || ''),
          feedback: record.feedback || '',
          feedbackAttachments: record.feedbackAttachments || ''
        }

        // Create submission
        const submission = await SubmissionRepository.create({
          briefId: campaignId,
          type: 'submission',
          content: message,
          status: parseBoolean(record.approved || '') ? 'approved' : 'pending',
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
        failed: failureCount,
        campaignsCreated: campaignIds.size
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