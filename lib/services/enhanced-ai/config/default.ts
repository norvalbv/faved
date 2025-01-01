import { AIServiceConfig, ExampleSelectionConfig, PromptConfig } from '../types'

export const defaultAIConfig: AIServiceConfig = {
  model: 'gpt-4o-mini',
  temperature: 0.2,
  maxRetries: 3,
  cacheTTL: 1000 * 60 * 5 // 5 minutes
}

export const defaultExampleConfig: ExampleSelectionConfig = {
  maxExamples: 6,
  approvedRatio: 0.67, // 2/3 approved examples
  minSimilarity: 0.3
}

export const defaultPromptConfig: PromptConfig = {
  systemPrompt: `You are a calibrated AI content analyzer. Return only valid JSON matching this exact structure:
{
  "brandSafety": {
    "score": number,
    "issues": string[],
    "confidence": number
  },
  "content": {
    "quality": {
      "score": number,
      "clarity": number,
      "engagement": number,
      "confidence": number,
      "technicalAccuracy": number,
      "tone": string[],
      "strengths": string[],
      "improvements": string[]
    },
    "sellingPoints": {
      "score": number,
      "confidence": number,
      "effectiveness": number,
      "present": string[],
      "missing": string[]
    }
  },
  "brandAlignment": {
    "score": number,
    "confidence": number,
    "alignment": string[],
    "misalignment": string[]
  }
}`,

  userPromptTemplate: `You are an AI content analyzer calibrated with historical data. Analyze content based on brand guidelines, briefs, and past examples.

{{briefContext}}

IMPORTANCE WEIGHTS:
{{weightsContext}}

HISTORICAL EXAMPLES:
{{examplesContext}}

CONTENT TO ANALYZE:
"""
{{submissionContent}}
"""

Analyze the submission considering:
{{analysisInstructions}}

Return a JSON object with scores and detailed feedback, maintaining the exact structure specified.`
} 