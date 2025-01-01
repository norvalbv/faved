import { ReactElement } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/src/components/ui/card'
import { Badge } from '@/src/components/ui/badge'
import { FileText, MessageCircle } from 'lucide-react'
import type { Submission, SubmissionMetadata } from '@/lib/types/submission'
import { formatTimestamp } from './utils'
import { FeedbackSection } from './feedback-section'
import { SubmissionActions } from './submission-actions'

interface SubmissionCardProps {
  submission: Submission
  isSubmitting: boolean
  feedback: string
  onFeedbackChange: (value: string) => void
  onApprove: (id: string) => Promise<void>
  onRequestChanges: (id: string) => Promise<void>
  onAddFeedback: (id: string) => Promise<void>
  onReject: (id: string) => Promise<void>
}

export const SubmissionCard = ({ 
  submission,
  isSubmitting,
  feedback,
  onFeedbackChange,
  onApprove,
  onRequestChanges,
  onAddFeedback,
  onReject
}: SubmissionCardProps): ReactElement => {
  const metadata = submission.metadata as SubmissionMetadata
  const isApproved = metadata?.status === 'approved'
  const isRejected = metadata?.status === 'rejected'
  const hasFeedback = metadata?.feedbackHistory?.length > 0
  const isPending = !isApproved && !isRejected
  const canReopen = isApproved || isRejected
  const description = metadata?.message || submission.content

  return (
    <Card>
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
        <CardDescription className="whitespace-pre-wrap">
          {description}
        </CardDescription>
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
          <FeedbackSection 
            key={index}
            item={item}
            metadata={metadata}
          />
        ))}

        {(isPending || canReopen) && (
          <SubmissionActions
            submissionId={submission.id}
            isPending={isPending}
            isSubmitting={isSubmitting}
            feedback={feedback}
            onFeedbackChange={onFeedbackChange}
            onApprove={onApprove}
            onRequestChanges={onRequestChanges}
            onAddFeedback={onAddFeedback}
            onReject={onReject}
          />
        )}
      </CardContent>
    </Card>
  )
} 