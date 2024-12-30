import { ReactElement } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/src/components/ui/card'
import { Badge } from '@/src/components/ui/badge'
import { Button } from '@/src/components/ui/button'
import { Textarea } from '@/src/components/ui/textarea'
import { formatDistanceToNow } from 'date-fns'
import { FileText, MessageCircle, Send } from 'lucide-react'
import type { Submission } from '@/lib/types/submission'
import type { SubmissionMetadata } from '@/lib/types/submission'

interface Props {
  submissions: Submission[]
}

export const SubmissionThread = ({ submissions }: Props): ReactElement => {
  return (
    <div className="grid gap-4">
      {submissions.map(submission => {
        const metadata = submission.metadata as SubmissionMetadata
        const isApproved = metadata?.approved
        const hasFeedback = !!metadata?.feedback
        const isPending = !isApproved && !hasFeedback

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
                <Badge variant={isApproved ? 'success' : hasFeedback ? 'warning' : 'secondary'}>
                  {isApproved ? 'Approved' : hasFeedback ? 'Reviewed' : 'Pending'}
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
                      <span>Has feedback</span>
                    </div>
                  </>
                )}
                <span>•</span>
                <time>
                  {formatDistanceToNow(new Date(submission.createdAt), { addSuffix: true })}
                </time>
              </div>

              {hasFeedback && (
                <div className="mt-4 rounded-lg bg-muted p-4">
                  <p className="text-sm text-muted-foreground">
                    {metadata.feedback}
                  </p>
                </div>
              )}

              {isPending && (
                <div className="mt-4 space-y-4">
                  <div className="flex items-end gap-3">
                    <div className="flex-1">
                      <Textarea 
                        placeholder="Add your feedback..."
                        className="min-h-[2.5rem] resize-none border-muted-foreground/20 bg-muted/50"
                        rows={3}
                      />
                    </div>
                    <Button type="submit" size="sm" className="h-10 gap-1.5">
                      <Send className="h-4 w-4" />
                      Send
                    </Button>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
                      Request Changes
                    </Button>
                    <Button variant="primary" size="sm" className="bg-green-600 hover:bg-green-700">
                      Approve
                    </Button>
                  </div>
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