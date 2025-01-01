'use server'

import { drizzleDb } from '@/lib/data-store'
import { calibrationData, calibrationWeights } from '@/lib/data-store/schema'
import { ImportanceWeights } from '@/lib/types/calibration'
import { Submission } from '@/lib/types/submission'
import { Brief, BriefMetadata } from '@/lib/types/brief'
import { nanoid } from 'nanoid'
import { eq } from 'drizzle-orm'
import { aiService } from '@/lib/services/ai'
import { briefs } from '@/lib/data-store/schema'

interface ImportCalibrationDataResult {
  success: boolean
  message: string
  details: Array<{
    id: string
    success: boolean
    error?: string
  }>
}

const parseDate = (dateStr: string): Date => {
  try {
    // Handle the specific date format from the CSV (YYYY-MM-DDT)
    if (dateStr.match(/^\d{4}-\d{2}-\d{2}T/)) {
      const date = new Date(dateStr)
      if (!isNaN(date.getTime())) {
        return date
      }
    }
    
    // Try parsing as simple date string
    const date = new Date(dateStr)
    if (!isNaN(date.getTime())) {
      return date
    }
    
    // If all parsing fails, return current date
    return new Date()
  } catch (error) {
    return new Date()
  }
}

const BATCH_SIZE = 50 // Process 50 rows at a time

export async function importCalibrationData(
  csvContent: string,
  briefId: string
): Promise<ImportCalibrationDataResult> {
  try {
    // First verify the brief exists
    const brief = await drizzleDb.query.briefs.findFirst({
      where: eq(briefs.id, briefId)
    })

    if (!brief) {
      return {
        success: false,
        message: `Brief with ID ${briefId} not found`,
        details: []
      }
    }

    // Parse CSV content with proper handling of quoted values and newlines
    const parseCSVLine = (line: string): string[] => {
      const values: string[] = []
      let currentValue = ''
      let insideQuotes = false
      let i = 0
      
      while (i < line.length) {
        const char = line[i]
        
        if (char === '"') {
          if (insideQuotes && line[i + 1] === '"') {
            // Handle escaped quotes
            currentValue += '"'
            i += 2
            continue
          }
          insideQuotes = !insideQuotes
          i++
          continue
        }
        
        if (char === ',' && !insideQuotes) {
          values.push(currentValue.trim())
          currentValue = ''
          i++
          continue
        }
        
        currentValue += char
        i++
      }
      
      // Push the last value
      values.push(currentValue.trim())
      return values
    }

    // Split content into lines while preserving quoted content
    const splitCSVContent = (content: string): string[] => {
      const lines: string[] = []
      let currentLine = ''
      let insideQuotes = false
      let i = 0
      
      while (i < content.length) {
        const char = content[i]
        
        if (char === '"') {
          insideQuotes = !insideQuotes
        }
        
        if ((char === '\n' || char === '\r') && !insideQuotes) {
          if (currentLine.trim()) {
            lines.push(currentLine)
          }
          currentLine = ''
          // Skip \r\n if present
          if (char === '\r' && content[i + 1] === '\n') {
            i++
          }
        } else {
          currentLine += char
        }
        i++
      }
      
      // Add the last line if not empty
      if (currentLine.trim()) {
        lines.push(currentLine)
      }
      
      return lines
    }

    // Parse CSV content
    const lines = splitCSVContent(csvContent)
    const headers = parseCSVLine(lines[0])
    const dataRows = lines.slice(1)
      .map(line => parseCSVLine(line))
      .filter(row => row.length === headers.length) // Ensure row matches header count

    const results: ImportCalibrationDataResult['details'] = []
    let successCount = 0

    // Process rows in batches
    const processedIds = new Set<string>() // Track processed IDs
    for (let i = 0; i < dataRows.length; i += BATCH_SIZE) {
      const batch = dataRows.slice(i, i + BATCH_SIZE)
      const batchPromises = batch.map(async (row) => {
        try {
          const rowData = headers.reduce((acc, header, index) => {
            const cleanHeader = header.trim().toLowerCase().replace(/['"]/g, '')
            const cleanValue = row[index]?.replace(/^["']|["']$/g, '') || ''
            acc[cleanHeader] = cleanValue
            return acc
          }, {} as Record<string, string>)

          // Skip rows without essential data
          if (!rowData.content && !rowData.message) {
            console.warn('Skipping row without required content:', rowData)
            return
          }

          // Skip if we've already processed this ID
          const rowId = rowData.id || nanoid()
          if (processedIds.has(rowId)) {
            console.warn('Skipping duplicate row:', rowId)
            return
          }
          processedIds.add(rowId)

          const id = nanoid()
          const now = new Date()

          // Determine approval status from content
          const isApproved = (content: string): boolean => {
            const approvalIndicators = [
              'approved draft',
              'approved video',
              'approved script',
              'approved topic'
            ]
            return approvalIndicators.some(indicator => 
              content.toLowerCase().includes(indicator)
            )
          }

          // Prepare calibration data
          const calibrationEntry = {
            id,
            briefId,
            submissionId: null,
            content: rowData.content || rowData.message || '',
            metadata: {
              originalId: rowData.id || '',
              type: rowData.type || 'unknown',
              input: rowData.input || '',
              sender: rowData.sender || 'anonymous',
              userId: rowData.userid || '',
              stageId: rowData.stageid || '',
              dateInput: rowData.dateinput || '',
              attachments: rowData.attachments || '',
              submitted: rowData.submitted || '',
            },
            approved: isApproved(rowData.content || rowData.message || ''),
            feedback: rowData.feedback || '',
            feedbackAttachments: [],
            brandAnalysis: {},
            contentAnalysis: {},
            briefAnalysis: {},
            createdAt: parseDate(rowData.createdat),
            updatedAt: now,
          }

          await drizzleDb.insert(calibrationData).values(calibrationEntry)

          results.push({ id: rowId, success: true })
          successCount++
        } catch (error) {
          console.error('Error processing row:', error)
          results.push({
            id: row[0] || 'unknown',
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error'
          })
        }
      })

      await Promise.all(batchPromises)
    }

    return {
      success: successCount > 0,
      message: `Successfully processed ${successCount} out of ${dataRows.length} rows`,
      details: results
    }
  } catch (error) {
    console.error('Error importing calibration data:', error)
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to import calibration data',
      details: []
    }
  }
}

export async function updateCalibrationWeights(
  briefId: string,
  weights: ImportanceWeights
): Promise<{ success: boolean; message: string }> {
  try {
    await drizzleDb.insert(calibrationWeights)
      .values({
        id: nanoid(),
        briefId,
        weights,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .onConflictDoUpdate({
        target: [calibrationWeights.briefId],
        set: {
          weights,
          updatedAt: new Date(),
        },
      })

    return {
      success: true,
      message: 'Successfully updated calibration weights'
    }
  } catch (error) {
    console.error('Error updating calibration weights:', error)
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to update calibration weights'
    }
  }
}

export async function clearCalibrationData(
  briefId: string
): Promise<{ success: boolean; message: string }> {
  try {
    await drizzleDb.delete(calibrationData)
      .where(eq(calibrationData.briefId, briefId))

    return {
      success: true,
      message: 'Successfully cleared calibration data'
    }
  } catch (error) {
    console.error('Error clearing calibration data:', error)
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to clear calibration data'
    }
  }
} 