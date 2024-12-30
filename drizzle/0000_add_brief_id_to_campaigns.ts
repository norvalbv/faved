import { pgTable, text, timestamp, jsonb } from 'drizzle-orm/pg-core'
import { sql } from 'drizzle-orm'
import { briefs } from '../lib/data-store/schema/briefs'
import { projects } from '../lib/data-store/schema/projects'

export const campaigns = pgTable('campaigns', {
  id: text('id').primaryKey(),
  projectId: text('project_id').references(() => projects.id).default('milanote_project_001'),
  briefId: text('brief_id').references(() => briefs.id),
  title: text('title').notNull(),
  description: text('description').notNull(),
  status: text('status', { 
    enum: ['active', 'completed', 'draft'] 
  }).notNull(),
  metadata: jsonb('metadata'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow()
}) 