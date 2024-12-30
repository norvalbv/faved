import { pgTable, text, timestamp, jsonb } from 'drizzle-orm/pg-core'

export const users = pgTable('users', {
  id: text('id').primaryKey(),
  clerkId: text('clerk_id').notNull().unique(),
  email: text('email').notNull(),
  name: text('name').notNull(),
  role: text('role', { enum: ['influencer', 'brand'] }).notNull(),
  metadata: jsonb('metadata').notNull(),
  createdAt: timestamp('created_at').notNull(),
  updatedAt: timestamp('updated_at').notNull(),
})

export type User = typeof users.$inferSelect
export type NewUser = typeof users.$inferInsert