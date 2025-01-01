import { pgTable, text, timestamp, jsonb, boolean } from 'drizzle-orm/pg-core'
import { submissions } from './submissions'
import { briefs } from './briefs'

export const calibrationData = pgTable('calibration_data', {
  id: text('id').primaryKey(),
  submissionId: text('submission_id'),
  briefId: text('brief_id').references(() => briefs.id).notNull(),
  content: text('content').notNull(),
  metadata: jsonb('metadata').notNull().default({}),
  approved: boolean('approved').notNull().default(false),
  feedback: text('feedback').notNull().default(''),
  feedbackAttachments: jsonb('feedback_attachments').notNull().default([]),
  brandAnalysis: jsonb('brand_analysis').notNull().default({}),
  contentAnalysis: jsonb('content_analysis').notNull().default({}),
  briefAnalysis: jsonb('brief_analysis').notNull().default({}),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
})

export const calibrationWeights = pgTable('calibration_weights', {
  id: text('id').primaryKey(),
  briefId: text('brief_id').references(() => briefs.id).notNull(),
  weights: jsonb('weights').notNull().default({}),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
})

export type CalibrationData = typeof calibrationData.$inferSelect
export type NewCalibrationData = typeof calibrationData.$inferInsert
export type CalibrationWeights = typeof calibrationWeights.$inferSelect
export type NewCalibrationWeights = typeof calibrationWeights.$inferInsert 