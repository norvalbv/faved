import { jsonb, pgTable, text, timestamp } from 'drizzle-orm/pg-core'
import { projects } from './projects'

export const briefs = pgTable('briefs', {
  id: text('id').primaryKey(),
  projectId: text('project_id').references(() => projects.id),
  title: text('title').notNull(),
  description: text('description').notNull(),
  type: text('type', { 
    enum: ['game_design', 'visual_creator', 'filmmaking', 'logo_design', 'booktuber'] 
  }).notNull(),
  metadata: jsonb('metadata').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow()
})

export type Brief = typeof briefs.$inferSelect
export type NewBrief = typeof briefs.$inferInsert
