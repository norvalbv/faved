import { pgTable, text, timestamp, jsonb } from 'drizzle-orm/pg-core'
import { briefs } from './briefs'
import { users } from './users'

export const submissions = pgTable('submissions', {
  id: text('id').primaryKey(),
  briefId: text('brief_id').references(() => briefs.id).notNull(),
  influencerId: text('influencer_id').references(() => users.id),
  type: text('type', { enum: ['submission'] }).notNull(),
  content: text('content').notNull(),
  status: text('status', { enum: ['pending', 'approved', 'rejected'] }).notNull(),
  metadata: jsonb('metadata'),
  createdAt: timestamp('created_at').notNull(),
  updatedAt: timestamp('updated_at').notNull(),
})

export type Submission = typeof submissions.$inferSelect
export type NewSubmission = typeof submissions.$inferInsert
