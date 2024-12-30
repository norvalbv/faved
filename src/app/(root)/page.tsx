import { ReactElement } from 'react'
import Link from 'next/link'
import { BriefRepository } from '@/lib/data-store/repositories/brief'
import { ProjectRepository } from '@/lib/data-store/repositories/project'
import { SubmissionRepository } from '@/lib/data-store/repositories/submission'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/src/components/ui/card'
import { Badge } from '@/src/components/ui/badge'
import { formatDistanceToNow } from 'date-fns'
import { Building2, FileText, MessageCircle } from 'lucide-react'
import type { SubmissionMetadata } from '@/lib/types/submission'
import type { ProjectMetadata } from '@/lib/types/project'

export default async function DashboardPage(): Promise<ReactElement> {
  const [projects, recentSubmissions] = await Promise.all([
    ProjectRepository.list(),
    SubmissionRepository.listRecent(5)
  ])

  const activeProjects = projects.filter(project => project.status === 'active')

  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Overview of your content creation projects
        </p>
      </div>

      {/* Active Projects */}
      <section className="mb-12">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-lg font-medium">Active Projects</h2>
          <Link 
            href="/projects" 
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            View all
          </Link>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {activeProjects.map(project => {
            const metadata = project.metadata as ProjectMetadata
            
            return (
              <Link key={project.id} href={`/projects#${project.id}`}>
                <Card className="h-full transition-colors hover:bg-muted/50">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Building2 className="h-5 w-5 text-primary" />
                        <CardTitle className="text-base">
                          {project.title}
                        </CardTitle>
                      </div>
                      <Badge variant="success" className="text-xs">
                        {project.status}
                      </Badge>
                    </div>
                    <CardDescription className="line-clamp-2">
                      {project.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      {metadata.platform && (
                        <div className="flex items-center gap-1.5">
                          <span>Platform:</span>
                          <Badge variant="outline" className="text-xs">
                            {metadata.platform}
                          </Badge>
                        </div>
                      )}
                      <span>•</span>
                      <span>
                        Created {formatDistanceToNow(new Date(project.createdAt), { addSuffix: true })}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            )
          })}

          {activeProjects.length === 0 && (
            <Card className="col-span-full">
              <CardContent className="flex flex-col items-center justify-center py-8 text-center">
                <h3 className="mb-2 text-lg font-medium">No active projects</h3>
                <p className="text-sm text-muted-foreground">
                  There are no active projects at the moment
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </section>

      {/* Recent Submissions */}
      <section>
        <div className="mb-6 flex items-center justify-between">
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
            const isApproved = metadata.approved
            const hasFeedback = !!metadata.feedback

            return (
              <Card key={submission.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CardTitle className="text-base">
                        {metadata.sender || 'Anonymous'}
                      </CardTitle>
                      <Badge variant="outline" className="text-xs">
                        {metadata.type}
                      </Badge>
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
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1.5">
                      <FileText className="h-4 w-4" />
                      <span>Stage {metadata.stageId}</span>
                    </div>
                    {hasFeedback && (
                      <>
                        <span>•</span>
                        <div className="flex items-center gap-1.5">
                          <MessageCircle className="h-4 w-4" />
                          <span>Has feedback</span>
                        </div>
                      </>
                    )}
                    <span>•</span>
                    <span>
                      Submitted {formatDistanceToNow(new Date(submission.createdAt), { addSuffix: true })}
                    </span>
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
      </section>
    </div>
  )
} 