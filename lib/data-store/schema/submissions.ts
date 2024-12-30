import { pgTable, text, timestamp, jsonb } from 'drizzle-orm/pg-core'
import { projects } from './projects'
import { campaigns } from './campaigns'

export const submissions = pgTable('submissions', {
  id: text('id').primaryKey(),
  projectId: text('project_id').references(() => projects.id).default('milanote_project_001'),
  campaignId: text('campaign_id').references(() => campaigns.id),
  type: text('type').notNull(),
  content: text('content').notNull(),
  metadata: jsonb('metadata').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow()
})

export type Submission = typeof submissions.$inferSelect
export type NewSubmission = typeof submissions.$inferInsert
