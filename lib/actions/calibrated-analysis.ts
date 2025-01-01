'use server'

import { Brief } from '@/lib/types/brief'
import { Submission } from '@/lib/types/submission'
import { AnalysisResult } from '@/lib/types/analysis'
import { ImportanceWeights } from '@/lib/types/calibration'
import { drizzleDb } from '@/lib/data-store'
import { calibrationWeights } from '@/lib/data-store/schema'
import { eq } from 'drizzle-orm'
import { enhancedAiService } from '@/lib/services/enhanced-ai'

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
      throw new Error('No calibration weights found for this brief type')
    }

    // Analyze submission with calibration
    const analysis = await enhancedAiService.analyzeSubmission(submission, brief, weights.weights as ImportanceWeights)

    return analysis
  } catch (error) {
    console.error('Calibrated analysis failed:', error)
    throw error
  }
} 