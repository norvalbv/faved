import { describe, it, expect, vi, beforeEach } from 'vitest'
import { ContentAnalyzer } from './contentAnalyzer'
import type { Submission } from '../../../types/submission'
import type { Brief } from '../../../types/brief'

describe('ContentAnalyzer', () => {
  let analyzer: ContentAnalyzer
  
  const mockSubmission: Submission = {
    id: '1',
    projectId: '1',
    type: 'submission',
    content: 'High-quality content with clear messaging and engagement',
    metadata: {
      feedbackHistory: []
    },
    createdAt: new Date(),
    updatedAt: new Date()
  }

  const mockBrief: Brief = {
    id: '1',
    title: 'Test Brief',
    description: 'Create engaging content',
    type: 'visual_creator',
    metadata: {
      overview: {
        what: 'Create engaging content with clear messaging',
        gettingStarted: 'Focus on quality and engagement'
      },
      guidelines: [{
        category: 'Content Quality',
        items: ['Clear messaging', 'High engagement', 'Technical accuracy']
      }]
    },
    createdAt: new Date(),
    updatedAt: new Date()
  }

  beforeEach(() => {
    analyzer = new ContentAnalyzer('test-api-key', {
      model: 'test-model'
    })
  })

  it('should analyze content quality and selling points', async () => {
    const mockResponse = `{{quality}}
clarity: 90
engagement: 85
technical_accuracy: 95
strengths: clear messaging, engaging tone
improvements: add more examples
tone: professional, friendly
score: 90
confidence: 95

{{selling_points}}
present: clear value proposition, engaging content
missing: technical details
effectiveness: 85
score: 88
confidence: 90`

    vi.spyOn(analyzer['openai'].chat.completions, 'create').mockResolvedValueOnce({
      choices: [{
        message: {
          content: mockResponse
        }
      }]
    } as any)

    const result = await analyzer.analyze(mockSubmission, mockBrief)

    expect(result.quality).toBeDefined()
    expect(result.quality.clarity).toBe(90)
    expect(result.quality.engagement).toBe(85)
    expect(result.quality.technicalAccuracy).toBe(95)
    expect(result.quality.strengths).toContain('clear messaging')
    expect(result.quality.improvements).toContain('add more examples')
    expect(result.quality.tone).toContain('professional')
    expect(result.quality.score).toBe(90)
    expect(result.quality.confidence).toBe(95)

    expect(result.sellingPoints).toBeDefined()
    expect(result.sellingPoints.present).toContain('clear value proposition')
    expect(result.sellingPoints.missing).toContain('technical details')
    expect(result.sellingPoints.effectiveness).toBe(85)
    expect(result.sellingPoints.score).toBe(88)
    expect(result.sellingPoints.confidence).toBe(90)
  })

  it('should handle analysis errors gracefully', async () => {
    vi.spyOn(analyzer['openai'].chat.completions, 'create').mockRejectedValueOnce(new Error('API Error'))

    const result = await analyzer.analyze(mockSubmission, mockBrief)

    expect(result.quality.clarity).toBe(0)
    expect(result.quality.engagement).toBe(0)
    expect(result.quality.technicalAccuracy).toBe(0)
    expect(result.quality.improvements).toContain('Analysis failed')
    expect(result.quality.score).toBe(0)
    expect(result.quality.confidence).toBe(0)

    expect(result.sellingPoints.present).toHaveLength(0)
    expect(result.sellingPoints.missing).toContain('Analysis failed')
    expect(result.sellingPoints.effectiveness).toBe(0)
    expect(result.sellingPoints.score).toBe(0)
    expect(result.sellingPoints.confidence).toBe(0)
  })
}) 