import type { Submission } from '@/src/types/submission'
import { formatDistanceToNow } from 'date-fns'
import Link from 'next/link'

interface SubmissionsSectionProps {
  submissions: Submission[]
}

export const SubmissionsSection = ({ submissions }: SubmissionsSectionProps) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold tracking-tight">Recent Submissions</h2>
        <Link href="/submissions" className="text-sm text-muted-foreground hover:text-primary">
          View all
        </Link>
      </div>

      <div className="space-y-4">
        {submissions.map((submission) => (
          <Link
            key={submission.id}
            href={`/briefs/${submission.briefId}/submissions/${submission.id}`}
            className="block"
          >
            <div className="rounded-lg border bg-card p-4 hover:bg-accent/50">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-sm font-medium">{submission.type}</span>
                <span className="text-xs text-muted-foreground">
                  {formatDistanceToNow(submission.createdAt, { addSuffix: true })}
                </span>
              </div>
              <p className="text-sm text-muted-foreground line-clamp-2">{submission.content}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
} 