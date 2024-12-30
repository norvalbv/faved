import { pgTable, text, timestamp, jsonb } from 'drizzle-orm/pg-core'
import { projects } from './projects'

export const campaigns = pgTable('campaigns', {
  id: text('id').primaryKey(),
  projectId: text('project_id').references(() => projects.id).default('milanote_project_001'),
  title: text('title').notNull(),
  description: text('description').notNull(),
  status: text('status', { 
    enum: ['active', 'completed', 'draft'] 
  }).notNull(),
  metadata: jsonb('metadata'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow()
})

export type Campaign = typeof campaigns.$inferSelect
export type NewCampaign = typeof campaigns.$inferInsert
