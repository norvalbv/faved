import { describe, it, expect, vi, beforeEach } from 'vitest'
import { BriefAnalyzer } from './briefAnalyzer'
import type { Submission } from '../../../types/submission'
import type { Brief } from '../../../types/brief'

describe('BriefAnalyzer', () => {
  let analyzer: BriefAnalyzer
  
  const mockSubmission: Submission = {
    id: '1',
    projectId: '1',
    type: 'submission',
    content: 'Content that meets brief requirements',
    metadata: {
      feedbackHistory: []
    },
    createdAt: new Date(),
    updatedAt: new Date()
  }

  const mockBrief: Brief = {
    id: '1',
    title: 'Test Brief',
    description: 'Follow specific requirements',
    type: 'visual_creator',
    metadata: {
      overview: {
        what: 'Create content following guidelines',
        gettingStarted: 'Review requirements carefully'
      },
      guidelines: [{
        category: 'Requirements',
        items: ['Follow format', 'Include key elements', 'Meet specifications']
      }]
    },
    createdAt: new Date(),
    updatedAt: new Date()
  }

  beforeEach(() => {
    analyzer = new BriefAnalyzer('test-api-key', {
      model: 'test-model'
    })
  })

  it('should analyze brief compliance', async () => {
    const mockResponse = `{{compliance}}
requirements_met: format followed, key elements included
requirements_missing: detailed specifications
guidelines_followed: true
format_correct: true
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

    expect(result.compliance).toBeDefined()
    expect(result.compliance.requirementsMet).toContain('format followed')
    expect(result.compliance.requirementsMissing).toContain('detailed specifications')
    expect(result.compliance.guidelinesFollowed).toBe(true)
    expect(result.compliance.formatCorrect).toBe(true)
    expect(result.compliance.score).toBe(85)
    expect(result.compliance.confidence).toBe(90)
  })

  it('should handle analysis errors gracefully', async () => {
    vi.spyOn(analyzer['openai'].chat.completions, 'create').mockRejectedValueOnce(new Error('API Error'))

    const result = await analyzer.analyze(mockSubmission, mockBrief)

    expect(result.compliance.requirementsMet).toHaveLength(0)
    expect(result.compliance.requirementsMissing).toContain('Analysis failed')
    expect(result.compliance.guidelinesFollowed).toBe(false)
    expect(result.compliance.formatCorrect).toBe(false)
    expect(result.compliance.score).toBe(0)
    expect(result.compliance.confidence).toBe(0)
  })
}) 