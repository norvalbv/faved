import { BriefRepository } from '@/lib/data-store/repositories/brief'
import { ProjectRepository } from '@/lib/data-store/repositories/project'
import type { ProjectMetadata } from '@/lib/types/project'
import { Badge } from '@/src/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/src/components/ui/card'
import { formatDistanceToNow } from 'date-fns'
import { Building2, FileText, Youtube } from 'lucide-react'
import Link from 'next/link'
import { ReactElement } from 'react'

export default async function BriefsPage(): Promise<ReactElement> {
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
    acc[projectId].push(brief)
    return acc
  }, {} as Record<string, typeof briefs>)

  return (
    <div className="container py-8">
      {projects.map(project => {
        const projectBriefs = briefsByProject[project.id] || []
        if (projectBriefs.length === 0) return null
        const metadata = project.metadata as ProjectMetadata

        return (
          <div key={project.id}>
            {/* Project Header */}
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-1">
                <Building2 className="h-6 w-6 text-primary" />
                <h1 className="text-2xl font-semibold tracking-tight">{project.title}</h1>
                <Badge variant={project.status === 'active' ? 'success' : 'secondary'}>
                  {project.status}
                </Badge>
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
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {projectBriefs.map(brief => (
                <Link key={brief.id} href={`/briefs/${brief.id}`}>
                  <Card className="h-full transition-colors hover:bg-muted/50">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-base">
                          {brief.title}
                        </CardTitle>
                        <Badge variant="outline" className="text-xs">
                          {brief.type}
                        </Badge>
                      </div>
                      <CardDescription className="line-clamp-2">
                        {brief.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="text-sm text-muted-foreground">
                        Created {formatDistanceToNow(new Date(brief.createdAt), { addSuffix: true })}
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>

          </div>
        )
      })}

      {briefs.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-8 text-center">
            <h3 className="mb-2 text-lg font-medium">No briefs found</h3>
            <p className="text-sm text-muted-foreground">
              There are no briefs available at the moment
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
} 