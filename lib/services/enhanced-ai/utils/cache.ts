import { AnalysisResult } from '@/lib/types/analysis'
import { ImportanceWeights } from '@/lib/types/calibration'
import { CacheEntry } from '../types'

export class AnalysisCache {
  private cache = new Map<string, CacheEntry>()
  private readonly ttl: number

  constructor(ttl: number) {
    this.ttl = ttl
  }

  get(key: string): AnalysisResult | null {
    const cached = this.cache.get(key)
    if (!cached) return null
    
    if (Date.now() - cached.timestamp > this.ttl) {
      this.cache.delete(key)
      return null
    }
    
    return cached.result
  }

  set(key: string, result: AnalysisResult): void {
    this.cache.set(key, { result, timestamp: Date.now() })
  }

  clear(): void {
    this.cache.clear()
  }

  generateKey(submissionId: string, briefId: string, weights: ImportanceWeights): string {
    const weightString = Object.entries(weights)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([k, v]) => `${k}:${v}`)
      .join(',')
    return `${submissionId}:${briefId}:${weightString}`
  }
} 