import { ReactElement } from 'react'
import { Badge } from '@/src/components/ui/badge'
import { Bot } from 'lucide-react'
import { formatTimestamp } from './utils'
import { QualityWidget } from './quality-widget'
import { SafetyWidget } from './safety-widget'
import { AlignmentWidget } from './alignment-widget'
import { SellingPointsWidget } from './selling-points-widget'
import type { SubmissionMetadata } from '@/lib/types/submission'

interface FeedbackItem {
  feedback: string
  createdAt: string
  status: 'comment' | 'approved' | 'rejected' | 'changes_requested'
  isAiFeedback?: boolean
  timestamp?: string
  brandSafety?: {
    pass: boolean
    score: number
    issues: string[]
    confidence: number
  }
  sellingPoints?: {
    missing: string[]
    present: string[]
    effectiveness: number
  }
  brandAlignment?: {
    score: number
    issues: string[]
    toneMatch: number
    confidence: number
  }
  contentQuality?: {
    tone: string[]
    score: number
    strengths: string[]
    improvements: string[]
  }
}

interface FeedbackSectionProps {
  item: FeedbackItem
  metadata: SubmissionMetadata
}

const renderAIFeedback = (item: FeedbackItem) => {
  if (!item.contentQuality && !item.brandSafety && !item.brandAlignment && !item.sellingPoints) return null

  return (
    <div className="space-y-8">
      {item.contentQuality && (
        <div>
          <h4 className="font-medium text-gray-900 mb-4">Content Quality Analysis</h4>
          <QualityWidget 
            metrics={[
              { label: 'Content Quality', value: item.contentQuality.score, max: 100 }
            ]}
            strengths={item.contentQuality.strengths}
            improvements={item.contentQuality.improvements}
          />
        </div>
      )}

      {item.brandSafety && (
        <div>
          <h4 className="font-medium text-gray-900 mb-4">Brand Safety Analysis</h4>
          <SafetyWidget 
            score={item.brandSafety.score}
            confidence={item.brandSafety.confidence}
            issues={item.brandSafety.issues}
          />
        </div>
      )}

      {item.brandAlignment && (
        <div>
          <h4 className="font-medium text-gray-900 mb-4">Brand Alignment</h4>
          <AlignmentWidget 
            toneMatch={item.brandAlignment.toneMatch}
            issues={item.brandAlignment.issues}
          />
        </div>
      )}

      {item.sellingPoints && (
        <div>
          <h4 className="font-medium text-gray-900 mb-4">Selling Points</h4>
          <SellingPointsWidget 
            present={item.sellingPoints.present}
            missing={item.sellingPoints.missing}
          />
        </div>
      )}
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
          {renderAIFeedback(item)}
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