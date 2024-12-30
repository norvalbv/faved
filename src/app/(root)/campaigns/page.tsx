import { ReactElement } from 'react'
import Link from 'next/link'
import { CampaignRepository } from '@/lib/data-store/repositories/campaign'
import { SubmissionRepository } from '@/lib/data-store/repositories/submission'
import { Button } from '@/src/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/src/components/ui/card'
import { Badge } from '@/src/components/ui/badge'
import { FileText } from 'lucide-react'
import type { SubmissionMetadata } from '@/lib/types/submission'

export default async function CampaignsPage(): Promise<ReactElement> {
  // Get all campaigns and submissions
  const [campaigns, submissions] = await Promise.all([
    CampaignRepository.list(),
    SubmissionRepository.list()
  ])

  // Group submissions by campaign
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
      <div className="mb-8">
        <h1 className="mb-2 text-2xl font-semibold tracking-tight">Campaigns</h1>
        <p className="text-muted-foreground">
          View and manage your content campaigns
        </p>
      </div>

      <div className="grid gap-4">
        {campaigns.map(campaign => {
          const campaignSubmissions = submissionsByCampaign[campaign.id] || []
          const pendingCount = campaignSubmissions.filter(s => 
            !(s.metadata as SubmissionMetadata)?.approved
          ).length
          const approvedCount = campaignSubmissions.filter(s => 
            (s.metadata as SubmissionMetadata)?.approved
          ).length

          return (
            <Link key={campaign.id} href={`/campaigns/${campaign.id}`}>
              <Card className="transition-colors hover:bg-muted/50">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>{campaign.title}</CardTitle>
                    <Badge variant={campaign.status === 'active' ? 'success' : 'secondary'}>
                      {campaign.status}
                    </Badge>
                  </div>
                  <CardDescription>{campaign.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1.5">
                      <FileText className="h-4 w-4" />
                      <span>{campaignSubmissions.length} submissions</span>
                    </div>
                    {campaignSubmissions.length > 0 && (
                      <>
                        <span>•</span>
                        <span>{approvedCount} approved</span>
                        <span>•</span>
                        <span>{pendingCount} pending</span>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>
            </Link>
          )
        })}
      </div>

      {campaigns.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-8 text-center">
            <h3 className="mb-2 text-lg font-medium">No campaigns yet</h3>
            <p className="mb-4 text-sm text-muted-foreground">
              Get started by creating your first campaign
            </p>
            <Button asChild>
              <Link href="/campaigns/new">Create Campaign</Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
} 