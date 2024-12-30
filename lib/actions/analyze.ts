'use server'

import { analyzeSubmission } from '../services/ai'
import { SubmissionRepository } from '../data-store/repositories/submission'
import { BriefRepository } from '../data-store/repositories/brief'
import { auth } from '../utils/auth'
import { revalidatePath } from 'next/cache'

export { analyzeSubmission } from '../services/ai'

export async function analyze(submissionId: string) {
  try {
    // 1. Verify user is logged in
    const { userId } = auth()
    if (!userId) {
      throw new Error('Unauthorized')
    }

    // 2. Get submission and brief
    const submission = await SubmissionRepository.getById(submissionId)
    if (!submission) {
      throw new Error('Submission not found')
    }

    const brief = await BriefRepository.getById(submission.projectId)
    if (!brief) {
      throw new Error('Brief not found')
    }

    // Cast brief metadata to expected type
    const briefWithMetadata = {
      ...brief,
      metadata: {
        overview: {
          what: brief.description,
          gettingStarted: (brief.metadata as { gettingStarted?: string } | undefined)?.gettingStarted || ''
        },
        guidelines: (brief.metadata as { guidelines?: { category: string; items: string[] }[] } | undefined)?.guidelines || [{
          category: 'Requirements',
          items: [brief.description]
        }]
      }
    }

    // 3. Analyze submission
    const analysis = await analyzeSubmission(submission, briefWithMetadata)

    // 4. Update submission with feedback
    const feedbackHistory = [...(submission.metadata.feedbackHistory || [])]
    feedbackHistory.push({
      feedback: analysis.matches.map(m => `${m.category}:\n${m.items.join('\n')}`).join('\n\n') +
        (analysis.mismatches.length > 0 ? `\n\nAreas for Improvement:\n${analysis.mismatches.map(m => m.items.join('\n')).join('\n')}` : ''),
      createdAt: new Date().toISOString(),
      status: analysis.brandSafety.pass ? 'comment' : 'rejected',
      isAiFeedback: true
    })

    await SubmissionRepository.create({
      ...submission,
      metadata: {
        ...submission.metadata,
        feedbackHistory,
        status: analysis.brandSafety.pass ? 'pending' : 'rejected',
        stageId: analysis.brandSafety.pass ? '1' : '3'
      }
    })

    // Revalidate the submissions page
    revalidatePath('/campaigns/[id]/submissions/[submissionId]', 'page')

    return { success: true }
  } catch (error) {
    console.error('Error analyzing submission:', error)
    return { success: false, error: 'Failed to analyze submission' }
  }
} 