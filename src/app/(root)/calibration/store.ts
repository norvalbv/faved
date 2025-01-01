import { create } from 'zustand'
import { ImportanceWeights } from '@/lib/types/calibration'

interface ProcessingResult {
  success: boolean
  message: string
  details: Array<{
    id: string
    success: boolean
    error?: string
  }>
}

const defaultWeights: ImportanceWeights = {
  pronunciation: 0.5,
  formatting: 0.5,
  content: 0.5,
  brandAlignment: 0.5,
  guidelines: 0.5,
}

interface CalibrationStore {
  csvContent: string | null
  isProcessing: boolean
  weights: ImportanceWeights
  selectedBriefId: string | null
  results: ProcessingResult | null
  setResults: (results: ProcessingResult | null) => void
  setCsvContent: (content: string | null) => void
  setIsProcessing: (isProcessing: boolean) => void
  setWeights: (weights: ImportanceWeights) => void
  setSelectedBriefId: (briefId: string | null) => void
}

export const useCalibrationStore = create<CalibrationStore>((set) => ({
  csvContent: null,
  isProcessing: false,
  weights: defaultWeights,
  selectedBriefId: null,
  results: null,
  setResults: (results) => set({ results }),
  setCsvContent: (content) => set({ csvContent: content }),
  setIsProcessing: (isProcessing) => set({ isProcessing }),
  setWeights: (weights) => set({ weights }),
  setSelectedBriefId: (briefId) => set({ selectedBriefId: briefId }),
})) 