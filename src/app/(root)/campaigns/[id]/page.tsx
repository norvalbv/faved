import { ReactElement } from 'react'
import { redirect } from 'next/navigation'

interface Props {
  params: {
    id: string
  }
}

/**
 * Redirects to submissions page
 */
export default async function CampaignPage({ params }: Props): Promise<ReactElement> {
  redirect(`/campaigns/${params.id}/submissions`)
} 