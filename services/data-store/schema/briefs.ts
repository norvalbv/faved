import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core'

export const briefs = sqliteTable('briefs', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  type: text('type', { enum: ['game_design', 'visual_creator', 'filmmaking', 'logo_design', 'booktuber'] }).notNull(),
  description: text('description').notNull(),
  overview: text('overview', { mode: 'json' }).notNull(),
  guidelines: text('guidelines', { mode: 'json' }).notNull(),
  examples: text('examples', { mode: 'json' }),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull(),
})

export type Brief = typeof briefs.$inferSelect
export type NewBrief = typeof briefs.$inferInsert
