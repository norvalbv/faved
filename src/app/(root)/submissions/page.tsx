import { ReactElement } from 'react'
import Link from 'next/link'
import { formatDistanceToNow, format } from 'date-fns'
import { Button } from '@/src/components/ui/button'
import { Textarea } from '@/src/components/ui/textarea'
import { FileText, MessageCircle, Send, ChevronRight, Calendar, CheckCircle2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { SubmissionRepository } from '@/lib/data-store/repositories/submission'
import { CampaignRepository } from '@/lib/data-store/repositories/campaign'
import type { SubmissionMetadata } from '@/lib/types/submission'
import type { Campaign } from '@/lib/types/campaign'

const STAGES = [
  { id: 'draft_script', label: 'Draft Script' },
  { id: 'draft_video', label: 'Draft Video' },
  { id: 'final_video', label: 'Final Video' }
]

export default async function SubmissionsPage(): Promise<ReactElement> {
  // Get all submissions and campaigns
  const submissions = await SubmissionRepository.list()
  const campaigns = await CampaignRepository.list()

  // Group submissions by campaignId
  const submissionsByCampaign = submissions.reduce((acc, submission) => {
    const metadata = submission.metadata as SubmissionMetadata
    const campaignId = metadata?.campaignId
    if (!campaignId) return acc
    
    if (!acc[campaignId]) {
      acc[campaignId] = []
    }
    acc[campaignId].push(submission)
    return acc
  }, {} as Record<string, typeof submissions>)

  return (
    <div className="container max-w-4xl py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="mb-2 text-2xl font-semibold tracking-tight">Submission Threads</h1>
          <p className="text-muted-foreground">
            Track your content submissions and their progress for each campaign
          </p>
        </div>
        <Link href="/campaigns">
          <Button>Create New Submission</Button>
        </Link>
      </div>

      <div className="space-y-8">
        {campaigns.map((campaign) => {
          const campaignSubmissions = submissionsByCampaign[campaign.id] || []
          if (campaignSubmissions.length === 0) return null

          // Get latest submission stage
          const latestSubmission = campaignSubmissions[campaignSubmissions.length - 1]
          const metadata = latestSubmission?.metadata as SubmissionMetadata
          const currentStageId = metadata?.stageId || 'draft_script'
          const currentStageIndex = STAGES.findIndex(s => s.id === currentStageId)

          return (
            <div key={campaign.id} className="overflow-hidden rounded-xl border bg-card shadow-sm">
              {/* Campaign Header */}
              <div className="border-b bg-muted/50 px-6 py-4">
                <div className="mb-4">
                  <Link 
                    href={`/campaigns/${campaign.id}`}
                    className="group flex items-center justify-between hover:opacity-70"
                  >
                    <div className="flex items-center gap-3">
                      <span className="rounded-full bg-orange-500/10 px-3 py-1 text-sm font-medium text-orange-600">
                        {campaign.status}
                      </span>
                      <h2 className="font-medium">{campaign.title}</h2>
                    </div>
                    <ChevronRight className="h-5 w-5 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
                  </Link>
                </div>

                {/* Progress Indicator */}
                <div className="flex items-center gap-2">
                  {STAGES.map((stage, index) => (
                    <div key={stage.id} className="flex items-center">
                      <div className={cn(
                        'flex h-8 items-center gap-2 rounded-full px-3',
                        index <= currentStageIndex ? 'bg-orange-500/10' : 'bg-muted'
                      )}>
                        <span className={cn(
                          'text-sm font-medium',
                          index <= currentStageIndex ? 'text-orange-600' : 'text-muted-foreground'
                        )}>
                          {stage.label}
                        </span>
                        {index <= currentStageIndex && (
                          <CheckCircle2 className="h-4 w-4 text-orange-600" />
                        )}
                      </div>
                      {index < STAGES.length - 1 && (
                        <div className={cn(
                          'h-px w-8',
                          index < currentStageIndex ? 'bg-orange-600' : 'bg-muted-foreground/20'
                        )} />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Submission Thread */}
              <div className="divide-y">
                {campaignSubmissions
                  .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
                  .map((submission) => {
                    const metadata = submission.metadata as SubmissionMetadata
                    const publishDate = metadata?.dateInput ? new Date(metadata.dateInput) : null
                    
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
                                metadata?.approved ? 'bg-green-500/10 text-green-600' : 'bg-yellow-500/10 text-yellow-600'
                              )}>
                                {metadata?.approved ? 'Approved' : 'Pending'}
                              </span>
                            </div>

                            {/* Content */}
                            <div className="rounded-lg bg-muted/50 p-4">
                              <p className="whitespace-pre-wrap text-sm">
                                {metadata?.message || metadata?.input || submission.content}
                              </p>
                            </div>

                            {/* Publish Date */}
                            {publishDate && !isNaN(publishDate.getTime()) && (
                              <div className="mt-3 flex items-center gap-2">
                                <Button variant="outline" size="sm" className="h-7 gap-1.5">
                                  <Calendar className="h-3.5 w-3.5 text-orange-600" />
                                  <time dateTime={publishDate.toISOString()} className="text-xs">
                                    Publishing on {format(publishDate, "MMM d 'at' h:mm a")}
                                  </time>
                                </Button>
                              </div>
                            )}

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
                                  <div className="space-y-3">
                                    <div className="rounded-lg bg-muted/50 p-4">
                                      <p className="whitespace-pre-wrap text-sm">
                                        {metadata.feedback}
                                      </p>
                                    </div>
                                    {metadata.approved && (
                                      <div className="rounded-lg border border-orange-500/20 bg-orange-500/5 p-4">
                                        <h4 className="mb-2 text-sm font-medium text-orange-600">CTA Reminders</h4>
                                        <ul className="space-y-2 text-sm text-muted-foreground">
                                          <li>• Top line of description: Sign up to Milanote for free with no time limit: https://milanote.com/{metadata.sender}</li>
                                          <li>• Pinned comment: Thanks to Milanote for sponsoring this video! Sign up for free and start your next creative project: https://milanote.com/{metadata.sender}</li>
                                        </ul>
                                      </div>
                                    )}
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

        {Object.keys(submissionsByCampaign).length === 0 && (
          <div className="rounded-xl border bg-card p-8 text-center shadow-sm">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
              <FileText className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="mb-1 text-lg font-semibold">No submissions yet</h3>
            <p className="mb-4 text-sm text-muted-foreground">
              Start by selecting a campaign and submitting your content for review.
            </p>
            <Link href="/campaigns">
              <Button>Browse Campaigns</Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  )
} 