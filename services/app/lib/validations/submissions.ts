import { z } from 'zod'

// Base submission schema
const baseSubmissionSchema = z.object({
  briefId: z.string().min(1, 'Brief ID is required'),
})

// Video topic submission
export const videoTopicSchema = baseSubmissionSchema.extend({
  type: z.literal('video_topic'),
  content: z.object({
    title: z.string().min(3, 'Title must be at least 3 characters'),
    description: z.string().min(50, 'Description must be at least 50 characters'),
    targetAudience: z.string().min(10, 'Target audience must be specified'),
    keyPoints: z.array(z.string()).min(1, 'At least one key point is required'),
  }),
})

// Draft script submission
export const draftScriptSchema = baseSubmissionSchema.extend({
  type: z.literal('draft_script'),
  content: z.object({
    script: z.string().min(200, 'Script must be at least 200 characters'),
    estimatedDuration: z.number().min(30, 'Video must be at least 30 seconds'),
    hooks: z.array(z.string()).min(1, 'At least one hook is required'),
    callToAction: z.string().min(10, 'Call to action must be specified'),
  }),
})

// Draft video submission
export const draftVideoSchema = baseSubmissionSchema.extend({
  type: z.literal('draft_video'),
  content: z.object({
    videoUrl: z.string().url('Must be a valid video URL'),
    thumbnail: z.string().url('Must be a valid thumbnail URL').optional(),
    description: z.string().min(50, 'Description must be at least 50 characters'),
    notes: z.string().optional(),
  }),
})

// Live video submission
export const liveVideoSchema = baseSubmissionSchema.extend({
  type: z.literal('live_video'),
  content: z.object({
    videoUrl: z.string().url('Must be a valid video URL'),
    publishedAt: z.string().datetime('Must be a valid date'),
    analytics: z.object({
      views: z.number().optional(),
      likes: z.number().optional(),
      comments: z.number().optional(),
    }).optional(),
  }),
})

// Union type for all submission types
export const submissionSchema = z.discriminatedUnion('type', [
  videoTopicSchema,
  draftScriptSchema,
  draftVideoSchema,
  liveVideoSchema,
])

export type VideoTopicSubmission = z.infer<typeof videoTopicSchema>
export type DraftScriptSubmission = z.infer<typeof draftScriptSchema>
export type DraftVideoSubmission = z.infer<typeof draftVideoSchema>
export type LiveVideoSubmission = z.infer<typeof liveVideoSchema>
export type SubmissionData = z.infer<typeof submissionSchema> 