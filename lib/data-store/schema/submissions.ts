import { pgTable, text, timestamp, jsonb } from 'drizzle-orm/pg-core'
import { campaigns } from './campaigns'

export const submissions = pgTable('submissions', {
  id: text('id').primaryKey(),
  campaignId: text('campaign_id').references(() => campaigns.id),
  type: text('type').notNull(),
  content: text('content').notNull(),
  metadata: jsonb('metadata'),
  createdAt: timestamp('created_at').notNull(),
  updatedAt: timestamp('updated_at').notNull(),
})

export type Submission = typeof submissions.$inferSelect
export type NewSubmission = typeof submissions.$inferInsert
