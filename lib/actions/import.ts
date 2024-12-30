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

    // 4. Validate required fields
    const invalidRows = records.filter(row => !row.input || !row.campaignId)
    if (invalidRows.length > 0) {
      throw new Error(`Missing required fields in rows: ${invalidRows.map(row => row.id || 'unknown').join(', ')}`)
    }

    // 5. First, create all campaigns sequentially
    const uniqueCampaigns = [...new Set(records.map(row => row.campaignId))]
    console.log('Unique campaigns to process:', uniqueCampaigns.length)
    
    const campaignIdMap = new Map<string, string>() // Map of import ID to actual ID
    const failedCampaigns = new Set<string>()

    for (const importId of uniqueCampaigns) {
      const firstRow = records.find(row => row.campaignId === importId)
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

      // Shorter wait between campaigns
      await wait(100) // Reduced from 1000ms to 100ms
    }

    console.log(`Campaign creation summary: ${campaignIdMap.size} successful, ${failedCampaigns.size} failed`)
    
    // Shorter wait after all campaigns are created
    await wait(500) // Reduced from 2000ms to 500ms

    // Process submissions in batches of 10 for better performance
    const batchSize = 10
    const results: { id: string; success: boolean; error?: string }[] = []
    
    for (let i = 0; i < records.length; i += batchSize) {
      const batch = records.slice(i, i + batchSize)
      const batchResults = await Promise.all(batch.map(async (row) => {
        try {
          // Skip submissions for failed campaigns
          if (failedCampaigns.has(row.campaignId)) {
            console.log(`Skipping submission for failed campaign: ${row.campaignId}`)
            return { 
              id: row.id, 
              success: false, 
              error: 'Campaign creation failed' 
            }
          }

          // Get the actual campaign ID (might be the same as original)
          const actualCampaignId = campaignIdMap.get(row.campaignId)
          if (!actualCampaignId) {
            console.error(`No campaign ID mapping found for ${row.campaignId}`)
            return { 
              id: row.id, 
              success: false, 
              error: 'Campaign ID mapping not found' 
            }
          }

          // Convert boolean strings to actual booleans
          const submitted = row.submitted?.toLowerCase() === 'true'
          const approved = row.approved?.toLowerCase() === 'true'

          // Parse feedback if exists
          const feedbackHistory = row.feedback ? [{
            feedback: row.feedback,
            createdAt: new Date().toISOString(),
            status: approved ? 'approved' : 'comment'
          }] : []

          // Create submission with actual campaign ID
          await SubmissionRepository.create({
            type: row.type || 'content',
            content: row.input,
            campaignId: actualCampaignId,
            projectId: row.projectId || 'milanote_project_001',
            metadata: {
              userId: row.userId,
              sender: row.sender,
              message: row.message,
              stageId: row.stageId || '1',
              status: approved ? 'approved' : 'pending',
              submitted,
              approved,
              feedbackHistory,
              attachments: row.attachments ? row.attachments.split(',').map(url => url.trim()) : [],
              feedbackAttachments: row.feedbackAttachments ? row.feedbackAttachments.split(',').map(url => url.trim()) : [],
              isHistoricalImport: true,
              skipAiResponse: true // Skip AI response for historical imports
            }
          })
          console.log('Created submission for campaign:', actualCampaignId)
          return { id: row.id, success: true }
        } catch (error) {
          console.error(`Error processing row ${row.id}:`, error)
          return { id: row.id, success: false, error: (error as Error).message }
        }
      }))
      results.push(...batchResults)

      // Small delay between batches
      if (i + batchSize < records.length) {
        await wait(50)
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