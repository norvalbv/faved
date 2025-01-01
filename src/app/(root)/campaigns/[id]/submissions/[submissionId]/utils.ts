import { formatDistanceToNow } from 'date-fns'
import type { FeedbackSection, ParsedFeedback } from './types'

export const formatTimestamp = (timestamp?: string): string => {
  if (!timestamp) return 'Recently'
  try {
    return formatDistanceToNow(new Date(timestamp), { addSuffix: true })
  } catch (error) {
    return 'Recently'
  }
}

export const formatAIFeedback = (feedback?: string): FeedbackSection[] => {
  if (!feedback) return []
  try {
    const sections = feedback.split('\n\n')
      .map(section => {
        if (!section.trim()) return null
        const [title, ...content] = section.split('\n')

        if (title === 'Content Quality Analysis:') {
          const metrics = content
            .filter(line => line.includes('/100'))
            .map(line => {
              const [label, score] = line.split(': ')
              const value = parseInt(score)
              return { label, value, max: 100 }
            })
          return { 
            title, 
            content: content.filter(line => !line.includes('/100')),
            type: 'metrics',
            metrics 
          } as FeedbackSection
        }
        
        if (title === 'Brand Safety Analysis:' || title === 'Brand Alignment:') {
          const scoreLines = content.filter(line => line.includes('/100') || line.includes('%'))
          const otherLines = content.filter(line => !line.includes('/100') && !line.includes('%'))
          return {
            title,
            content: otherLines,
            type: 'score',
            metrics: scoreLines.map(line => {
              const [label, score] = line.split(': ')
              const value = parseInt(score)
              return { label, value, max: line.includes('%') ? 100 : 100 }
            })
          } as FeedbackSection
        }

        if (title === 'Strengths:' || 
            title === 'Areas for Improvement:' || 
            title === 'Safety Issues:' || 
            title === 'Alignment Issues:') {
          return {
            title,
            content: content.filter(line => line.trim().length > 0).map(line => 
              line.startsWith('•') ? line : `• ${line.trim()}`
            ),
            type: 'list'
          } as FeedbackSection
        }

        if (title === 'Selling Points:') {
          return {
            title,
            content: [],
            type: 'section_header'
          } as FeedbackSection
        }

        if (title === 'Present:' || title === 'Missing:') {
          return {
            title,
            content: content.filter(line => line.trim().length > 0).map(line => 
              line.startsWith('•') ? line : `• ${line.trim()}`
            ),
            type: 'subsection'
          } as FeedbackSection
        }

        return { 
          title: title || 'Analysis', 
          content: content.filter(Boolean) 
        } as FeedbackSection
      })
      .filter((section): section is FeedbackSection => section !== null)
    
    return sections.length ? sections : [{ 
      title: 'Analysis', 
      content: [feedback] 
    }]
  } catch (error) {
    return [{ 
      title: 'AI Analysis', 
      content: [feedback || 'Analysis not available'] 
    }]
  }
}

export const parseFeedback = (feedback?: string): ParsedFeedback | null => {
  if (!feedback) return null
  
  try {
    const sections = feedback.split('\n\n')
    const parsed: ParsedFeedback = {
      contentQuality: {
        clarity: 0,
        engagement: 0,
        technicalAccuracy: 0,
        strengths: [],
        improvements: []
      },
      brandSafety: {
        score: 0,
        confidence: 0,
        issues: []
      },
      brandAlignment: {
        toneMatch: 0,
        issues: []
      },
      sellingPoints: {
        present: [],
        missing: []
      }
    }

    let currentSection = ''

    sections.forEach(section => {
      const lines = section.split('\n')
      const title = lines[0]
      const content = lines.slice(1)
      
      switch (title) {
        case 'Content Quality Analysis:':
          content.forEach(line => {
            if (line.includes('Clarity:')) {
              parsed.contentQuality.clarity = parseInt(line.split('/')[0].split(': ')[1])
            } else if (line.includes('Engagement:')) {
              parsed.contentQuality.engagement = parseInt(line.split('/')[0].split(': ')[1])
            } else if (line.includes('Technical Accuracy:')) {
              parsed.contentQuality.technicalAccuracy = parseInt(line.split('/')[0].split(': ')[1])
            }
          })
          break

        case 'Strengths:':
          parsed.contentQuality.strengths = content
            .filter(line => line.trim())
            .map(line => line.replace('• ', '').trim())
          break

        case 'Areas for Improvement:':
          parsed.contentQuality.improvements = content
            .filter(line => line.trim())
            .map(line => line.replace('• ', '').trim())
          break

        case 'Brand Safety Analysis:':
          content.forEach(line => {
            if (line.includes('Overall Score:')) {
              parsed.brandSafety.score = parseInt(line.split('/')[0].split(': ')[1])
            } else if (line.includes('Confidence:')) {
              parsed.brandSafety.confidence = parseInt(line.split('%')[0].split(': ')[1])
            }
          })
          break

        case 'Safety Issues:':
          parsed.brandSafety.issues = content
            .filter(line => line.trim())
            .map(line => line.replace('• ', '').trim())
            .filter(line => !line.includes('Brand Alignment:') && !line.includes('Tone Match:'))
          break

        case 'Brand Alignment:':
          content.forEach(line => {
            if (line.includes('Tone Match:')) {
              parsed.brandAlignment.toneMatch = parseInt(line.split('/')[0].split(': ')[1])
            }
          })
          break

        case 'Alignment Issues:':
          parsed.brandAlignment.issues = content
            .filter(line => line.trim())
            .map(line => line.replace('• ', '').trim())
          break

        case 'Selling Points:':
          currentSection = 'sellingPoints'
          break

        case 'Present:':
          if (currentSection === 'sellingPoints') {
            parsed.sellingPoints.present = content
              .filter(line => line.trim())
              .map(line => line.replace('• ', '').trim())
          }
          break

        case 'Missing:':
          if (currentSection === 'sellingPoints') {
            parsed.sellingPoints.missing = content
              .filter(line => line.trim())
              .map(line => line.replace('• ', '').trim())
          }
          break
      }
    })

    return parsed
  } catch (error) {
    console.error('Error parsing feedback:', error)
    return null
  }
} 