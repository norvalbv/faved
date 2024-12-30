import { pgTable, text, timestamp } from 'drizzle-orm/pg-core'
import { briefs } from './briefs'

export const submissions = pgTable('submissions', {
  id: text('id').primaryKey(),
  briefId: text('brief_id').notNull().references(() => briefs.id),
  type: text('type', { enum: ['video_topic', 'draft_script', 'draft_video', 'live_video'] }).notNull(),
  content: text('content').notNull(),
  status: text('status', { enum: ['pending', 'approved', 'rejected'] }).notNull().default('pending'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow()
})

export type Submission = typeof submissions.$inferSelect
export type NewSubmission = typeof submissions.$inferInsert