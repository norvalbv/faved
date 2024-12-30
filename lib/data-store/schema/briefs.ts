import { pgTable, text, timestamp, jsonb } from 'drizzle-orm/pg-core'

export const briefs = pgTable('briefs', {
  id: text('id').primaryKey(),
  type: text('type', { 
    enum: ['game_design', 'visual_creator', 'filmmaking', 'logo_design', 'booktuber'] 
  }).notNull(),
  title: text('title').notNull(),
  description: text('description').notNull(),
  overview: jsonb('overview').notNull(),
  guidelines: jsonb('guidelines').notNull(),
  collaborationTimeline: jsonb('collaboration_timeline').notNull(),
  examples: jsonb('examples'),
  // Optional fields based on brief type
  suggestions: jsonb('suggestions'),
  productionTools: jsonb('production_tools'),
  designProcess: jsonb('design_process'),
  writingTools: jsonb('writing_tools'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow()
})

export type Brief = typeof briefs.$inferSelect
export type NewBrief = typeof briefs.$inferInsert
