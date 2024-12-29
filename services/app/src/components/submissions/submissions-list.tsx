import Link from "next/link"
import { formatDistanceToNow } from "date-fns"
import { cn } from "@/lib/utils"
import type { Submission } from "@/types/submission"

interface SubmissionsListProps {
  items: Submission[]
}

export const SubmissionsList = ({ items }: SubmissionsListProps): React.ReactElement => {
  if (items.length === 0) {
    return (
      <div className="rounded-lg border bg-card p-6 text-center">
        <h3 className="text-lg font-medium">No submissions yet</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Get started by submitting content for a brief.
        </p>
      </div>
    )
  }

  return (
    <div className="divide-y rounded-lg border bg-card">
      {items.map((submission) => (
        <Link
          key={submission.id}
          href={`/submissions/${submission.id}`}
          className="block p-6 transition-colors hover:bg-muted/50"
        >
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-medium">
                  {submission.type.split("_").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ")}
                </span>
                <span className={cn(
                  "inline-flex items-center rounded-full px-2 py-1 text-xs font-medium",
                  {
                    "bg-yellow-100 text-yellow-800": submission.status === "pending",
                    "bg-green-100 text-green-800": submission.status === "approved",
                    "bg-red-100 text-red-800": submission.status === "rejected",
                  }
                )}>
                  {submission.status.charAt(0).toUpperCase() + submission.status.slice(1)}
                </span>
              </div>
              <p className="text-sm text-muted-foreground line-clamp-2">
                {submission.content}
              </p>
            </div>
            <span className="text-sm text-muted-foreground">
              {formatDistanceToNow(submission.createdAt, { addSuffix: true })}
            </span>
          </div>
        </Link>
      ))}
    </div>
  )
} 