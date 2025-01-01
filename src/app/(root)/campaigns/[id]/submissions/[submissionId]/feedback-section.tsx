import { ReactElement } from 'react'
import { Badge } from '@/src/components/ui/badge'
import { Bot } from 'lucide-react'
import { formatTimestamp, parseFeedback } from './utils'
import { QualityWidget } from './quality-widget'
import { SafetyWidget } from './safety-widget'
import { AlignmentWidget } from './alignment-widget'
import { SellingPointsWidget } from './selling-points-widget'
import type { SubmissionMetadata } from '@/lib/types/submission'

interface FeedbackItem {
  isAiFeedback: boolean
  status?: string
  feedback?: string
  createdAt?: string
}

interface FeedbackSectionProps {
  item: FeedbackItem
  metadata: SubmissionMetadata
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

export const FeedbackSection = ({ item, metadata }: FeedbackSectionProps): ReactElement => {
  if (item.isAiFeedback) {
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
          {renderAIFeedback(parseFeedback(item.feedback))}
        </div>
      </div>
    )
  }

  return (
    <div className="mb-4 rounded-lg bg-muted p-4">
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
} 