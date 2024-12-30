import { ReactElement } from 'react'
import Link from 'next/link'
import { FileText } from 'lucide-react'
import { Button } from '@/src/components/ui/button'
import { SubmissionRepository } from '@/lib/data-store/repositories/submission'
import { CampaignRepository } from '@/lib/data-store/repositories/campaign'
import { CampaignHeader } from '@/src/components/submissions/CampaignHeader'
import { SubmissionThread } from '@/src/components/submissions/SubmissionThread'
import type { SubmissionMetadata } from '@/lib/types/submission'
import type { Campaign } from '@/lib/types/campaign'

export default async function SubmissionsPage(): Promise<ReactElement> {
  // Get all submissions and campaigns
  const submissions = await SubmissionRepository.list()
  const campaigns = await CampaignRepository.list()

  // Group submissions by campaignId
  const submissionsByCampaign = submissions.reduce((acc, submission) => {
    const metadata = submission.metadata as SubmissionMetadata
    const campaignId = metadata?.campaignId || submission.campaignId
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
        {campaigns.map((campaign: Campaign) => {
          const campaignSubmissions = submissionsByCampaign[campaign.id] || []
          if (campaignSubmissions.length === 0) return null

          // Get latest submission stage
          const latestSubmission = campaignSubmissions[campaignSubmissions.length - 1]
          const metadata = latestSubmission?.metadata as SubmissionMetadata
          const currentStageId = metadata?.stageId || 'draft_script'

          return (
            <div key={campaign.id} className="overflow-hidden rounded-xl border bg-card shadow-sm">
              <CampaignHeader 
                campaign={campaign} 
                currentStageId={currentStageId}
              />
              <SubmissionThread submissions={campaignSubmissions} />
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