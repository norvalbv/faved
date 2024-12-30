'use client'

import { ReactElement, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/src/components/ui/card'
import { Badge } from '@/src/components/ui/badge'
import { Button } from '@/src/components/ui/button'
import { Textarea } from '@/src/components/ui/textarea'
import { formatDistanceToNow } from 'date-fns'
import { FileText, MessageCircle, Send, XCircle, Bot, CheckCircle, AlertTriangle } from 'lucide-react'
import type { Submission, SubmissionMetadata } from '@/lib/types/submission'
import { cn } from '@/lib/utils'

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
                  {formatDistanceToNow(new Date(submission.createdAt), { addSuffix: true })}
                </time>
              </div>

              {metadata?.feedbackHistory?.map((item, index) => (
                item.isAiFeedback ? (
                  <div key={index} className="mb-4">
                    <div className="bg-gray-50 rounded-lg p-6 space-y-4 shadow-sm border border-gray-100">
                      <div className="flex items-center gap-2 mb-2">
                        <Bot className="w-5 h-5 text-blue-600" />
                        <span className="font-semibold text-blue-600">AI Analysis</span>
                        {item.status === 'rejected' && (
                          <Badge variant="destructive" className="ml-2">
                            Rejected
                          </Badge>
                        )}
                        <time className="text-xs text-muted-foreground ml-auto">
                          {formatDistanceToNow(new Date(item.createdAt), { addSuffix: true })}
                        </time>
                      </div>
                      <div className="prose prose-sm max-w-none space-y-4">
                        {item.feedback.split('\n\n').map((section, idx) => {
                          if (!section.trim()) return null
                          const [title, ...content] = section.split('\n')
                          return (
                            <div key={idx} className="space-y-2">
                              <h4 className="font-medium text-gray-900">{title}</h4>
                              {content.map((line, lineIdx) => (
                                <p key={lineIdx} className="text-gray-700">{line}</p>
                              ))}
                            </div>
                          )
                        })}
                      </div>
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
                        {formatDistanceToNow(new Date(item.createdAt), { addSuffix: true })}
                      </time>
                    </div>
                    <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                      {item.feedback}
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