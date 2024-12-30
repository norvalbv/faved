import OpenAI from 'openai'
import type { Brief } from '../types/brief'
import { Submission } from '../types/submission'

export interface AnalysisResult {
  matches: { category: string; items: string[] }[]
  mismatches: { category: string; items: string[] }[]
  brandSafety: { pass: boolean; issues: string[] }
  sellingPoints: { present: string[]; missing: string[] }
}

export interface BriefWithMetadata extends Omit<Brief, 'metadata'> {
  metadata: {
    overview: {
      what: string
      gettingStarted: string
    }
    guidelines: { category: string; items: string[] }[]
  }
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

export async function analyzeSubmission(
  submission: Submission,
  brief: BriefWithMetadata
): Promise<AnalysisResult> {
  try {
    console.log('Analyzing submission with AI...')

    const fileExtensionRegex = /\.(jpg|jpeg|png|gif|pdf|doc|docx|xls|xlsx|txt|mp4|mp3)$/i
    if (fileExtensionRegex.test(submission.content)) {
      const fileType = submission.content.split('.').pop()?.toLowerCase()
      let mediaType = 'file'
      
      if (['jpg', 'jpeg', 'png', 'gif'].includes(fileType || '')) {
        mediaType = 'image'
      } else if (['mp4'].includes(fileType || '')) {
        mediaType = 'video'
      } else if (['mp3'].includes(fileType || '')) {
        mediaType = 'audio'
      } else if (['pdf'].includes(fileType || '')) {
        mediaType = 'document'
      }

      return {
        matches: [{
          category: 'File Analysis',
          items: [`Received ${mediaType} submission: ${submission.content}`]
        }],
        mismatches: [],
        brandSafety: {
          pass: true,
          issues: []
        },
        sellingPoints: {
          present: [],
          missing: []
        }
      }
    }

    // Format the messages for the AI
    const messages = [
      {
        role: 'system' as const,
        content: `You are a strict content reviewer that analyzes submissions against brief requirements.

CRITICAL RULES:
1. If the submission fails any of these criteria:
   - Is completely off-topic or irrelevant
   - Is empty or nonsensical
   - Fails to address ANY of the core requirements
   - Shows no understanding of the brief's purpose
   
   You MUST respond in this format exactly:
   {{reject}}
   REASON: [Clear, professional explanation of why the submission was rejected]

2. Otherwise, provide a detailed analysis in this format:

ANALYSIS:
- Direct assessment of submission against requirements
- Highlight any critical misalignments

STRENGTHS:
- Only include if there are genuine strengths
- Must relate directly to brief requirements

AREAS FOR IMPROVEMENT:
- Specific, actionable improvements needed
- Reference exact brief requirements`
      },
      {
        role: 'user' as const,
        content: `Analyze this submission against the brief requirements:

BRIEF DETAILS
Title: ${brief.title}
Description: ${brief.description}
Type: ${brief.type}
Requirements: ${JSON.stringify(brief.metadata, null, 2)}

SUBMISSION CONTENT:
${submission.content}

Remember: For rejections, respond with {{reject}} followed by REASON: and your explanation.`
      }
    ]

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages,
      temperature: 0.5,
      max_tokens: 1000
    })

    const analysis = response.choices[0].message.content || ''
    
    // Parse the AI response into structured format
    const matches: { category: string; items: string[] }[] = []
    const mismatches: { category: string; items: string[] }[] = []
    const brandSafetyIssues: string[] = []
    
    // Check for rejection
    const isRejected = analysis.includes('{{reject}}')
    
    if (isRejected) {
      const reason = analysis.split('REASON:')[1]?.trim() || 'Submission does not meet brief requirements'
      mismatches.push({
        category: 'Rejection',
        items: [reason]
      })
    } else {
      // Parse sections
      const sections = analysis.split('\n\n')
      sections.forEach(section => {
        if (section.startsWith('ANALYSIS:')) {
          matches.push({
            category: 'Analysis',
            items: section.replace('ANALYSIS:', '').trim().split('\n').map(item => item.trim()).filter(Boolean)
          })
        } else if (section.startsWith('STRENGTHS:')) {
          matches.push({
            category: 'Strengths',
            items: section.replace('STRENGTHS:', '').trim().split('\n').map(item => item.trim()).filter(Boolean)
          })
        } else if (section.startsWith('AREAS FOR IMPROVEMENT:')) {
          mismatches.push({
            category: 'Areas for Improvement',
            items: section.replace('AREAS FOR IMPROVEMENT:', '').trim().split('\n').map(item => item.trim()).filter(Boolean)
          })
        }
      })
    }
    
    return {
      matches,
      mismatches,
      brandSafety: {
        pass: !isRejected,
        issues: brandSafetyIssues
      },
      sellingPoints: {
        present: matches.flatMap(m => m.items),
        missing: mismatches.flatMap(m => m.items)
      }
    }
  } catch (error) {
    console.error('AI analysis failed:', error)
    return {
      matches: [{
        category: 'Error',
        items: ['Failed to analyze submission']
      }],
      mismatches: [],
      brandSafety: {
        pass: true,
        issues: []
      },
      sellingPoints: {
        present: [],
        missing: []
      }
    }
  }
} 