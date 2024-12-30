import { pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core'
import { submissions } from './submissions'

export const feedback = pgTable('feedback', {
  id: uuid('id').primaryKey().defaultRandom(),
  submissionId: uuid('submission_id').notNull().references(() => submissions.id),
  type: text('type', { enum: ['suggestion', 'approval', 'rejection'] }).notNull(),
  content: text('content').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow()
})

export type Feedback = typeof feedback.$inferSelect
export type NewFeedback = typeof feedback.$inferInsert 