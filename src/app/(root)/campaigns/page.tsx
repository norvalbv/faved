import { CampaignRepository } from '@/lib/data-store/repositories/campaign'
import { Badge } from '@/src/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/src/components/ui/card'
import { formatDistanceToNow } from 'date-fns'
import Link from 'next/link'
import { ReactElement } from 'react'
import { CampaignFilters } from './CampaignFilters'
import { ProjectRepository } from '@/lib/data-store/repositories/project'
import { BriefRepository } from '@/lib/data-store/repositories/brief'
import { Separator } from '@/src/components/ui/separator'
import { FileText, MessageSquare } from 'lucide-react'
import type { Campaign } from '@/lib/types/campaign'
import type { Brief } from '@/lib/types/brief'
import type { Project } from '@/lib/types/project'

interface Props {
  searchParams: {
    sort?: string
    status?: string
    briefType?: string
    briefId?: string
    projectId?: string
  }
}

type CampaignWithDetails = Campaign & {
  submissionCount: number
  briefTitle: string | null
  companyTitle: string
}

export default async function CampaignsPage({ searchParams }: Props): Promise<ReactElement> {
  // Get all data using repositories
  const [campaigns, briefs, projects] = await Promise.all([
    CampaignRepository.listWithSubmissionCount(),
    BriefRepository.list(),
    ProjectRepository.list()
  ]) as [
    (Campaign & { submissionCount: number })[],
    Brief[],
    Project[]
  ]

  // Transform results
  let campaignsWithDetails = campaigns.map(campaign => {
    const brief = briefs.find(b => b.id === campaign.briefId)
    const project = projects.find(p => p.id === campaign.projectId)

    return {
      ...campaign,
      briefTitle: brief?.title || null,
      companyDescription: project?.description || null,
      companyTitle: project?.title || 'Unknown Company'
    }
  })

  // Filter by status
  if (searchParams.status) {
    campaignsWithDetails = campaignsWithDetails.filter(campaign => 
      campaign.status === searchParams.status
    )
  }

  // Filter by project
  if (searchParams.projectId && searchParams.projectId !== 'all') {
    campaignsWithDetails = campaignsWithDetails.filter(campaign => 
      campaign.projectId === searchParams.projectId
    )
  }

  // Filter by brief type
  if (searchParams.briefType && searchParams.briefType !== 'all') {
    campaignsWithDetails = campaignsWithDetails.filter(campaign => {
      const brief = briefs.find(b => b.id === campaign.briefId)
      return brief?.type === searchParams.briefType
    })
  }

  // Filter by specific brief
  if (searchParams.briefId && searchParams.briefId !== 'all') {
    campaignsWithDetails = campaignsWithDetails.filter(campaign => 
      campaign.briefId === searchParams.briefId
    )
  }

  // Sort campaigns
  if (searchParams.sort) {
    campaignsWithDetails = [...campaignsWithDetails].sort((a, b) => {
      switch (searchParams.sort) {
        case 'title_asc':
          return a.title.localeCompare(b.title)
        case 'title_desc':
          return b.title.localeCompare(a.title)
        case 'date_asc':
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        case 'date_desc':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        default:
          return 0
      }
    })
  } else {
    // Default sort by date desc
    campaignsWithDetails = [...campaignsWithDetails].sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
  }

  const badgeVariantMap: Record<string, 'success' | 'secondary' | 'default'> = {
    active: 'success',
    draft: 'secondary',
    completed: 'default'
  }

  return (
    <div className="container max-w-4xl py-8">
      <div className="mb-8">
        <h1 className="mb-1 text-2xl font-semibold tracking-tight">Campaigns</h1>
        <p className="text-sm text-muted-foreground mb-4">{campaignsWithDetails.length} total campaigns</p>
        <CampaignFilters 
          projects={projects.map(project => ({
            id: project.id,
            title: project.title
          }))} 
          briefs={briefs.map(brief => ({
            id: brief.id,
            title: brief.title,
            type: brief.type
          }))} 
        />
      </div>

      <div className="grid gap-4">
        {campaignsWithDetails.map(campaign => (
          <Link key={campaign.id} href={`/campaigns/${campaign.id}`}>
            <Card className="transition-colors hover:bg-muted/50">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-base">
                      {campaign.companyTitle}
                    </CardTitle>
                    <Badge variant="outline" className="text-xs">
                     Campaign ID: #{campaign.id.slice(0, 8)}
                    </Badge>
                  </div>
                  <Badge variant={badgeVariantMap[campaign.status] || 'default'}>
                    {campaign.status}
                  </Badge>
                </div>
                <CardDescription className="line-clamp-2">
                  {campaign.companyDescription}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <MessageSquare className="h-4 w-4" />
                      <span>{campaign.submissionCount} submissions</span>
                    </div>
                  </div>
                  {campaign.briefTitle && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <FileText className="h-4 w-4" />
                      <span>
                        {campaign.briefTitle}
                      </span>
                    </div>
                  )}
                  <Separator />
                  <div className="text-sm text-muted-foreground">
                    Created {formatDistanceToNow(new Date(campaign.createdAt), { addSuffix: true })}
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {campaignsWithDetails.length === 0 && (
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