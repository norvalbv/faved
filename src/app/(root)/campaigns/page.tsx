import { ReactElement } from 'react'
import Link from 'next/link'
import { formatDistanceToNow } from 'date-fns'
import { Button } from '@/src/components/ui/button'
import { FileText, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { CampaignRepository } from '@/lib/data-store/repositories/campaign'
import { SubmissionRepository } from '@/lib/data-store/repositories/submission'
import type { SubmissionMetadata } from '@/lib/types/submission'

export default async function CampaignsPage(): Promise<ReactElement> {
  // Get all campaigns and submissions
  const campaigns = await CampaignRepository.list()
  const submissions = await SubmissionRepository.list()

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
          <h1 className="mb-2 text-2xl font-semibold tracking-tight">Campaigns</h1>
          <p className="text-muted-foreground">
            View and manage your content creation campaigns
          </p>
        </div>
        <Button>Create New Campaign</Button>
      </div>

      <div className="space-y-4">
        {campaigns.map((campaign) => {
          const campaignSubmissions = submissionsByCampaign[campaign.id] || []
          const latestSubmission = campaignSubmissions[campaignSubmissions.length - 1]
          const pendingCount = campaignSubmissions.filter(s => !(s.metadata as SubmissionMetadata)?.approved).length
          
          return (
            <div key={campaign.id} className="overflow-hidden rounded-xl border bg-card shadow-sm">
              <div className="bg-muted/50 px-6 py-4">
                <Link 
                  href={`/campaigns/${campaign.id}`}
                  className="group flex items-center justify-between hover:opacity-70"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-3">
                      <span className={cn(
                        'rounded-full px-3 py-1 text-sm font-medium',
                        campaign.status === 'active' && 'bg-green-500/10 text-green-600',
                        campaign.status === 'completed' && 'bg-blue-500/10 text-blue-600',
                        campaign.status === 'draft' && 'bg-yellow-500/10 text-yellow-600'
                      )}>
                        {campaign.status}
                      </span>
                      <h2 className="font-medium">{campaign.title}</h2>
                    </div>
                    <p className="text-sm text-muted-foreground">{campaign.description}</p>
                  </div>
                  <ChevronRight className="h-5 w-5 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
                </Link>
              </div>

              <div className="divide-y">
                <div className="px-6 py-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <span className="text-sm text-muted-foreground">
                        {campaignSubmissions.length} submissions
                      </span>
                      {pendingCount > 0 && (
                        <span className="rounded-full bg-yellow-500/10 px-2 py-0.5 text-xs font-medium text-yellow-600">
                          {pendingCount} pending
                        </span>
                      )}
                    </div>
                    {latestSubmission && (
                      <span className="text-sm text-muted-foreground">
                        Last update {formatDistanceToNow(new Date(latestSubmission.updatedAt), { addSuffix: true })}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )
        })}

        {campaigns.length === 0 && (
          <div className="rounded-xl border bg-card p-8 text-center shadow-sm">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
              <FileText className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="mb-1 text-lg font-semibold">No campaigns yet</h3>
            <p className="mb-4 text-sm text-muted-foreground">
              Create your first campaign to start managing content submissions.
            </p>
            <Button>Create Campaign</Button>
          </div>
        )}
      </div>
    </div>
  )
} 