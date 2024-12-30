import { ReactElement } from 'react'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { CampaignRepository } from '@/lib/data-store/repositories/campaign'
import { SubmissionRepository } from '@/lib/data-store/repositories/submission'
import { Button } from '@/src/components/ui/button'
import { ChevronLeft } from 'lucide-react'
import { SubmissionThread } from '@/src/components/submissions/SubmissionThread'
import type { SubmissionMetadata } from '@/lib/types/submission'

interface Props {
  params: {
    id: string
    submissionId: string
  }
}

export default async function SubmissionPage({ params }: Props): Promise<ReactElement> {
  // Get campaign and submission
  const [campaign, submission] = await Promise.all([
    CampaignRepository.getById(params.id),
    SubmissionRepository.getById(params.submissionId)
  ])

  if (!campaign || !submission) {
    notFound()
  }

  // Verify submission belongs to campaign
  const metadata = submission.metadata as SubmissionMetadata
  if (metadata?.campaignId !== params.id && submission.campaignId !== params.id) {
    notFound()
  }

  return (
    <div className="container max-w-4xl py-8">
      <div className="mb-8">
        <Link href={`/campaigns/${params.id}/submissions`}>
          <Button
            variant="ghost"
            size="sm"
            className="mb-4"
          >
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back to submissions
          </Button>
        </Link>

        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight">{campaign.title}</h1>
          <p className="text-muted-foreground">
            Submission from {metadata?.sender || 'Anonymous'}
          </p>
        </div>
      </div>

      <SubmissionThread submissions={[submission]} />
    </div>
  )
} 