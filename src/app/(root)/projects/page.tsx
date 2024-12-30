import { ReactElement } from 'react'
import { BriefRepository } from '@/lib/data-store/repositories/brief'
import { ProjectRepository } from '@/lib/data-store/repositories/project'
import type { ProjectMetadata } from '@/lib/types/project'
import { Badge } from '@/src/components/ui/badge'
import { Building2, FileText, Youtube } from 'lucide-react'
import { BriefCard } from './brief-card'
import { formatDistanceToNow } from 'date-fns'
import type { Brief, BriefMetadata } from '@/lib/types/brief'
import Link from 'next/link'
import { Button } from '@/src/components/ui/button'

export default async function ProjectsPage(): Promise<ReactElement> {
  const [briefs, projects] = await Promise.all([
    BriefRepository.list(),
    ProjectRepository.list()
  ])

  // Group briefs by project
  const briefsByProject = briefs.reduce((acc, brief) => {
    const projectId = brief.projectId || 'unassigned'
    if (!acc[projectId]) {
      acc[projectId] = []
    }
    // Convert brief metadata to match Brief type
    const briefWithMetadata: Brief = {
      ...brief,
      metadata: brief.metadata as BriefMetadata
    }
    acc[projectId].push(briefWithMetadata)
    return acc
  }, {} as Record<string, Brief[]>)

  return (
    <div className="container py-8">
      {projects.map(project => {
        const projectBriefs = briefsByProject[project.id] || []
        if (projectBriefs.length === 0) return null
        const metadata = project.metadata as ProjectMetadata

        return (
          <div key={project.id} className="mb-16 last:mb-0">
            {/* Project Header */}
            <div className="mb-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 mb-1">
                  <Link href={`/projects#${project.id}`} className="flex items-center gap-2">
                    <Building2 className="h-6 w-6 text-primary" />
                    <h1 className="text-2xl font-semibold tracking-tight">{project.title}</h1>
                    <Badge variant={project.status === 'active' ? 'success' : 'secondary'}>
                      {project.status}
                    </Badge>
                  </Link>
                </div>
                <div className="flex items-center gap-4">
                  <Link href={`/campaigns?projectId=${project.id}`}>
                    <Button variant="outline" size="sm">
                      View {project.title} Campaigns
                    </Button>
                  </Link>
                </div>
              </div>
              <p className="text-muted-foreground mb-4">
                {project.description}
              </p>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                {metadata.platform && (
                  <div className="flex items-center gap-1.5">
                    <Youtube className="h-4 w-4" />
                    <span>{metadata.platform}</span>
                  </div>
                )}
                <span>•</span>
                <div className="flex items-center gap-1.5">
                  <FileText className="h-4 w-4" />
                  <span>{projectBriefs.length} briefs</span>
                </div>
                <span>•</span>
                <span>
                  Created {formatDistanceToNow(new Date(project.createdAt), { addSuffix: true })}
                </span>
              </div>
            </div>

            {/* Project Briefs */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {projectBriefs.map(brief => (
                <BriefCard key={brief.id} brief={brief} />
              ))}
            </div>
          </div>
        )
      })}

      {projects.length === 0 && (
        <div className="rounded-lg border bg-card p-8 text-center">
          <h3 className="mb-2 text-lg font-medium">No projects found</h3>
          <p className="text-sm text-muted-foreground">
            There are no projects available at the moment
          </p>
        </div>
      )}
    </div>
  )
}