import { pgTable, text, timestamp } from 'drizzle-orm/pg-core'
import { submissions } from './submissions'

export const feedback = pgTable('feedback', {
  id: text('id').primaryKey(),
  submissionId: text('submission_id').references(() => submissions.id).notNull(),
  type: text('type', { enum: ['suggestion', 'approval'] }).notNull(),
  content: text('content').notNull(),
  createdAt: timestamp('created_at').notNull(),
  updatedAt: timestamp('updated_at').notNull(),
})

export type Feedback = typeof feedback.$inferSelect
export type NewFeedback = typeof feedback.$inferInsert 