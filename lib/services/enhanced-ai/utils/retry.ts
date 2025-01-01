export class RetryHandler {
  private readonly maxRetries: number

  constructor(maxRetries: number) {
    this.maxRetries = maxRetries
  }

  async withRetry<T>(fn: () => Promise<T>): Promise<T> {
    for (let i = 0; i < this.maxRetries; i++) {
      try {
        return await fn()
      } catch (error) {
        if (i === this.maxRetries - 1) throw error
        
        // Exponential backoff with jitter
        const delay = Math.min(1000 * Math.pow(2, i), 10000)
        const jitter = Math.random() * 1000
        await new Promise(resolve => setTimeout(resolve, delay + jitter))
      }
    }
    throw new Error('Retry failed')
  }
} 