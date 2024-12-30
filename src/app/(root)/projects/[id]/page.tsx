import { ReactElement } from 'react'
import { redirect } from 'next/navigation'

/**
 * Redirects to submissions page
 */
export default async function ProjectPage(): Promise<ReactElement> {
  redirect(`/projects`)
} 