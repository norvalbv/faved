export class SimilarityCalculator {
  calculateSimilarity(a: string, b: string): number {
    const aWords = new Set(this.tokenize(a))
    const bWords = new Set(this.tokenize(b))
    const intersection = new Set([...aWords].filter(x => bWords.has(x)))
    return intersection.size / Math.max(aWords.size, bWords.size)
  }

  private tokenize(text: string): string[] {
    return text
      .toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter(word => word.length > 2) // Filter out very short words
  }

  sortByRelevance<T>(
    items: T[],
    reference: string,
    getContent: (item: T) => string
  ): T[] {
    return [...items].sort((a, b) => {
      const aSimilarity = this.calculateSimilarity(reference, getContent(a))
      const bSimilarity = this.calculateSimilarity(reference, getContent(b))
      return bSimilarity - aSimilarity
    })
  }
} 