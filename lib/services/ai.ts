import OpenAI from 'openai'
import type { Brief, BriefMetadata } from '../types/brief'

interface BriefWithMetadata extends Omit<Brief, 'metadata'> {
  metadata: BriefMetadata
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

export async function analyzeSubmission(submission: { content: string }, brief: BriefWithMetadata): Promise<string> {
  try {
    console.log('Analyzing submission with AI...')

    // Check if submission is a file by looking for file extensions
    const fileExtensionRegex = /\.(jpg|jpeg|png|gif|pdf|doc|docx|xls|xlsx|txt|mp4|mp3)$/i
    if (fileExtensionRegex.test(submission.content)) {
      return "I currently can't review files but will be able to later"
    }

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini", // Keep this specific model
      messages: [
        {
          role: "system",
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
          role: "user",
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
      ],
      temperature: 0.3,
      max_tokens: 1000
    })

    const feedback = response.choices[0]?.message?.content || "Unable to analyze submission"
    console.log('AI feedback generated:', feedback)
    
    // Check if it's a rejection
    if (feedback.includes('{{reject}}')) {
      // Extract the reason after {{reject}} and REASON:
      const reason = feedback.split('REASON:')[1]?.trim() || 'Submission does not meet brief requirements'
      
      // Return formatted rejection with reason
      return `{{reject}}
REASON: ${reason}`
    }
    
    return feedback
  } catch (error) {
    console.error('Error analyzing submission:', error)
    return "Error analyzing submission. Please try again later."
  }
} 