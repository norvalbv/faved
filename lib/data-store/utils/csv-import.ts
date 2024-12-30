import { parse } from 'csv-parse'
import { createReadStream } from 'fs'
import { db } from '../index'
import { submissions, feedback } from '../schema'
import { nanoid } from 'nanoid'

interface CSVRow {
  input: string
  feedback: string
  message: string
  submitted: string
  approved: string
}

export async function importCSVData(filePath: string) {
  const records: CSVRow[] = []
  
  // Parse CSV file
  const parser = createReadStream(filePath).pipe(
    parse({
      columns: true,
      skip_empty_lines: true,
    })
  )

  for await (const record of parser) {
    records.push(record)
  }

  // Process records
  for (const record of records) {
    if (!record.input || !record.message) continue

    const submissionId = nanoid()
    const timestamp = new Date()

    // Create submission
    await db.insert(submissions).values({
      id: submissionId,
      briefId: 'game-design-brief-1', // Default to game design brief for now
      type: 'video_topic', // Default type
      content: record.input,
      status: record.message.includes('approved') ? 'approved' : 'pending',
      createdAt: timestamp,
      updatedAt: timestamp,
    })

    // Create feedback if exists
    if (record.feedback) {
      await db.insert(feedback).values({
        id: nanoid(),
        submissionId,
        type: record.message.includes('approved') ? 'approval' : 'suggestion',
        content: record.feedback,
        createdAt: timestamp,
        updatedAt: timestamp,
      })
    }
  }

  return records.length
} 