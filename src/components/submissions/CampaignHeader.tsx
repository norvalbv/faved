import { ReactElement } from 'react'
import { Badge } from '@/src/components/ui/badge'
import type { Campaign } from '@/lib/types/campaign'

interface Props {
  campaign: Campaign
}

export const CampaignHeader = ({ campaign }: Props): ReactElement => {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="mb-2 text-2xl font-semibold tracking-tight">{campaign.title}</h1>
        <p className="text-muted-foreground">{campaign.description}</p>
      </div>
      <Badge variant={campaign.status === 'active' ? 'success' : 'secondary'}>
        {campaign.status}
      </Badge>
    </div>
  )
} 