import { ReactElement } from 'react'
import Link from 'next/link'
import { formatDistanceToNow } from 'date-fns'
import { Button } from '@/src/components/ui/button'
import { Textarea } from '@/src/components/ui/textarea'
import { FileText, MessageCircle, Send, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { SubmissionRepository } from '@/lib/data-store/repositories/submission'
import { BriefRepository } from '@/lib/data-store/repositories/brief'
import type { SubmissionMetadata } from '@/lib/types/submission'
import type { Brief } from '@/lib/types/brief'

export default async function SubmissionsPage(): Promise<ReactElement> {
  // Get all submissions and briefs
  const submissions = await SubmissionRepository.list()
  const briefs = await BriefRepository.list()

  // Group submissions by briefId
  const submissionsByBrief = submissions.reduce((acc, submission) => {
    const briefId = submission.briefId
    if (!acc[briefId]) {
      acc[briefId] = []
    }
    acc[briefId].push(submission)
    return acc
  }, {} as Record<string, typeof submissions>)

  return (
    <div className="container max-w-4xl py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="mb-2 text-2xl font-semibold tracking-tight">Submission Threads</h1>
          <p className="text-muted-foreground">
            Track your content submissions and their progress for each brief
          </p>
        </div>
        <Link href="/briefs">
          <Button>Create New Submission</Button>
        </Link>
      </div>

      <div className="space-y-8">
        {briefs.map((brief) => {
          const briefSubmissions = submissionsByBrief[brief.id] || []
          if (briefSubmissions.length === 0) return null

          return (
            <div key={brief.id} className="overflow-hidden rounded-xl border bg-card shadow-sm">
              {/* Brief Header */}
              <div className="border-b bg-muted/50 px-6 py-4">
                <Link 
                  href={`/briefs/${brief.id}`}
                  className="group flex items-center justify-between hover:opacity-70"
                >
                  <div className="flex items-center gap-3">
                    <span className="rounded-full bg-orange-500/10 px-3 py-1 text-sm font-medium text-orange-600">
                      {brief.type.replace('_', ' ')}
                    </span>
                    <h2 className="font-medium">{brief.title}</h2>
                  </div>
                  <ChevronRight className="h-5 w-5 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
                </Link>
              </div>

              {/* Submission Thread */}
              <div className="divide-y">
                {briefSubmissions
                  .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
                  .map((submission) => {
                    const metadata = submission.metadata as SubmissionMetadata | undefined
                    
                    return (
                      <div key={submission.id} className="px-6 py-5">
                        <div className="flex items-start gap-4">
                          <div className="h-10 w-10 rounded-full bg-orange-500/10 p-2.5">
                            <FileText className="h-5 w-5 text-orange-600" />
                          </div>
                          <div className="flex-1">
                            <div className="mb-2 flex items-center gap-2">
                              <span className="font-medium">{metadata?.sender || 'Anonymous'}</span>
                              <span className="text-sm text-muted-foreground">submitted content</span>
                              <span className="text-sm text-muted-foreground">•</span>
                              <span className="text-sm text-muted-foreground">
                                {formatDistanceToNow(new Date(submission.createdAt), { addSuffix: true })}
                              </span>
                              <span className={cn(
                                'ml-2 rounded-full px-2 py-0.5 text-xs font-medium',
                                submission.status === 'approved' && 'bg-green-500/10 text-green-600',
                                submission.status === 'pending' && 'bg-yellow-500/10 text-yellow-600',
                                submission.status === 'rejected' && 'bg-red-500/10 text-red-600'
                              )}>
                                {submission.status}
                              </span>
                            </div>
                            <div className="rounded-lg bg-muted/50 p-4">
                              <p className="whitespace-pre-wrap text-sm">
                                {submission.content}
                              </p>
                            </div>

                            {/* Feedback */}
                            {metadata?.feedback && (
                              <div className="mt-4 flex items-start gap-4">
                                <div className="h-8 w-8 rounded-full bg-green-500/10 p-2">
                                  <MessageCircle className="h-4 w-4 text-green-600" />
                                </div>
                                <div className="flex-1">
                                  <div className="mb-2 flex items-center gap-2">
                                    <span className="text-sm font-medium">Reviewer</span>
                                    <span className="text-xs text-muted-foreground">provided feedback</span>
                                  </div>
                                  <div className="rounded-lg bg-muted/50 p-4">
                                    <p className="whitespace-pre-wrap text-sm">
                                      {metadata.feedback}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )
                  })}

                {/* Add Comment Section */}
                <div className="bg-muted/30 px-6 py-4">
                  <form className="flex items-end gap-3">
                    <div className="flex-1">
                      <Textarea 
                        placeholder="Add a comment..."
                        className="min-h-[2.5rem] resize-none border-muted-foreground/20 bg-background/50 focus-visible:ring-orange-500/30"
                        rows={1}
                      />
                    </div>
                    <Button type="submit" size="sm" variant="outline" className="h-8 gap-1.5">
                      <Send className="h-4 w-4" />
                      Send
                    </Button>
                  </form>
                </div>
              </div>
            </div>
          )
        })}

        {Object.keys(submissionsByBrief).length === 0 && (
          <div className="rounded-xl border bg-card p-8 text-center shadow-sm">
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
        )}
      </div>
    </div>
  )
} 