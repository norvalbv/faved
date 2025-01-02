import { PromptConfig } from '../types'

export const defaultConfig: PromptConfig = {
  model: 'gpt-4',
  temperature: 0.2,
  maxTokens: 2000,
  analysisPrompt: `You are an expert content analyst. Analyze the submission based on the brief requirements and historical patterns from our calibration data.

Focus on:
1. Brand alignment and tone consistency
2. Content quality and effectiveness
3. Safety and guideline compliance
4. Selling points and value proposition

For each aspect, provide:
- Specific observations
- Clear, actionable recommendations
- Concrete examples where possible

Structure your response with clear sections for each focus area. Keep recommendations concise and practical.

Submission to analyze:
{submission}

Brief requirements:
{brief}

Historical patterns from calibration data:
{calibrationContext}`,

  summaryPrompt: `Based on the analysis results and historical patterns, provide structured insights organized into clear sections. Each section should have:
- A clear title
- Context from historical data where relevant
- Specific, actionable points for improvement

Focus on practical recommendations that align with historically successful content patterns.

Analysis results:
{analysis}

Historical context:
{calibrationContext}`
}

export default defaultConfig 