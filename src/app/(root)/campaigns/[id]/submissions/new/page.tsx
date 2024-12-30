import { ReactElement } from 'react'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { CampaignRepository } from '@/lib/data-store/repositories/campaign'
import { Button } from '@/src/components/ui/button'
import { ChevronLeft } from 'lucide-react'
import { CampaignSubmissionForm } from '@/src/components/submissions/CampaignSubmissionForm'

interface Props {
  params: {
    id: string
  }
}

export default async function NewSubmissionPage({ params }: Props): Promise<ReactElement> {
  const campaign = await CampaignRepository.getById(params.id)

  if (!campaign) {
    notFound()
  }

  return (
    <div className="container max-w-2xl py-8">
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
            Create a new submission
          </p>
        </div>
      </div>

      <div className="rounded-lg border bg-card p-6">
        <CampaignSubmissionForm campaignId={params.id} />
      </div>
    </div>
  )
} 