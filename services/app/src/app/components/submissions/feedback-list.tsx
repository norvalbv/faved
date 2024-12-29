import { formatDistanceToNow } from "date-fns"
import type { SubmissionFeedback } from "@/app/types/submission"
import { cn } from "@/lib/utils"

interface FeedbackListProps {
  items: SubmissionFeedback[]
}

const getFeedbackTypeStyles = (type: SubmissionFeedback["type"]) => {
  switch (type) {
    case "correction":
      return "bg-red-100 text-red-800"
    case "suggestion":
      return "bg-blue-100 text-blue-800"
    case "approval":
      return "bg-green-100 text-green-800"
  }
}

export const FeedbackList = ({ items }: FeedbackListProps): React.ReactElement => {
  if (items.length === 0) {
    return (
      <div className="rounded-lg border bg-card p-6 text-center text-sm text-muted-foreground">
        No feedback yet. Your submission is being reviewed.
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {items.map((feedback) => (
        <div key={feedback.id} className="rounded-lg border bg-card p-4">
          <div className="mb-2 flex items-center justify-between">
            <span className={cn(
              "inline-flex items-center rounded-full px-2 py-1 text-xs font-medium",
              getFeedbackTypeStyles(feedback.type)
            )}>
              {feedback.type.charAt(0).toUpperCase() + feedback.type.slice(1)}
            </span>
            <span className="text-xs text-muted-foreground">
              {formatDistanceToNow(feedback.createdAt, { addSuffix: true })}
            </span>
          </div>
          <p className="whitespace-pre-wrap text-sm">{feedback.content}</p>
        </div>
      ))}
    </div>
  )
} 