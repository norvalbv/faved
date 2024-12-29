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

export const submissions = sqliteTable('submissions', {
  id: text('id').primaryKey(),
  briefId: text('brief_id').notNull().references(() => briefs.id),
  type: text('type', { enum: ['video_topic', 'draft_script', 'draft_video', 'live_video'] }).notNull(),
  content: text('content').notNull(),
  status: text('status', { enum: ['pending', 'approved', 'rejected'] }).notNull().default('pending'),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull(),
})

export const feedback = sqliteTable('feedback', {
  id: text('id').primaryKey(),
  submissionId: text('submission_id').notNull().references(() => submissions.id),
  type: text('type', { enum: ['suggestion', 'correction', 'approval', 'rejection'] }).notNull(),
  content: text('content').notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull(),
}) 