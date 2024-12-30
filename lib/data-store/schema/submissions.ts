import { pgTable, text, timestamp } from 'drizzle-orm/pg-core'
import { briefs } from './briefs'
import { users } from './users'

export const submissions = pgTable('submissions', {
  id: text('id').primaryKey(),
  briefId: text('brief_id').references(() => briefs.id).notNull(),
  influencerId: text('influencer_id').references(() => users.id).notNull(),
  type: text('type', { enum: ['video_topic', 'draft_script', 'draft_video', 'live_video'] }).notNull(),
  content: text('content').notNull(),
  status: text('status', { enum: ['pending', 'approved', 'rejected'] }).notNull(),
  createdAt: timestamp('created_at').notNull(),
  updatedAt: timestamp('updated_at').notNull(),
})

export type Submission = typeof submissions.$inferSelect
export type NewSubmission = typeof submissions.$inferInsert