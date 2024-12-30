import { ReactElement } from 'react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { CampaignRepository } from '@/lib/data-store/repositories/campaign'
import { SubmissionRepository } from '@/lib/data-store/repositories/submission'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/src/components/ui/card'
import { Badge } from '@/src/components/ui/badge'
import { Button } from '@/src/components/ui/button'
import { formatDistanceToNow } from 'date-fns'
import { FileText, MessageCircle } from 'lucide-react'
import type { SubmissionMetadata } from '@/lib/types/submission'

interface Props {
  params: {
    id: string
  }
}

export default async function CampaignSubmissionsPage({ params }: Props): Promise<ReactElement> {
  // Get campaign and its submissions
  const [campaign, submissions] = await Promise.all([
    CampaignRepository.getById(params.id),
    SubmissionRepository.list()
  ])

  if (!campaign) {
    notFound()
  }

  // Filter submissions for this campaign
  const campaignSubmissions = submissions.filter(submission => {
    const metadata = submission.metadata as SubmissionMetadata
    return metadata?.campaignId === params.id || submission.campaignId === params.id
  })

  return (
    <div className="container max-w-4xl py-8">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="mb-2 text-2xl font-semibold tracking-tight">{campaign.title}</h1>
            <p className="text-muted-foreground">{campaign.description}</p>
          </div>
          <Badge variant={campaign.status === 'active' ? 'success' : 'secondary'}>
            {campaign.status}
          </Badge>
        </div>
      </div>

      <div className="grid gap-4">
        {campaignSubmissions.map(submission => {
          const metadata = submission.metadata as SubmissionMetadata
          const isApproved = metadata?.approved
          const hasFeedback = !!metadata?.feedback

          return (
            <Link key={submission.id} href={`/campaigns/${params.id}/submissions/${submission.id}`}>
              <Card className="transition-colors hover:bg-muted/50">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CardTitle className="text-base">
                        {metadata?.sender || 'Anonymous'}
                      </CardTitle>
                      <Badge variant="outline" className="text-xs">
                        {metadata?.type || submission.type || 'content'}
                      </Badge>
                    </div>
                    <Badge variant={isApproved ? 'success' : hasFeedback ? 'warning' : 'secondary'}>
                      {isApproved ? 'Approved' : hasFeedback ? 'Reviewed' : 'Pending'}
                    </Badge>
                  </div>
                  <CardDescription className="line-clamp-2">
                    {metadata?.message || submission.content}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1.5">
                      <FileText className="h-4 w-4" />
                      <span>Stage {metadata?.stageId || '1'}</span>
                    </div>
                    {hasFeedback && (
                      <>
                        <span>•</span>
                        <div className="flex items-center gap-1.5">
                          <MessageCircle className="h-4 w-4" />
                          <span>Has feedback</span>
                        </div>
                      </>
                    )}
                    <span>•</span>
                    <time>
                      {formatDistanceToNow(new Date(submission.createdAt), { addSuffix: true })}
                    </time>
                  </div>
                </CardContent>
              </Card>
            </Link>
          )
        })}
      </div>

      {campaignSubmissions.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-8 text-center">
            <h3 className="mb-2 text-lg font-medium">No submissions yet</h3>
            <p className="mb-4 text-sm text-muted-foreground">
              There are no submissions for this campaign yet
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
} 