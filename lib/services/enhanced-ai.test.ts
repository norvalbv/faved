import { describe, it, expect, vi, beforeEach } from 'vitest'
import { EnhancedAIService } from './enhanced-ai'
import { Brief } from '@/lib/types/brief'
import { Submission } from '@/lib/types/submission'
import { ImportanceWeights } from '@/lib/types/calibration'
import { drizzleDb } from '@/lib/data-store'
import OpenAI from 'openai'
import { nanoid } from 'nanoid'

// Mock OpenAI and database
vi.mock('openai')
vi.mock('@/lib/data-store', () => ({
  drizzleDb: {
    query: {
      calibrationData: {
        findMany: vi.fn()
      }
    }
  }
}))

describe('EnhancedAIService', () => {
  let service: EnhancedAIService
  
  const mockSubmission: Submission = {
    id: '1',
    projectId: '1',
    type: 'submission',
    content: 'Test content that follows brief guidelines',
    metadata: {
      feedbackHistory: []
    },
    createdAt: new Date(),
    updatedAt: new Date()
  }

  const mockBrief: Brief = {
    id: '1',
    projectId: '1',
    title: 'Test Brief',
    description: 'Create content following guidelines',
    type: 'visual_creator',
    metadata: {
      requirements: ['Clear messaging', 'Brand voice', 'Technical accuracy'],
      tone: ['Professional', 'Engaging'],
      keywords: ['key1', 'key2'],
      guidelines: {
        style: 'Professional',
        format: 'Script'
      }
    },
    createdAt: new Date(),
    updatedAt: new Date()
  }

  const mockWeights: ImportanceWeights = {
    pronunciation: 0.5,
    formatting: 0.5,
    content: 0.75,
    brandAlignment: 0.75,
    guidelines: 0.75,
  }

  const now = new Date()
  const mockCalibrationData = [
    {
      id: nanoid(),
      briefId: mockBrief.id,
      submissionId: null,
      content: 'Approved content example',
      metadata: {},
      approved: true,
      feedback: 'Great work, meets all requirements',
      feedbackAttachments: [],
      brandAnalysis: { safety: { score: 85 } },
      contentAnalysis: { quality: { score: 90 } },
      briefAnalysis: {},
      createdAt: now,
      updatedAt: now
    },
    {
      id: nanoid(),
      briefId: mockBrief.id,
      submissionId: null,
      content: 'Rejected content example',
      metadata: {},
      approved: false,
      feedback: 'Missing key elements',
      feedbackAttachments: [],
      brandAnalysis: { safety: { score: 50 } },
      contentAnalysis: { quality: { score: 60 } },
      briefAnalysis: {},
      createdAt: now,
      updatedAt: now
    }
  ]

  beforeEach(() => {
    vi.clearAllMocks()
    service = new EnhancedAIService()
  })

  it('should analyze submission with calibration data', async () => {
    // Mock database response
    vi.mocked(drizzleDb.query.calibrationData.findMany).mockResolvedValue(mockCalibrationData)

    // Mock OpenAI response
    const mockAnalysis = {
      brandSafety: {
        score: 85,
        issues: [],
        confidence: 90
      },
      content: {
        quality: {
          score: 88,
          clarity: 85,
          engagement: 90,
          confidence: 92,
          technicalAccuracy: 87,
          tone: ['Professional', 'Clear'],
          strengths: ['Clear messaging', 'Good structure'],
          improvements: []
        },
        sellingPoints: {
          score: 85,
          confidence: 88,
          effectiveness: 86,
          present: ['Key message 1', 'Key message 2'],
          missing: []
        }
      },
      brandAlignment: {
        score: 90,
        confidence: 92,
        alignment: ['Matches brand voice', 'Professional tone'],
        misalignment: []
      }
    }

    vi.mocked(OpenAI.prototype.chat.completions.create).mockResolvedValue({
      choices: [{ message: { content: JSON.stringify(mockAnalysis) } }]
    } as any)

    const result = await service.analyzeSubmission(mockSubmission, mockBrief, mockWeights)

    // Verify weights are applied correctly
    expect(result.content.quality.score).toBe(mockAnalysis.content.quality.score * mockWeights.content)
    expect(result.brandAlignment.score).toBe(mockAnalysis.brandAlignment.score * mockWeights.brandAlignment)
    expect(result.content.sellingPoints.score).toBe(mockAnalysis.content.sellingPoints.score * mockWeights.guidelines)

    // Verify structure
    expect(result).toHaveProperty('brandSafety')
    expect(result).toHaveProperty('content.quality')
    expect(result).toHaveProperty('content.sellingPoints')
    expect(result).toHaveProperty('brandAlignment')
  })

  it('should handle missing properties in AI response', async () => {
    vi.mocked(drizzleDb.query.calibrationData.findMany).mockResolvedValue([])
    
    // Mock incomplete AI response
    const incompleteAnalysis = {
      brandSafety: {
        score: 80,
        issues: []
      }
    }

    vi.mocked(OpenAI.prototype.chat.completions.create).mockResolvedValue({
      choices: [{ message: { content: JSON.stringify(incompleteAnalysis) } }]
    } as any)

    const result = await service.analyzeSubmission(mockSubmission, mockBrief, mockWeights)

    // Verify default values are used for missing properties
    expect(result.content.quality.score).toBe(0)
    expect(result.content.quality.improvements).toEqual([])
    expect(result.brandAlignment.alignment).toEqual([])
  })

  it('should handle API errors gracefully', async () => {
    vi.mocked(drizzleDb.query.calibrationData.findMany).mockRejectedValue(new Error('Database error'))

    const result = await service.analyzeSubmission(mockSubmission, mockBrief, mockWeights)

    // Verify default result is returned
    expect(result.brandSafety.score).toBe(0)
    expect(result.content.quality.score).toBe(0)
    expect(result.brandAlignment.score).toBe(0)
  })

  it('should use calibration examples in prompt', async () => {
    vi.mocked(drizzleDb.query.calibrationData.findMany).mockResolvedValue(mockCalibrationData)
    
    const createSpy = vi.mocked(OpenAI.prototype.chat.completions.create)
    
    await service.analyzeSubmission(mockSubmission, mockBrief, mockWeights)

    // Verify prompt includes examples
    const prompt = createSpy.mock.calls[0][0].messages[1].content
    expect(prompt).toContain('Approved content example')
    expect(prompt).toContain('Rejected content example')
    expect(prompt).toContain('Great work, meets all requirements')
    expect(prompt).toContain('Missing key elements')
  })
}) 