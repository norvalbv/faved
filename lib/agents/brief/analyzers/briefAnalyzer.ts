import OpenAI from 'openai'
import { BriefAnalysisResult } from '../types'
import { AnalyzerConfig } from '../../shared/types'
import { Submission } from '../../../types/submission'
import { Brief } from '../../../types/brief'

export class BriefAnalyzer {
  private openai: OpenAI
  private config: Required<AnalyzerConfig>

  constructor(
    apiKey: string,
    config: AnalyzerConfig = {}
  ) {
    this.openai = new OpenAI({ apiKey })
    this.config = {
      temperature: config.temperature ?? 0.5,
      maxTokens: config.maxTokens ?? 1000,
      model: config.model ?? 'gpt-4o-mini'
    }
  }

  async analyze(submission: Submission, brief: Brief): Promise<BriefAnalysisResult> {
    const prompt = this.buildPrompt(submission, brief)
    
    try {
      const response = await this.openai.chat.completions.create({
        model: this.config.model,
        messages: [
          {
            role: 'system',
            content: `You are a specialized content reviewer analyzing submissions against specific brief requirements.
            
ANALYSIS FRAMEWORK:
1. Brief Type Alignment
   - Check if content matches brief type (${brief.type})
   - Verify specific requirements for this brief type
   - Assess topic relevance

2. Requirements Compliance
   - Core requirements met
   - Missing requirements
   - Guidelines followed
   - Format specifications

3. Brief-Specific Elements
   - Check for required tools/features based on brief type
   - Verify process alignment
   - Validate content structure

RESPONSE FORMAT:
{{compliance}}
requirements_met: [comma separated list]
requirements_missing: [comma separated list]
guidelines_followed: [true/false]
format_correct: [true/false]
brief_type_match: [0-100]
process_alignment: [0-100]
score: [0-100]
confidence: [0-100]

BRIEF TYPE CONTEXT:
game_design: Focus on game development workflow, character design, level planning
visual_creator: Focus on visual content creation, organization, and planning
filmmaking: Focus on pre-production, shot planning, and production workflow
logo_design: Focus on brand identity, design process, and client presentation
booktuber: Focus on content planning, story development, and writing process`
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: this.config.temperature,
        max_tokens: this.config.maxTokens
      })

      return this.parseResponse(response.choices[0].message.content || '', brief.type)
    } catch (error) {
      console.error('Brief analysis failed:', error)
      return this.getErrorResult()
    }
  }

  private buildPrompt(submission: Submission, brief: Brief): string {
    // Get brief-specific requirements
    const briefTypeRequirements = this.getBriefTypeRequirements(brief)

    return `Analyze this submission for compliance with brief requirements:

BRIEF TYPE: ${brief.type}
TITLE: ${brief.title}
DESCRIPTION: ${brief.description}

BRIEF-SPECIFIC REQUIREMENTS:
${briefTypeRequirements}

BRIEF METADATA:
${JSON.stringify(brief.metadata, null, 2)}

SUBMISSION CONTENT:
${submission.content}

Analyze how well this submission matches the specific requirements for a ${brief.type} brief.`
  }

  private getBriefTypeRequirements(brief: Brief): string {
    const typeSpecificTools = {
      game_design: brief.metadata?.suggestions?.items || [],
      visual_creator: ['Project Plan', 'Moodboard', 'Visual Elements'],
      filmmaking: brief.metadata?.productionTools?.items || [],
      logo_design: brief.metadata?.designProcess?.items || [],
      booktuber: brief.metadata?.writingTools?.items || []
    }

    const tools = typeSpecificTools[brief.type as keyof typeof typeSpecificTools] || []
    return `Required Tools/Elements:
${tools.map(tool => `- ${tool}`).join('\n')}

Guidelines:
${brief.metadata?.guidelines?.map(g => 
  `${g.category}:
${g.items.map(item => `- ${item}`).join('\n')}`
).join('\n\n') || 'No specific guidelines provided'}`
  }

  private parseResponse(response: string, briefType: string): BriefAnalysisResult {
    const complianceMatch = response.match(/{{compliance}}([\s\S]*?)(?={{|$)/)
    
    const compliance = {
      requirementsMet: [] as readonly string[],
      requirementsMissing: [] as readonly string[],
      guidelinesFollowed: false,
      formatCorrect: false,
      score: 0,
      confidence: 0
    }

    if (complianceMatch) {
      const complianceLines = complianceMatch[1].trim().split('\n')
      let tempRequirementsMet: string[] = []
      let tempRequirementsMissing: string[] = []
      
      complianceLines.forEach(line => {
        const [key, value] = line.split(':').map(s => s.trim())
        switch (key) {
          case 'requirements_met':
            tempRequirementsMet = value.split(',').map(i => i.trim()).filter(Boolean)
            break
          case 'requirements_missing':
            tempRequirementsMissing = value.split(',').map(i => i.trim()).filter(Boolean)
            break
          case 'guidelines_followed':
            compliance.guidelinesFollowed = value === 'true'
            break
          case 'format_correct':
            compliance.formatCorrect = value === 'true'
            break
          case 'score':
            compliance.score = parseInt(value)
            break
          case 'confidence':
            compliance.confidence = parseInt(value)
            break
        }
      })

      compliance.requirementsMet = tempRequirementsMet
      compliance.requirementsMissing = tempRequirementsMissing
    }

    return {
      compliance
    }
  }

  private getErrorResult(): BriefAnalysisResult {
    return {
      compliance: {
        requirementsMet: [],
        requirementsMissing: ['Analysis failed'],
        guidelinesFollowed: false,
        formatCorrect: false,
        score: 0,
        confidence: 0
      }
    }
  }
} 