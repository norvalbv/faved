import { ReactElement } from 'react'
import { notFound } from 'next/navigation'
import { BriefRepository } from '@/lib/data-store/repositories/brief'
import { ProjectRepository } from '@/lib/data-store/repositories/project'
import { BriefCard } from '@/src/components/brief-card'

interface Props {
  params: {
    id: string
  }
}

export default async function BriefsPage({ params }: Props): Promise<ReactElement> {
  const [project, briefs] = await Promise.all([
    ProjectRepository.getById(params.id),
    BriefRepository.list()
  ])

  if (!project) {
    notFound()
  }

  // Filter briefs for this project
  const projectBriefs = briefs.filter(brief => brief.projectId === params.id)

  return (
    <div className="container py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-semibold mb-4">{project.title} Briefs</h1>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {projectBriefs.map(brief => (
            <BriefCard key={brief.id} brief={brief} />
          ))}
        </div>

        {projectBriefs.length === 0 && (
          <p className="text-muted-foreground">No briefs found for this project.</p>
        )}
      </div>
    </div>
  )
} 