'use client'

import { ReactElement } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card'
import { Badge } from '@/src/components/ui/badge'
import { Button } from '@/src/components/ui/button'
import { FeedbackSection } from './feedback-section'
import type { Feedback } from '@/lib/data-store/schema/feedback'

interface SubmissionDetailProps {
  submission: {
    id: string
    type: 'video_topic' | 'draft_script' | 'draft_video' | 'live_video'
    content: string
    status: 'pending' | 'approved' | 'rejected'
    createdAt: Date
  }
  feedback: Feedback[]
  onApprove: (id: string) => void
  onReject: (id: string) => void
}

export const SubmissionDetail = ({ submission, feedback, onApprove, onReject }: SubmissionDetailProps): ReactElement => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-500'
      case 'rejected':
        return 'bg-red-500'
      default:
        return 'bg-yellow-500'
    }
  }

  const getTypeLabel = (type: string) => {
    return type.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle>{getTypeLabel(submission.type)}</CardTitle>
              <Badge className={`mt-2 ${getStatusColor(submission.status)}`}>
                {submission.status.charAt(0).toUpperCase() + submission.status.slice(1)}
              </Badge>
            </div>
            {submission.status === 'pending' && (
              <div className="space-x-2">
                <Button 
                  variant="outline" 
                  onClick={() => onReject(submission.id)}
                  className="border-red-500 text-red-500 hover:bg-red-50"
                >
                  Reject
                </Button>
                <Button 
                  onClick={() => onApprove(submission.id)}
                  className="bg-green-500 text-white hover:bg-green-600"
                >
                  Approve
                </Button>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="prose max-w-none">
            <p>{submission.content}</p>
          </div>
        </CardContent>
      </Card>

      <FeedbackSection 
        submissionId={submission.id}
        feedback={feedback}
      />
    </div>
  )
} 