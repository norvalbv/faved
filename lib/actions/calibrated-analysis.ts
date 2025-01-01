'use server'

import { Brief } from '@/lib/types/brief'
import { Submission } from '@/lib/types/submission'
import { AnalysisResult } from '@/lib/types/analysis'
import { ImportanceWeights } from '@/lib/types/calibration'
import { drizzleDb } from '@/lib/data-store'
import { calibrationWeights, briefs } from '@/lib/data-store/schema'
import { eq } from 'drizzle-orm'
import { enhancedAiService } from '@/lib/services/enhanced-ai'

const DEFAULT_WEIGHTS: ImportanceWeights = {
  content: 0.8,
  brandAlignment: 0.7,
  guidelines: 0.7,
  formatting: 0.6,
  pronunciation: 0.6
}

export async function analyzeCalibratedSubmission(
  submission: Submission,
  brief: Brief
): Promise<AnalysisResult> {
  try {
    // Get weights for this brief type
    const weights = await drizzleDb.query.calibrationWeights.findFirst({
      where: eq(calibrationWeights.briefId, brief.id)
    })

    if (!weights) {
      // Use default weights if none are configured
      return await enhancedAiService.analyzeSubmission(submission, brief, DEFAULT_WEIGHTS)
    }

    // Analyze submission with calibration
    const analysis = await enhancedAiService.analyzeSubmission(
      submission, 
      brief, 
      weights.weights as ImportanceWeights
    )

    return analysis
  } catch (error) {
    console.error('Calibrated analysis failed:', error)
    throw error
  }
} 