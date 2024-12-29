'use server'

import type { Brief } from '../types/brief'
import type { Submission } from '../types/submission'

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

export async function analyzeSubmission(
  submission: Submission,
  brief: Brief
): Promise<AnalysisResult> {
  const result: AnalysisResult = {
    matches: [],
    mismatches: [],
    brandSafety: {
      issues: [],
      pass: true,
    },
    sellingPoints: {
      covered: [],
      missing: [],
    },
  }

  // Check brand safety guidelines
  const brandSafetyIssues = checkBrandSafety(submission.content)
  if (brandSafetyIssues.length > 0) {
    result.brandSafety = {
      issues: brandSafetyIssues,
      pass: false,
    }
  }

  // Check guidelines compliance
  for (const guideline of brief.guidelines) {
    const { matches, mismatches } = checkGuidelineCompliance(
      submission.content,
      guideline
    )
    
    if (matches.length > 0) {
      result.matches.push({
        category: guideline.category,
        items: matches,
      })
    }
    
    if (mismatches.length > 0) {
      result.mismatches.push({
        category: guideline.category,
        items: mismatches,
      })
    }
  }

  // Check key selling points
  const { covered, missing } = checkSellingPoints(
    submission.content,
    brief.overview.what
  )
  result.sellingPoints = { covered, missing }

  return result
}

function checkBrandSafety(content: string): string[] {
  const issues: string[] = []
  const unsafeContent = [
    'explicit adult themes',
    'explicit language',
    'explicit imagery',
    'polarising political',
    'personal attacks',
    'targeted harassment',
    'unverified theories',
  ]

  for (const unsafe of unsafeContent) {
    if (content.toLowerCase().includes(unsafe)) {
      issues.push(`Contains ${unsafe}`)
    }
  }

  return issues
}

function checkGuidelineCompliance(
  content: string,
  guideline: { category: string; items: string[] }
): { matches: string[]; mismatches: string[] } {
  const matches: string[] = []
  const mismatches: string[] = []

  for (const item of guideline.items) {
    // Simple text matching for now, could be enhanced with NLP
    if (content.toLowerCase().includes(item.toLowerCase())) {
      matches.push(item)
    } else {
      mismatches.push(item)
    }
  }

  return { matches, mismatches }
}

function checkSellingPoints(content: string, overview: string): {
  covered: string[]
  missing: string[]
} {
  // Extract key points from overview
  const keyPoints = overview
    .split('.')
    .map(point => point.trim())
    .filter(point => point.length > 0)

  const covered: string[] = []
  const missing: string[] = []

  for (const point of keyPoints) {
    if (content.toLowerCase().includes(point.toLowerCase())) {
      covered.push(point)
    } else {
      missing.push(point)
    }
  }

  return { covered, missing }
} 