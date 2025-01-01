export interface ImportanceWeights {
  pronunciation: number
  formatting: number
  content: number
  brandAlignment: number
  guidelines: number
}

export interface ProcessingResult {
  totalProcessed: number
  successfullyProcessed: number
  failedProcessing: number
  details: Array<{
    id: string
    success: boolean
    error?: string
  }>
}

export interface CalibrationState {
  isProcessing: boolean
  progress: number
  results?: ProcessingResult
  weights: ImportanceWeights
}

export interface HistoricalUploadResult {
  campaignId: string
  processingResult: ProcessingResult
} 