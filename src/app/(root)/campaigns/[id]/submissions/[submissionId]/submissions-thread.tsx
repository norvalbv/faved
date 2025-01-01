'use client'

import { ReactElement, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/src/components/ui/card'
import { Badge } from '@/src/components/ui/badge'
import { Button } from '@/src/components/ui/button'
import { Textarea } from '@/src/components/ui/textarea'
import { formatDistanceToNow } from 'date-fns'
import { FileText, MessageCircle, Send, XCircle, Bot, CheckCircle, AlertTriangle, CheckCircle2, AlertCircle, Plus, Minus, Sparkles, AlertOctagon, Star, Target } from 'lucide-react'
import type { Submission, SubmissionMetadata } from '@/lib/types/submission'
import { cn } from '@/lib/utils'
import { Progress } from '@/src/components/ui/progress'

interface Props {
  submissions: Submission[]
  onApprove: (id: string, feedback: string) => Promise<void>
  onRequestChanges: (id: string, feedback: string) => Promise<void>
  onAddFeedback: (id: string, feedback: string) => Promise<void>
  onReject: (id: string, feedback: string) => Promise<void>
}

const formatTimestamp = (timestamp?: string) => {
  if (!timestamp) return 'Recently'
  try {
    return formatDistanceToNow(new Date(timestamp), { addSuffix: true })
  } catch (error) {
    return 'Recently'
  }
}

interface FeedbackMetric {
  label: string
  value: number
  max: number
}

interface FeedbackSection {
  title: string
  content: string[]
  type?: 'metrics' | 'list' | 'score' | 'header' | 'section_header' | 'subsection'
  metrics?: FeedbackMetric[]
}

const formatAIFeedback = (feedback?: string): FeedbackSection[] => {
  console.log('feedback', feedback)
  if (!feedback) return []
  try {
    const sections = feedback.split('\n\n')
      .map(section => {
        if (!section.trim()) return null
        const [title, ...content] = section.split('\n')

        // Handle metrics sections
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
        
        // Handle score sections
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

        // Handle list sections
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

        // Handle Selling Points section
        if (title === 'Selling Points:') {
          return {
            title,
            content: [],
            type: 'section_header'
          } as FeedbackSection
        }

        // Handle Present/Missing subsections
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

const renderMetricCard = (label: string, value: number, max: number, color: string) => (
  <div className="flex flex-col gap-1.5 p-3 rounded-lg bg-white border border-gray-100 shadow-sm">
    <div className="flex justify-between items-center">
      <span className="text-sm font-medium text-gray-700">{label}</span>
      <span className={cn("text-sm font-semibold", color)}>{value}/{max}</span>
    </div>
    <Progress 
      value={(value / max) * 100} 
      className={cn("h-1.5", 
        value >= 80 ? "bg-green-500" : 
        value >= 60 ? "bg-amber-500" : 
        "bg-red-500"
      )} 
    />
  </div>
)

const QualityWidget = ({ metrics, strengths, improvements }: { 
  metrics: FeedbackMetric[], 
  strengths: string[], 
  improvements: string[] 
}) => (
  <div className="space-y-6">
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
      {metrics.map((metric, idx) => renderMetricCard(
        metric.label,
        metric.value,
        metric.max,
        metric.value >= 80 ? "text-green-600" :
        metric.value >= 60 ? "text-amber-600" :
        "text-red-600"
      ))}
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div className={cn("rounded-lg overflow-hidden border shadow-sm bg-green-50 border-green-100")}>
        <div className={cn("px-4 py-2 flex items-center gap-2 font-medium text-sm text-green-700 bg-green-100")}>
          <Sparkles className="h-4 w-4 text-green-500 flex-shrink-0" />
          <span>Strengths</span>
        </div>
        <div className="p-4 space-y-3">
          {strengths.map((line, idx) => (
            <div key={idx} className="flex items-start gap-3 group">
              <div className="w-1 h-1 rounded-full mt-2 bg-current opacity-40 group-hover:opacity-100 transition-opacity" />
              <p className="text-sm text-gray-700 leading-relaxed flex-1">{line}</p>
            </div>
          ))}
        </div>
      </div>
      <div className={cn("rounded-lg overflow-hidden border shadow-sm bg-amber-50 border-amber-100")}>
        <div className={cn("px-4 py-2 flex items-center gap-2 font-medium text-sm text-amber-700 bg-amber-100")}>
          <AlertCircle className="h-4 w-4 text-amber-500 flex-shrink-0" />
          <span>Areas for Improvement</span>
        </div>
        <div className="p-4 space-y-3">
          {improvements.map((line, idx) => (
            <div key={idx} className="flex items-start gap-3 group">
              <div className="w-1 h-1 rounded-full mt-2 bg-current opacity-40 group-hover:opacity-100 transition-opacity" />
              <p className="text-sm text-gray-700 leading-relaxed flex-1">{line}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
)

const SafetyWidget = ({ score, confidence, issues }: {
  score: number,
  confidence: number,
  issues: string[]
}) => (
  <div className="space-y-4">
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {renderMetricCard("Overall Score", score, 100, 
        score >= 80 ? "text-green-600" :
        score >= 60 ? "text-amber-600" :
        "text-red-600"
      )}
      {renderMetricCard("Confidence", confidence, 100, "text-blue-600")}
    </div>
    <div className={cn("rounded-lg overflow-hidden border shadow-sm bg-red-50 border-red-100")}>
      <div className={cn("px-4 py-2 flex items-center gap-2 font-medium text-sm text-red-700 bg-red-100")}>
        <AlertTriangle className="h-4 w-4 text-red-500 flex-shrink-0" />
        <span>Safety Issues</span>
      </div>
      <div className="p-4 space-y-3">
        {issues.map((line, idx) => (
          <div key={idx} className="flex items-start gap-3 group">
            <div className="w-1 h-1 rounded-full mt-2 bg-current opacity-40 group-hover:opacity-100 transition-opacity" />
            <p className="text-sm text-gray-700 leading-relaxed flex-1">{line}</p>
          </div>
        ))}
      </div>
    </div>
  </div>
)

const AlignmentWidget = ({ toneMatch, issues }: {
  toneMatch: number,
  issues: string[]
}) => (
  <div className="space-y-4">
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {renderMetricCard("Tone Match", toneMatch, 100,
        toneMatch >= 80 ? "text-green-600" :
        toneMatch >= 60 ? "text-amber-600" :
        "text-red-600"
      )}
    </div>
    <div className={cn("rounded-lg overflow-hidden border shadow-sm bg-purple-50 border-purple-100")}>
      <div className={cn("px-4 py-2 flex items-center gap-2 font-medium text-sm text-purple-700 bg-purple-100")}>
        <Target className="h-4 w-4 text-purple-500 flex-shrink-0" />
        <span>Alignment Issues</span>
      </div>
      <div className="p-4 space-y-3">
        {issues.map((line, idx) => (
          <div key={idx} className="flex items-start gap-3 group">
            <div className="w-1 h-1 rounded-full mt-2 bg-current opacity-40 group-hover:opacity-100 transition-opacity" />
            <p className="text-sm text-gray-700 leading-relaxed flex-1">{line}</p>
          </div>
        ))}
      </div>
    </div>
  </div>
)

const SellingPointsWidget = ({ present, missing }: {
  present: string[],
  missing: string[]
}) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
    <div className={cn("rounded-lg overflow-hidden border shadow-sm bg-blue-50 border-blue-100")}>
      <div className={cn("px-4 py-2 flex items-center gap-2 font-medium text-sm text-blue-700 bg-blue-100")}>
        <Star className="h-4 w-4 text-blue-500 flex-shrink-0" />
        <span>Present</span>
      </div>
      <div className="p-4 space-y-3">
        {present.map((line, idx) => (
          <div key={idx} className="flex items-start gap-3 group">
            <div className="w-1 h-1 rounded-full mt-2 bg-current opacity-40 group-hover:opacity-100 transition-opacity" />
            <p className="text-sm text-gray-700 leading-relaxed flex-1">{line}</p>
          </div>
        ))}
      </div>
    </div>
    <div className={cn("rounded-lg overflow-hidden border shadow-sm bg-gray-50 border-gray-100")}>
      <div className={cn("px-4 py-2 flex items-center gap-2 font-medium text-sm text-gray-700 bg-gray-100")}>
        <AlertOctagon className="h-4 w-4 text-gray-500 flex-shrink-0" />
        <span>Missing</span>
      </div>
      <div className="p-4 space-y-3">
        {missing.map((line, idx) => (
          <div key={idx} className="flex items-start gap-3 group">
            <div className="w-1 h-1 rounded-full mt-2 bg-current opacity-40 group-hover:opacity-100 transition-opacity" />
            <p className="text-sm text-gray-700 leading-relaxed flex-1">{line}</p>
          </div>
        ))}
      </div>
    </div>
  </div>
)

const parseFeedback = (feedback?: string): any => {
  if (!feedback) return null
  
  try {
    const sections = feedback.split('\n\n')
    const parsed: any = {
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

const renderAIFeedback = (feedback: any) => {
  if (!feedback) return null

  return (
    <div className="space-y-8">
      <div>
        <h4 className="font-medium text-gray-900 mb-4">Content Quality Analysis</h4>
        <QualityWidget 
          metrics={[
            { label: 'Clarity', value: feedback.contentQuality.clarity || 0, max: 100 },
            { label: 'Engagement', value: feedback.contentQuality.engagement || 0, max: 100 },
            { label: 'Technical Accuracy', value: feedback.contentQuality.technicalAccuracy || 0, max: 100 }
          ]}
          strengths={feedback.contentQuality.strengths || []}
          improvements={feedback.contentQuality.improvements || []}
        />
      </div>

      <div>
        <h4 className="font-medium text-gray-900 mb-4">Brand Safety Analysis</h4>
        <SafetyWidget 
          score={feedback.brandSafety.score || 0}
          confidence={feedback.brandSafety.confidence || 0}
          issues={feedback.brandSafety.issues || []}
        />
      </div>

      <div>
        <h4 className="font-medium text-gray-900 mb-4">Brand Alignment</h4>
        <AlignmentWidget 
          toneMatch={feedback.brandAlignment.toneMatch || 0}
          issues={feedback.brandAlignment.issues || []}
        />
      </div>

      <div>
        <h4 className="font-medium text-gray-900 mb-4">Selling Points</h4>
        <SellingPointsWidget 
          present={feedback.sellingPoints.present || []}
          missing={feedback.sellingPoints.missing || []}
        />
      </div>
    </div>
  )
}

export const SubmissionThread = ({ 
  submissions, 
  onApprove, 
  onRequestChanges, 
  onAddFeedback,
  onReject,
}: Props): ReactElement => {
  const [feedback, setFeedback] = useState<string>('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [expandedDescriptions, setExpandedDescriptions] = useState<Record<string, boolean>>({})

  const toggleDescription = (id: string) => {
    setExpandedDescriptions(prev => ({
      ...prev,
      [id]: !prev[id]
    }))
  }

  const handleApprove = async (id: string) => {
    if (!feedback.trim()) return
    try {
      setIsSubmitting(true)
      await onApprove(id, feedback)
      setFeedback('')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleRequestChanges = async (id: string) => {
    if (!feedback.trim()) return
    try {
      setIsSubmitting(true)
      await onRequestChanges(id, feedback)
      setFeedback('')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleReject = async (id: string) => {
    if (!feedback.trim()) return
    try {
      setIsSubmitting(true)
      await onReject(id, feedback)
      setFeedback('')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleAddFeedback = async (id: string) => {
    if (!feedback.trim()) return
    try {
      setIsSubmitting(true)
      await onAddFeedback(id, feedback)
      setFeedback('')
    } finally {
      setIsSubmitting(false)
    }
  }

  const renderFeedbackSection = (section: FeedbackSection) => {
    if (section.type === 'metrics' && section.metrics) {
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {section.metrics.map((metric, idx) => renderMetricCard(
            metric.label,
            metric.value,
            metric.max,
            metric.value >= 80 ? "text-green-600" :
            metric.value >= 60 ? "text-amber-600" :
            "text-red-600"
          ))}
        </div>
      )
    }

    if (section.type === 'score' && section.metrics) {
      return (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {section.metrics.map((metric, idx) => renderMetricCard(
              metric.label,
              metric.value,
              metric.max,
              metric.value >= 80 ? "text-green-600" :
              metric.value >= 60 ? "text-amber-600" :
              "text-red-600"
            ))}
          </div>
          {section.content.length > 0 && (
            <div className="mt-4 space-y-2">
              {section.content.map((line, idx) => (
                <p key={idx} className="text-gray-700">{line}</p>
              ))}
            </div>
          )}
        </div>
      )
    }

    if (section.type === 'section_header') {
      return (
        <div className="mt-6 mb-3">
          <h3 className="text-lg font-semibold text-gray-900">{section.title}</h3>
        </div>
      )
    }

    if (section.type === 'subsection') {
      const getIcon = (title: string) => {
        switch (title) {
          case 'Present:':
            return <Star className="h-4 w-4 text-blue-500 flex-shrink-0" />
          case 'Missing:':
            return <AlertOctagon className="h-4 w-4 text-gray-500 flex-shrink-0" />
          default:
            return <CheckCircle2 className="h-4 w-4 text-blue-500 flex-shrink-0" />
        }
      }

      const getBgColor = (title: string) => {
        switch (title) {
          case 'Present:':
            return 'bg-blue-50 border-blue-100'
          case 'Missing:':
            return 'bg-gray-50 border-gray-100'
          default:
            return 'bg-gray-50 border-gray-100'
        }
      }

      const getHeaderStyle = (title: string) => {
        switch (title) {
          case 'Present:':
            return 'text-blue-700 bg-blue-100'
          case 'Missing:':
            return 'text-gray-700 bg-gray-100'
          default:
            return 'text-gray-700 bg-gray-100'
        }
      }

      return (
        <div className="pl-4 mb-4">
          <div className={cn("rounded-lg overflow-hidden border shadow-sm", getBgColor(section.title))}>
            <div className={cn("px-4 py-2 flex items-center gap-2 font-medium text-sm", getHeaderStyle(section.title))}>
              {getIcon(section.title)}
              <span>{section.title.replace(':', '')}</span>
            </div>
            <div className="p-4 space-y-3">
              {section.content.map((line, idx) => (
                <div key={idx} className="flex items-start gap-3 group">
                  <div className="w-1 h-1 rounded-full mt-2 bg-current opacity-40 group-hover:opacity-100 transition-opacity" />
                  <div className="flex-1 text-sm">
                    <p className="text-gray-700 leading-relaxed">
                      {line.replace('• ', '')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )
    }

    if (section.type === 'list') {
      const getIcon = (title: string) => {
        switch (title) {
          case 'Strengths:':
            return <Sparkles className="h-4 w-4 text-green-500 flex-shrink-0" />
          case 'Areas for Improvement:':
            return <AlertCircle className="h-4 w-4 text-amber-500 flex-shrink-0" />
          case 'Safety Issues:':
            return <AlertTriangle className="h-4 w-4 text-red-500 flex-shrink-0" />
          case 'Alignment Issues:':
            return <Target className="h-4 w-4 text-purple-500 flex-shrink-0" />
          default:
            return <CheckCircle2 className="h-4 w-4 text-blue-500 flex-shrink-0" />
        }
      }

      const getBgColor = (title: string) => {
        switch (title) {
          case 'Strengths:':
            return 'bg-green-50 border-green-100'
          case 'Areas for Improvement:':
            return 'bg-amber-50 border-amber-100'
          case 'Safety Issues:':
            return 'bg-red-50 border-red-100'
          case 'Alignment Issues:':
            return 'bg-purple-50 border-purple-100'
          default:
            return 'bg-gray-50 border-gray-100'
        }
      }

      const getHeaderStyle = (title: string) => {
        switch (title) {
          case 'Strengths:':
            return 'text-green-700 bg-green-100'
          case 'Areas for Improvement:':
            return 'text-amber-700 bg-amber-100'
          case 'Safety Issues:':
            return 'text-red-700 bg-red-100'
          case 'Alignment Issues:':
            return 'text-purple-700 bg-purple-100'
          default:
            return 'text-gray-700 bg-gray-100'
        }
      }

      return (
        <div className={cn("rounded-lg overflow-hidden border shadow-sm mb-4", getBgColor(section.title))}>
          <div className={cn("px-4 py-2 flex items-center gap-2 font-medium text-sm", getHeaderStyle(section.title))}>
            {getIcon(section.title)}
            <span>{section.title.replace(':', '')}</span>
          </div>
          <div className="p-4 space-y-3">
            {section.content.map((line, idx) => (
              <div key={idx} className="flex items-start gap-3 group">
                <div className="w-1 h-1 rounded-full mt-2 bg-current opacity-40 group-hover:opacity-100 transition-opacity" />
                <div className="flex-1 text-sm">
                  <p className="text-gray-700 leading-relaxed">
                    {line.replace('• ', '')}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )
    }

    return (
      <div className="space-y-2">
        {section.content.map((line, idx) => (
          <p key={idx} className="text-gray-700">{line}</p>
        ))}
      </div>
    )
  }

  return (
    <div className="grid gap-4">
      {submissions.map(submission => {
        const metadata = submission.metadata as SubmissionMetadata
        const isApproved = metadata?.status === 'approved'
        const isRejected = metadata?.status === 'rejected'
        const hasFeedback = metadata?.feedbackHistory?.length > 0
        const isPending = !isApproved && !isRejected
        const canReopen = isApproved || isRejected
        const isExpanded = expandedDescriptions[submission.id]
        const description = metadata?.message || submission.content

        return (
          <Card key={submission.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CardTitle className="text-base">
                    {metadata?.sender || 'Anonymous'}
                  </CardTitle>
                  <Badge variant="outline" className="text-xs">
                    {metadata?.type || submission.type || 'content'}
                  </Badge>
                </div>
                <Badge variant={
                  isApproved ? 'success' : 
                  isRejected ? 'destructive' : 
                  hasFeedback ? 'warning' : 
                  'secondary'
                }>
                  {isApproved ? 'Approved' : 
                   isRejected ? 'Rejected' :
                   'In Review'}
                </Badge>
              </div>
              <div>
                <CardDescription className={cn(
                  "whitespace-pre-wrap transition-all duration-200",
                  !isExpanded && "line-clamp-2"
                )}>
                  {description}
                </CardDescription>
                {description.length > 150 && (
                  <button
                    onClick={() => toggleDescription(submission.id)}
                    className="text-xs text-blue-600 hover:text-blue-800 mt-1 font-medium"
                  >
                    {isExpanded ? 'Show less' : 'Show more'}
                  </button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <FileText className="h-4 w-4" />
                  <span>Stage {metadata?.stageId || '1'}</span>
                </div>
                {hasFeedback && (
                  <>
                    <span>•</span>
                    <div className="flex items-center gap-1.5">
                      <MessageCircle className="h-4 w-4" />
                      <span>{metadata.feedbackHistory.length} feedback items</span>
                    </div>
                  </>
                )}
                <span>•</span>
                <time>
                  {formatTimestamp(metadata?.createdAt)}
                </time>
              </div>

              {metadata?.feedbackHistory?.map((item, index) => (
                item.isAiFeedback ? (
                  <div key={index} className="mb-6">
                    <div className="bg-white rounded-lg p-6 space-y-6 shadow-sm border border-gray-200">
                      <div className="flex items-center gap-2">
                        <Bot className="w-5 h-5 text-blue-600" />
                        <span className="font-semibold text-blue-600">AI Analysis</span>
                        {item.status === 'rejected' && (
                          <Badge variant="destructive" className="ml-2">
                            Rejected
                          </Badge>
                        )}
                        <time className="text-xs text-muted-foreground ml-auto">
                          {formatTimestamp(item.createdAt)}
                        </time>
                      </div>
                      {renderAIFeedback(parseFeedback(item.feedback))}
                    </div>
                  </div>
                ) : (
                  <div key={index} className="mb-4 rounded-lg bg-muted p-4">
                    <div className="mb-2 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">{metadata.sender}</span>
                        <Badge variant={
                          item.status === 'approved' ? 'success' : 
                          item.status === 'changes_requested' ? 'warning' : 
                          item.status === 'rejected' ? 'destructive' :
                          'secondary'
                        }>
                          {item.status === 'approved' ? 'Approved' :
                           item.status === 'changes_requested' ? 'Changes Requested' :
                           item.status === 'rejected' ? 'Rejected' :
                           'Comment'}
                        </Badge>
                      </div>
                      <time className="text-xs text-muted-foreground">
                        {formatTimestamp(item.createdAt)}
                      </time>
                    </div>
                    <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                      {item.feedback || ''}
                    </p>
                  </div>
                )
              ))}

              {(isPending || canReopen) && (
                <div className="mt-4 space-y-4">
                  <div className="flex items-end gap-3">
                    <div className="flex-1">
                      <Textarea 
                        value={feedback}
                        onChange={(e) => setFeedback(e.target.value)}
                        placeholder={canReopen ? "Add feedback to reopen..." : "Add your feedback..."}
                        className="min-h-[2.5rem] resize-none border-muted-foreground/20 bg-muted/50"
                        rows={3}
                      />
                    </div>
                    <Button 
                      type="button" 
                      size="sm" 
                      className="h-10 gap-1.5"
                      disabled={!feedback.trim() || isSubmitting}
                      onClick={() => handleAddFeedback(submission.id)}
                    >
                      <Send className="h-4 w-4" />
                      Send
                    </Button>
                  </div>
                  {isPending ? (
                    <div className="flex items-center gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        disabled={!feedback.trim() || isSubmitting}
                        onClick={() => handleRequestChanges(submission.id)}
                      >
                        Request Changes
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="text-red-600 hover:text-red-600 hover:bg-red-100"
                        disabled={!feedback.trim() || isSubmitting}
                        onClick={() => handleReject(submission.id)}
                      >
                        <XCircle className="mr-2 h-4 w-4" />
                        Reject
                      </Button>
                      <Button 
                        variant="primary" 
                        size="sm" 
                        className="bg-green-600 hover:bg-green-700"
                        disabled={!feedback.trim() || isSubmitting}
                        onClick={() => handleApprove(submission.id)}
                      >
                        Approve
                      </Button>
                    </div>
                  ) : (
                    <Button 
                      variant="outline" 
                      size="sm"
                      disabled={!feedback.trim() || isSubmitting}
                      onClick={() => handleRequestChanges(submission.id)}
                    >
                      Reopen with Changes
                    </Button>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        )
      })}

      {submissions.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-8 text-center">
            <h3 className="mb-2 text-lg font-medium">No submissions yet</h3>
            <p className="mb-4 text-sm text-muted-foreground">
              There are no submissions for this campaign yet
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
} 