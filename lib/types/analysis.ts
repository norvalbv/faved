export interface BrandSafetyAnalysis {
  score: number
  issues: string[]
  confidence: number
}

export interface ContentQualityAnalysis {
  score: number
  clarity: number
  engagement: number
  confidence: number
  technicalAccuracy: number
  tone: string[]
  strengths: string[]
  improvements: string[]
}

export interface SellingPointsAnalysis {
  score: number
  confidence: number
  effectiveness: number
  present: string[]
  missing: string[]
}

export interface BrandAlignmentAnalysis {
  score: number
  confidence: number
  alignment: string[]
  misalignment: string[]
}

export interface AnalysisResult {
  brandSafety: BrandSafetyAnalysis
  content: {
    quality: ContentQualityAnalysis
    sellingPoints: SellingPointsAnalysis
  }
  brandAlignment: BrandAlignmentAnalysis
} 