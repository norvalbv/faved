import { describe, it, expect, vi, beforeEach } from 'vitest'
import { BrandAnalyzer } from './brandAnalyzer'
import type { Submission } from '../../../types/submission'
import type { Brief } from '../../../types/brief'

describe('BrandAnalyzer', () => {
  let analyzer: BrandAnalyzer
  
  const mockSubmission: Submission = {
    id: '1',
    projectId: '1',
    type: 'submission',
    content: 'Test content that aligns with brand values',
    metadata: {
      feedbackHistory: []
    },
    createdAt: new Date(),
    updatedAt: new Date()
  }

  const mockBrief: Brief = {
    id: '1',
    title: 'Test Brief',
    description: 'A test brief for brand alignment',
    type: 'visual_creator',
    metadata: {
      overview: {
        what: 'Create content that matches our brand voice',
        gettingStarted: 'Review our brand guidelines'
      },
      guidelines: [{
        category: 'Brand Voice',
        items: ['Professional', 'Friendly', 'Innovative']
      }]
    },
    createdAt: new Date(),
    updatedAt: new Date()
  }

  beforeEach(() => {
    analyzer = new BrandAnalyzer('test-api-key', {
      model: 'test-model'
    })
  })

  it('should analyze brand safety and alignment', async () => {
    const mockResponse = `{{brand_safety}}
pass: true
issues: minor tone inconsistency
score: 85
confidence: 90

{{brand_alignment}}
tone_match: 80
value_alignment: 85
audience_match: 90
issues: slight formality variance
score: 85
confidence: 90`

    vi.spyOn(analyzer['openai'].chat.completions, 'create').mockResolvedValueOnce({
      choices: [{
        message: {
          content: mockResponse
        }
      }]
    } as any)

    const result = await analyzer.analyze(mockSubmission, mockBrief)

    expect(result.safety).toBeDefined()
    expect(result.safety.pass).toBe(true)
    expect(result.safety.score).toBe(85)
    expect(result.safety.confidence).toBe(90)

    expect(result.alignment).toBeDefined()
    expect(result.alignment.toneMatch).toBe(80)
    expect(result.alignment.valueAlignment).toBe(85)
    expect(result.alignment.audienceMatch).toBe(90)
    expect(result.alignment.score).toBe(85)
    expect(result.alignment.confidence).toBe(90)
  })

  it('should handle analysis errors gracefully', async () => {
    vi.spyOn(analyzer['openai'].chat.completions, 'create').mockRejectedValueOnce(new Error('API Error'))

    const result = await analyzer.analyze(mockSubmission, mockBrief)

    expect(result.safety.pass).toBe(false)
    expect(result.safety.issues).toContain('Analysis failed')
    expect(result.safety.score).toBe(0)
    expect(result.safety.confidence).toBe(0)

    expect(result.alignment.toneMatch).toBe(0)
    expect(result.alignment.valueAlignment).toBe(0)
    expect(result.alignment.audienceMatch).toBe(0)
    expect(result.alignment.issues).toContain('Analysis failed')
    expect(result.alignment.score).toBe(0)
    expect(result.alignment.confidence).toBe(0)
  })
}) 