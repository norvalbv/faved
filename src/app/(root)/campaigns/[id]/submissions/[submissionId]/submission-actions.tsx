import { ReactElement } from 'react'
import { Button } from '@/src/components/ui/button'
import { Textarea } from '@/src/components/ui/textarea'
import { Send, XCircle, CheckCircle2 } from 'lucide-react'

interface SubmissionActionsProps {
  submissionId: string
  isPending: boolean
  isSubmitting: boolean
  feedback: string
  onApprove: (id: string) => Promise<void>
  onRequestChanges: (id: string) => Promise<void>
  onAddFeedback: (id: string) => Promise<void>
  onReject: (id: string) => Promise<void>
}

export const SubmissionActions = ({
  submissionId,
  isPending,
  isSubmitting,
  feedback,
  onApprove,
  onRequestChanges,
  onAddFeedback,
  onReject
}: SubmissionActionsProps): ReactElement => {
  return (
    <div className="mt-4 space-y-4">
      <div className="flex items-end gap-3">
        <div className="flex-1">
          <Textarea 
            value={feedback}
            placeholder={!isPending ? "Add feedback to reopen..." : "Add your feedback..."}
            className="min-h-[2.5rem] resize-none border-muted-foreground/20 bg-muted/50"
            rows={3}
          />
        </div>
        <Button 
          type="button" 
          size="sm" 
          className="h-10 gap-1.5"
          disabled={!feedback.trim() || isSubmitting}
          onClick={() => onAddFeedback(submissionId)}
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
            onClick={() => onRequestChanges(submissionId)}
          >
            Request Changes
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            className="text-red-600 hover:text-red-600 hover:bg-red-100"
            disabled={!feedback.trim() || isSubmitting}
            onClick={() => onReject(submissionId)}
          >
            <XCircle className="mr-2 h-4 w-4" />
            Reject
          </Button>
          <Button 
            variant="primary" 
            size="sm" 
            className="bg-green-600 hover:bg-green-700"
            disabled={!feedback.trim() || isSubmitting}
            onClick={() => onApprove(submissionId)}
          >
            <CheckCircle2 className="mr-2 h-4 w-4" />
            Approve
          </Button>
        </div>
      ) : (
        <Button 
          variant="outline" 
          size="sm"
          disabled={!feedback.trim() || isSubmitting}
          onClick={() => onRequestChanges(submissionId)}
        >
          Reopen with Changes
        </Button>
      )}
    </div>
  )
} 