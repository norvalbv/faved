'use server'

import type { Brief, BriefMetadata } from '../types/brief'
import type { Submission } from '../types/submission'
import { analyzeSubmission as aiAnalyze } from '../services/ai'

interface AnalysisResult {
  matches: {
    category: string
    items: string[]
  }[]
  mismatches: {
    category: string
    items: string[]
  }[]
  brandSafety: {
    issues: string[]
    pass: boolean
  }
  sellingPoints: {
    covered: string[]
    missing: string[]
  }
}

interface BriefWithMetadata extends Omit<Brief, 'metadata'> {
  metadata: BriefMetadata
}

export async function analyzeSubmission(
  submission: Submission,
  brief: Brief
): Promise<AnalysisResult> {
  // Cast brief to include required metadata
  const briefWithMetadata: BriefWithMetadata = {
    ...brief,
    metadata: brief.metadata || {
      overview: {
        what: brief.description,
        gettingStarted: ''
      },
      guidelines: [{
        category: 'Requirements',
        items: [brief.description]
      }]
    }
  }

  // Get AI analysis
  const aiResponse = await aiAnalyze(submission, briefWithMetadata)
  
  // Parse AI response
  const result: AnalysisResult = {
    matches: [],
    mismatches: [],
    brandSafety: {
      issues: [],
      pass: !aiResponse.includes('{{reject}}')
    },
    sellingPoints: {
      covered: [],
      missing: []
    }
  }

  // Extract rejection reason if present
  if (aiResponse.includes('{{reject}}')) {
    const reasonMatch = aiResponse.match(/REASON:\s*(.+?)(?:\n|$)/)
    if (reasonMatch) {
      result.brandSafety.issues.push(reasonMatch[1].trim())
    }
  }

  // Extract sections from AI response
  const sections = aiResponse.split('\n\n')
  for (const section of sections) {
    if (section.startsWith('ANALYSIS:')) {
      const items = section.replace('ANALYSIS:', '').trim().split('\n').filter(Boolean)
      if (items.length > 0) {
        result.matches.push({
          category: 'Analysis',
          items
        })
      }
    } else if (section.startsWith('AREAS FOR IMPROVEMENT:')) {
      const items = section.replace('AREAS FOR IMPROVEMENT:', '').trim().split('\n').filter(Boolean)
      if (items.length > 0) {
        result.mismatches.push({
          category: 'Improvements',
          items
        })
      }
    } else if (section.startsWith('BRAND SAFETY ISSUES:')) {
      const items = section.replace('BRAND SAFETY ISSUES:', '').trim().split('\n').filter(Boolean)
      if (items.length > 0) {
        result.brandSafety.issues.push(...items)
      }
    } else if (section.startsWith('MISSING KEY POINTS:')) {
      const items = section.replace('MISSING KEY POINTS:', '').trim().split('\n').filter(Boolean)
      if (items.length > 0) {
        result.sellingPoints.missing.push(...items)
      }
    }
  }

  return result
} 