import { pgTable, text, timestamp, jsonb } from 'drizzle-orm/pg-core'

export const projects = pgTable('projects', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  description: text('description').notNull(),
  status: text('status', { 
    enum: ['active', 'completed', 'draft'] 
  }).notNull(),
  metadata: jsonb('metadata'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow()
})

export type Project = typeof projects.$inferSelect
export type NewProject = typeof projects.$inferInsert
