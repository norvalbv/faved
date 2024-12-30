import { ReactElement } from 'react'
import Link from 'next/link'
import { CampaignRepository } from '@/lib/data-store/repositories/campaign'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/src/components/ui/card'
import { Badge } from '@/src/components/ui/badge'
import { CampaignFilters } from '@/src/components/campaigns/CampaignFilters'
import { formatDistanceToNow } from 'date-fns'

interface Props {
  searchParams: {
    sort?: string
    status?: string
  }
}

export default async function CampaignsPage({ searchParams }: Props): Promise<ReactElement> {
  const campaigns = await CampaignRepository.list()

  // Filter by status
  const filteredCampaigns = campaigns.filter(campaign => {
    if (searchParams.status === 'active') return campaign.status === 'active'
    if (searchParams.status === 'inactive') return campaign.status === 'inactive'
    return true
  })

  // Sort campaigns
  const sortedCampaigns = [...filteredCampaigns].sort((a, b) => {
    switch (searchParams.sort) {
      case 'title_asc':
        return a.title.localeCompare(b.title)
      case 'title_desc':
        return b.title.localeCompare(a.title)
      case 'date_asc':
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      case 'date_desc':
      default:
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    }
  })

  return (
    <div className="container max-w-4xl py-8">
      <div className="mb-8">
        <h1 className="mb-4 text-2xl font-semibold tracking-tight">Campaigns</h1>
        <CampaignFilters />
      </div>

      <div className="grid gap-4">
        {sortedCampaigns.map(campaign => (
          <Link key={campaign.id} href={`/campaigns/${campaign.id}`}>
            <Card className="transition-colors hover:bg-muted/50">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">
                    {campaign.title}
                  </CardTitle>
                  <Badge variant={campaign.status === 'active' ? 'success' : 'secondary'}>
                    {campaign.status}
                  </Badge>
                </div>
                <CardDescription className="line-clamp-2">
                  {campaign.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-muted-foreground">
                  Created {formatDistanceToNow(new Date(campaign.createdAt), { addSuffix: true })}
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {sortedCampaigns.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-8 text-center">
            <h3 className="mb-2 text-lg font-medium">No campaigns found</h3>
            <p className="mb-4 text-sm text-muted-foreground">
              Try adjusting your filters or create a new campaign
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
} 