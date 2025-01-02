import { ReactElement } from 'react'
import { Badge } from '@/src/components/ui/badge'
import { Bot, User } from 'lucide-react'
import { formatTimestamp } from './utils'
import { SubmissionMetadata } from '@/lib/types/submission'
import { AnalysisResult } from '@/lib/services/enhanced-ai/types'
import { QualityWidget } from './quality-widget'
import { SafetyWidget } from './safety-widget'
import { AlignmentWidget } from './alignment-widget'
import { SellingPointsWidget } from './selling-points-widget'
import { ActionableInsights } from './actionable-insights'

interface FeedbackSectionProps {
  item: {
    feedback: string
    createdAt: string
    status: 'comment' | 'changes_requested' | 'approved' | 'rejected'
    isAiFeedback?: boolean
    analysis?: AnalysisResult
    weights?: Record<string, number>
  }
  metadata: SubmissionMetadata
}

const renderAIFeedback = (analysis: AnalysisResult) => {
  if (!analysis) return null

  console.log(analysis)

  return (
    <div className="space-y-8">
      {/* Always show insights if they exist */}
      {analysis.insights && (
        <div className="space-y-8">
          <ActionableInsights 
            insights={{
              sections: analysis.insights.sections,
              historicalContext: analysis.insights.historicalContext,
              metadata: analysis.insights.metadata
            }} 
          />
        </div>
      )}

      <div>
        <h4 className="font-medium text-gray-900 mb-4">Content Quality Analysis</h4>
        <QualityWidget contentQuality={analysis.content.quality} />
      </div>

      <div>
        <h4 className="font-medium text-gray-900 mb-4">Brand Safety Analysis</h4>
        <SafetyWidget brandSafety={analysis.brandSafety} />
      </div>

      <div>
        <h4 className="font-medium text-gray-900 mb-4">Brand Alignment</h4>
        <AlignmentWidget brandAlignment={analysis.brandAlignment} />
      </div>

      <div>
        <h4 className="font-medium text-gray-900 mb-4">Selling Points</h4>
        <SellingPointsWidget sellingPoints={analysis.content.sellingPoints} />
      </div>
    </div>
  )
}

export const FeedbackSection = ({ item, metadata }: FeedbackSectionProps): ReactElement => {
  if (item.isAiFeedback === true) {
    return (
      <div className="mb-6">
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
          {item.analysis && renderAIFeedback(item.analysis)}
        </div>
      </div>
    )
  }

  return (
    <div className="mb-4 rounded-lg bg-muted p-4">
      <div className="mb-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <User className="h-4 w-4" />
          <span className="text-sm font-medium">{metadata.sender || 'Anonymous'}</span>
          <Badge variant={
            item.status === 'approved' ? 'success' : 
            item.status === 'changes_requested' ? 'warning' : 
            item.status === 'rejected' ? 'destructive' :
            'secondary'
          }>
            {item.status === 'changes_requested' ? 'Changes Requested' :
             item.status.charAt(0).toUpperCase() + item.status.slice(1)}
          </Badge>
        </div>
        <time className="text-xs text-muted-foreground">
          {formatTimestamp(item.createdAt)}
        </time>
      </div>
      <p className="text-sm text-muted-foreground whitespace-pre-wrap">
        {item.feedback}
      </p>
    </div>
  )
} 