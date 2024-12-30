'use server'

import { parse } from 'csv-parse/sync'
import { SubmissionRepository } from '../data-store/repositories/submission'
import { CampaignRepository } from '../data-store/repositories/campaign'
import { BriefRepository } from '../data-store/repositories/brief'
import { auth } from '../utils/auth'

type CSVRow = {
  id: string
  createdAt: string
  campaignId: string
  input: string
  userId?: string
  projectId?: string
  sender?: string
  message?: string
  type?: string
  stageId?: string
  dateInput?: string
  attachments?: string
  submitted?: string
  approved?: string
  feedback?: string
  feedbackAttachments?: string
}

// Helper function to wait
const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

// Helper function to verify campaign exists
async function verifyCampaignExists(campaignId: string, retries = 3): Promise<boolean> {
  for (let i = 0; i < retries; i++) {
    const campaign = await CampaignRepository.getById(campaignId)
    if (campaign) return true
    await wait(1000) // Wait 1 second between retries
  }
  return false
}

// Helper function to create campaign with retries
async function createCampaignWithRetries(
  campaignId: string, 
  data: any, 
  briefId: string, 
  userId: string,
  retries = 3
): Promise<string | null> {
  for (let i = 0; i < retries; i++) {
    try {
      // Check if it exists first
      console.log(`Checking if campaign ${campaignId} exists...`)
      const existing = await CampaignRepository.getById(campaignId)
      if (existing) {
        console.log(`Campaign ${campaignId} already exists, using it`)
        return campaignId
      }

      // Create campaign without ID (let database generate a new one)
      console.log(`Creating new campaign for import ${campaignId}...`)
      const campaignData = {
        title: `${data.sender || 'Anonymous'}'s Submission`,
        description: data.message || data.input.slice(0, 100) + (data.input.length > 100 ? '...' : ''),
        status: 'active' as const,
        briefId: briefId,
        metadata: {
          submissionType: data.type || 'content',
          userId,
          isHistoricalImport: true,
          importId: campaignId // Store the original import ID in metadata
        }
      }
      
      const result = await CampaignRepository.create(campaignData)
      if (!result || !result.id) {
        console.error('Campaign creation failed - no result ID')
        continue
      }

      // Verify the campaign was created with the new ID
      const created = await CampaignRepository.getById(result.id)
      if (created) {
        console.log(`Successfully created new campaign ${result.id} for import ${campaignId}`)
        return result.id
      } else {
        console.error(`Campaign creation verification failed for ${result.id}`)
      }
    } catch (error) {
      console.error(`Retry ${i + 1}: Error creating campaign ${campaignId}:`, error)
      if (error instanceof Error) {
        console.error('Error details:', {
          name: error.name,
          message: error.message,
          stack: error.stack
        })
      }
    }
    
    // Shorter wait before retry
    console.log(`Waiting before retry ${i + 2}...`)
    await wait(500) // Reduced from 2000ms to 500ms
  }
  return null
}

