import { pgTable, text, timestamp } from 'drizzle-orm/pg-core'

export const briefs = pgTable('briefs', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  description: text('description').notNull(),
  requirements: text('requirements').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow()
})

export type Brief = typeof briefs.$inferSelect
export type NewBrief = typeof briefs.$inferInsert
