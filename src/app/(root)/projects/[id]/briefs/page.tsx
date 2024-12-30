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
export default async function ProjectPage({ params }: Props): Promise<ReactElement> {
  redirect(`/projects`)
} 