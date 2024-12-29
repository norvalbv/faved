import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core'
import { submissions } from './submissions'

export const feedback = sqliteTable('feedback', {
  id: text('id').primaryKey(),
  submissionId: text('submission_id').notNull().references(() => submissions.id),
  type: text('type', { enum: ['suggestion', 'correction', 'approval', 'rejection'] }).notNull(),
  content: text('content').notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull(),
})

export type Feedback = typeof feedback.$inferSelect
export type NewFeedback = typeof feedback.$inferInsert 