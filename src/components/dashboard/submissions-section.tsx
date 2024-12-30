import type { Submission } from "@/types/submission"
import { formatDistanceToNow } from "date-fns"
import Link from "next/link"
import { cn } from "@/lib/utils"

interface SubmissionsSectionProps {
  submissions: Submission[]
}

export const SubmissionsSection = ({ submissions }: SubmissionsSectionProps): React.ReactElement => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold tracking-tight">Recent Submissions</h2>
        <Link
          href="/submissions"
          className="text-sm text-primary hover:underline"
        >
          View all
        </Link>
      </div>
      <div className="divide-y rounded-lg border bg-card">
        {submissions.length === 0 ? (
          <div className="p-4 text-center text-sm text-muted-foreground">
            No submissions yet
          </div>
        ) : (
          submissions.map((submission) => (
            <div
              key={submission.id}
              className="flex items-center justify-between p-4"
            >
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
                <p className="text-sm text-muted-foreground">
                  Submitted {formatDistanceToNow(submission.createdAt, { addSuffix: true })}
                </p>
              </div>
              <Link
                href={`/submissions/${submission.id}`}
                className="text-sm text-primary hover:underline"
              >
                View details
              </Link>
            </div>
          ))
        )}
      </div>
    </div>
  )
} 