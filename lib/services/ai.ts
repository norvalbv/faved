import OpenAI from 'openai'
import { Brief } from '@/lib/types/brief'
import { Submission } from '@/lib/types/submission'
import { AnalysisResult } from '@/lib/types/analysis'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

const DEFAULT_ANALYSIS_RESULT: AnalysisResult = {
  brandSafety: {
    score: 0,
    issues: [],
    confidence: 0,
  },
  content: {
    quality: {
      score: 0,
      clarity: 0,
      engagement: 0,
      confidence: 0,
      technicalAccuracy: 0,
      tone: [],
      strengths: [],
      improvements: [],
    },
    sellingPoints: {
      score: 0,
      confidence: 0,
      effectiveness: 0,
      present: [],
      missing: [],
    },
  },
  brandAlignment: {
    score: 0,
    confidence: 0,
    alignment: [],
    misalignment: [],
  },
}

export const aiService = {
  async analyzeSubmission(
    submission: Submission,
    brief: Brief
  ): Promise<AnalysisResult> {
    try {
      const briefData = {
        title: brief.title,
        description: brief.description,
        type: brief.type,
        requirements: brief.metadata?.requirements || [],
        tone: brief.metadata?.tone || [],
        keywords: brief.metadata?.keywords || [],
        guidelines: brief.metadata?.guidelines || {},
      }

      const response = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        temperature: 0.2,
        messages: [
          {
            role: 'system',
            content: `You are an AI content analyzer. Analyze content based on brand guidelines and briefs. Return a JSON response with scores (0-100) and specific feedback.`
          },
          {
            role: 'user',
            content: `Brief: ${JSON.stringify(briefData)}

Content: ${submission.content}

Return a JSON object with this exact structure:
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
}`
          }
        ],
        response_format: { type: "json_object" }
      })

      const analysis = JSON.parse(response.choices[0].message.content || '{}')
      return {
        ...DEFAULT_ANALYSIS_RESULT,
        ...analysis
      }
    } catch (error) {
      console.error('AI analysis failed:', error)
      return DEFAULT_ANALYSIS_RESULT
    }
  }
} 