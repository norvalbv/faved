'use client'

import { ReactElement, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/src/components/ui/card'
import { Badge } from '@/src/components/ui/badge'
import { Button } from '@/src/components/ui/button'
import { Textarea } from '@/src/components/ui/textarea'
import { formatDistanceToNow } from 'date-fns'
import { FileText, MessageCircle, Send, XCircle } from 'lucide-react'
import type { Submission, SubmissionMetadata } from '@/lib/types/submission'
import { Separator } from '../ui/separator'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select"

interface Props {
  submissions: Submission[]
  onApprove: (id: string, feedback: string) => Promise<void>
  onRequestChanges: (id: string, feedback: string) => Promise<void>
  onAddFeedback: (id: string, feedback: string) => Promise<void>
  onReject: (id: string, feedback: string) => Promise<void>
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

  return (
    <div className="grid gap-4">
      {submissions.map(submission => {
        const metadata = submission.metadata as SubmissionMetadata
        const isApproved = metadata?.status === 'approved'
        const isRejected = metadata?.status === 'rejected'
        const hasFeedback = metadata?.feedbackHistory?.length > 0
        const isPending = !isApproved && !isRejected
        const canReopen = isApproved || isRejected

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
              <CardDescription className="line-clamp-2">
                {metadata?.message || submission.content}
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
                  {formatDistanceToNow(new Date(submission.createdAt), { addSuffix: true })}
                </time>
              </div>

              {hasFeedback && (
                <div className="mt-4 space-y-4">
                  {metadata.feedbackHistory.map((item, index) => (
                    <div key={index} className="rounded-lg bg-muted p-4">
                      <div className="mb-2 flex items-center justify-between">
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
                        <time className="text-xs text-muted-foreground">
                          {formatDistanceToNow(new Date(item.createdAt), { addSuffix: true })}
                        </time>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {item.feedback}
                      </p>
                    </div>
                  ))}
                </div>
              )}

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