export async function importSubmissions(csvContent: string) {
  try {
    // 1. Verify user is logged in
    const { userId } = auth()
    if (!userId) {
      throw new Error('Unauthorized')
    }

    // 2. Get or create historical brief
    const historicalBriefId = 'pajRvpSfNyBKk7KelaDu'  // ID from the database
    let historicalBrief = await BriefRepository.getById(historicalBriefId)
    
    if (!historicalBrief) {
      // Create the historical brief if it doesn't exist
      const newBrief = await BriefRepository.create({
        title: 'Historical Import',
        description: 'Auto-generated brief for historically imported submissions',
        type: 'visual_creator',
        projectId: null,
        metadata: {
          requirements: 'Historical import - requirements unknown',
          userId
        }
      })
      historicalBrief = await BriefRepository.getById(newBrief.id)
      if (!historicalBrief) throw new Error('Failed to create historical brief')
      console.log('Created historical brief:', historicalBrief.id)
    }

    // 3. Parse CSV content
    const records = parse(csvContent, {
      columns: true,
      skip_empty_lines: true,
      trim: true
    }) as CSVRow[]

    console.log('Parsed CSV records:', records.length)

    // 4. Group records by campaignId
    const campaignGroups = new Map<string, CSVRow[]>()
    records.forEach(row => {
      if (!campaignGroups.has(row.campaignId)) {
        campaignGroups.set(row.campaignId, [])
      }
      campaignGroups.get(row.campaignId)?.push(row)
    })

    // 5. Create campaigns
    const campaignIdMap = new Map<string, string>()
    const failedCampaigns = new Set<string>()

    for (const [importId, rows] of campaignGroups) {
      const firstRow = rows[0]
      if (!firstRow) {
        console.error('No data found for import ID:', importId)
        failedCampaigns.add(importId)
        continue
      }

      const newCampaignId = await createCampaignWithRetries(importId, firstRow, historicalBrief.id, userId)
      if (newCampaignId) {
        campaignIdMap.set(importId, newCampaignId)
        console.log(`Import ID ${importId} mapped to campaign ${newCampaignId}`)
      } else {
        console.error('Failed to create campaign for import ID:', importId)
        failedCampaigns.add(importId)
      }

      await wait(100)
    }

    console.log(`Campaign creation summary: ${campaignIdMap.size} successful, ${failedCampaigns.size} failed`)
    
    // 6. Process submissions with their feedback
    const results: { id: string; success: boolean; error?: string }[] = []
    
    for (const [importId, rows] of campaignGroups) {
      if (failedCampaigns.has(importId)) {
        results.push(...rows.map(row => ({
          id: row.id,
          success: false,
          error: 'Campaign creation failed'
        })))
        continue
      }

      const actualCampaignId = campaignIdMap.get(importId)
      if (!actualCampaignId) {
        results.push(...rows.map(row => ({
          id: row.id,
          success: false,
          error: 'Campaign ID mapping not found'
        })))
        continue
      }

      try {
        // Find the initial submission (first row)
        const mainRow = rows[0]
        const otherRows = rows.slice(1)

        console.log('Processing main row:', {
          message: mainRow.message,
          feedback: mainRow.feedback,
          dateInput: mainRow.dateInput,
          createdAt: mainRow.createdAt
        })

        // Convert boolean strings to actual booleans
        const submitted = mainRow.submitted?.toLowerCase() === 'true'
        const approved = mainRow.approved?.toLowerCase() === 'true'

        // Build feedback history from all rows
        const feedbackHistory = []
        
        // Process main row
        if (mainRow.message) {
          console.log('Adding feedback from main row:', mainRow.message)
          const isApproval = mainRow.message.toLowerCase().includes('approved')
          feedbackHistory.push({
            feedback: mainRow.message,
            createdAt: mainRow.dateInput || mainRow.createdAt || new Date().toISOString(),
            status: isApproval ? 'approved' : 'comment'
          })
        }

        // Process subsequent rows in chronological order
        const sortedRows = otherRows.sort((a, b) => {
          const dateA = new Date(a.dateInput || a.createdAt)
          const dateB = new Date(b.dateInput || b.createdAt)
          return dateA.getTime() - dateB.getTime()
        })

        console.log('Other rows to process:', otherRows.length)
        
        for (const row of sortedRows) {
          if (row.message) {
            console.log('Adding feedback from subsequent row:', row.message)
            const isApproval = row.message.toLowerCase().includes('approved')
            feedbackHistory.push({
              feedback: row.message,
              createdAt: row.dateInput || row.createdAt || new Date().toISOString(),
              status: isApproval ? 'approved' : 'comment'
            })
          }
        }

        console.log('Final feedback history:', feedbackHistory)

        // Create the main submission with all feedback
        const submissionData = {
          type: mainRow.type || 'content',
          content: mainRow.input || '',
          campaignId: actualCampaignId,
          projectId: mainRow.projectId || 'milanote_project_001',
          metadata: {
            userId: mainRow.userId || '',
            sender: mainRow.sender || 'Anonymous',
            stageId: mainRow.stageId || '1',
            status: approved ? 'approved' : 'pending',
            submitted,
            approved,
            feedbackHistory,
            attachments: mainRow.attachments ? mainRow.attachments.split(',').map(url => url.trim()) : [],
            feedbackAttachments: mainRow.feedbackAttachments ? mainRow.feedbackAttachments.split(',').map(url => url.trim()) : [],
            isHistoricalImport: true,
            skipAiResponse: true
          }
        }

        console.log('Creating submission with data:', JSON.stringify(submissionData, null, 2))
        
        await SubmissionRepository.create(submissionData)

        console.log(`Created submission with ${feedbackHistory.length} feedback entries for campaign:`, actualCampaignId)
        results.push(...rows.map(row => ({ id: row.id, success: true })))
      } catch (error) {
        console.error(`Error processing campaign ${importId}:`, error)
        results.push(...rows.map(row => ({
          id: row.id,
          success: false,
          error: (error as Error).message
        })))
      }
    }

    // 7. Return summary
    const successful = results.filter(r => r.success).length
    const failed = results.filter(r => !r.success).length

    return {
      success: true,
      message: `Imported ${successful} submissions. ${failed} failed. Campaigns: ${campaignIdMap.size} created, ${failedCampaigns.size} failed.`,
      details: results
    }
  } catch (error) {
    console.error('Error importing submissions:', error)
    return {
      success: false,
      message: (error as Error).message,
      details: []
    }
  }
} 