import { ReactElement } from 'react'
import { BriefRepository } from '@/lib/data-store/repositories/brief'
import { ProjectRepository } from '@/lib/data-store/repositories/project'
import { SubmissionRepository } from '@/lib/data-store/repositories/submission'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/src/components/ui/card'
import { Badge } from '@/src/components/ui/badge'
import Link from 'next/link'
import { formatDistanceToNow } from 'date-fns'
import type { SubmissionMetadata } from '@/lib/types/submission'

export default async function DashboardPage(): Promise<ReactElement> {
  const [briefs, projects, recentSubmissions] = await Promise.all([
    BriefRepository.list(),
    ProjectRepository.list(),
    SubmissionRepository.listRecent(5)
  ])

  // Create a map of project IDs to projects for easy lookup
  const projectMap = new Map(projects.map(project => [project.id, project]))

  return (
    <div className="container max-w-4xl py-8">
      <div className="mb-8">
        <h1 className="mb-2 text-2xl font-semibold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Overview of your content creation projects
        </p>
      </div>

      {/* Projects Section */}
      <div className="mb-8">
        <h2 className="mb-4 text-lg font-medium">Active Projects</h2>
        <div className="grid gap-4">
          {projects
            .filter(project => project.status === 'active')
            .map(project => (
              <Card key={project.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">
                      {project.title}
                    </CardTitle>
                    <Badge variant="success" className="text-xs">
                      {project.status}
                    </Badge>
                  </div>
                  <CardDescription className="line-clamp-2">
                    {project.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-sm text-muted-foreground">
                    Created {formatDistanceToNow(new Date(project.createdAt), { addSuffix: true })}
                  </div>
                </CardContent>
              </Card>
            ))}

          {projects.filter(project => project.status === 'active').length === 0 && (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-8 text-center">
                <h3 className="mb-2 text-lg font-medium">No active projects</h3>
                <p className="text-sm text-muted-foreground">
                  There are no active projects at the moment
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Recent Briefs Section */}
      <div className="mb-8">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-medium">Recent Briefs</h2>
          <Link 
            href="/briefs" 
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            View all
          </Link>
        </div>
        <div className="grid gap-4">
          {briefs.slice(0, 3).map(brief => {
            const project = brief.projectId ? projectMap.get(brief.projectId) : undefined

            return (
              <Link key={brief.id} href={`/briefs/${brief.id}`}>
                <Card className="transition-colors hover:bg-muted/50">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <CardTitle className="text-base">
                          {brief.title}
                        </CardTitle>
                        {project && (
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-xs">
                              {project.title}
                            </Badge>
                            <Badge 
                              variant={project.status === 'active' ? 'success' : 'secondary'} 
                              className="text-xs"
                            >
                              {project.status}
                            </Badge>
                          </div>
                        )}
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {brief.type}
                      </Badge>
                    </div>
                    <CardDescription className="line-clamp-2">
                      {brief.description}
                    </CardDescription>
                  </CardHeader>
                </Card>
              </Link>
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
      </div>

      {/* Recent Submissions Section */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-medium">Recent Submissions</h2>
          <Link 
            href="/submissions" 
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            View all
          </Link>
        </div>
        <div className="grid gap-4">
          {recentSubmissions.map(submission => {
            const metadata = submission.metadata as SubmissionMetadata
            const project = metadata.campaignId ? projectMap.get(metadata.campaignId) : undefined
            const isApproved = metadata.approved
            const hasFeedback = !!metadata.feedback

            return (
              <Card key={submission.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <CardTitle className="text-base">
                        {metadata.sender || 'Anonymous'}
                      </CardTitle>
                      {project && (
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs">
                            {project.title}
                          </Badge>
                        </div>
                      )}
                    </div>
                    <Badge variant={isApproved ? 'success' : hasFeedback ? 'warning' : 'secondary'}>
                      {isApproved ? 'Approved' : hasFeedback ? 'Reviewed' : 'Pending'}
                    </Badge>
                  </div>
                  <CardDescription className="line-clamp-2">
                    {submission.content}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-sm text-muted-foreground">
                    Submitted {formatDistanceToNow(new Date(submission.createdAt), { addSuffix: true })}
                  </div>
                </CardContent>
              </Card>
            )
          })}

          {recentSubmissions.length === 0 && (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-8 text-center">
                <h3 className="mb-2 text-lg font-medium">No submissions yet</h3>
                <p className="text-sm text-muted-foreground">
                  There are no submissions available at the moment
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
} 