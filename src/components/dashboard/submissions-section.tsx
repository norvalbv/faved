import type { Submission } from '@/lib/types/submission'
import { formatDistanceToNow } from 'date-fns'
import Link from 'next/link'
import { Button } from '@/src/components/ui/button'
import { FileText } from 'lucide-react'

interface SubmissionsSectionProps {
  submissions: Submission[]
}

export const SubmissionsSection = ({ submissions }: SubmissionsSectionProps) => {
  const hasSubmissions = submissions.length > 0

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold tracking-tight">Recent Submissions</h2>
        {hasSubmissions && (
          <Link href="/submissions" className="text-sm text-muted-foreground hover:text-primary">
            View all
          </Link>
        )}
      </div>

      {!hasSubmissions ? (
        <div className="rounded-lg border bg-card p-8 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
            <FileText className="h-6 w-6 text-muted-foreground" />
          </div>
          <h3 className="mb-1 text-lg font-semibold">No submissions yet</h3>
          <p className="mb-4 text-sm text-muted-foreground">
            Start by selecting a brief and submitting your content for review.
          </p>
          <Link href="/briefs">
            <Button>Browse Briefs</Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {submissions.map((submission) => (
            <Link
              key={submission.id}
              href={`/projects/${submission.briefId}/submissions/${submission.id}`}
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
      )}
    </div>
  )
} 