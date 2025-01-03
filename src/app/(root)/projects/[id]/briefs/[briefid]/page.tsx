import { BriefRepository } from '@/lib/data-store/repositories/brief'
import type { BriefMetadata } from '@/lib/types/brief'
import { Badge } from '@/src/components/ui/badge'
import { Card, CardContent } from '@/src/components/ui/card'
import { Separator } from '@/src/components/ui/separator'
import { CheckCircle, FileText, Link as LinkIcon, Target } from 'lucide-react'
import { notFound } from 'next/navigation'
import { ReactElement } from 'react'
import { BriefGuidelines } from './brief-guidelines'
import { BriefSubmissionForm } from './brief-submission'
import { BriefTimeline } from './brief-timeline'

interface Props {
  params: {
    id: string
    briefid: string
  }
}

const renderListItems = (items: string[] | undefined) => {
  if (!items?.length) return null
  return (
    <ul className="space-y-2 text-muted-foreground">
      {items.map((item, index) => (
        <li key={index} className="flex items-start gap-2">
          <div className="mt-1.5">
            <CheckCircle className="h-4 w-4 text-primary/60" />
          </div>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  )
}

export default async function BriefDetailPage({ params }: Props): Promise<ReactElement> {
  const brief = await BriefRepository.getById(params.briefid)
  
  if (!brief || brief.projectId !== params.id) {
    notFound()
  }

  const metadata = brief.metadata as BriefMetadata

  return (
    <div className="container max-w-6xl py-8">
      <div className="grid gap-8">
        {/* Header */}
        <div>
          <div className="flex items-center gap-3 mb-3">
            <Badge variant="outline" className="text-xs font-medium">
              {brief.type.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
            </Badge>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <FileText className="h-3.5 w-3.5" />
              <span>Brief</span>
            </div>
          </div>
          <h1 className="text-4xl font-bold tracking-tight mb-4">{brief.title}</h1>
          <p className="text-xl text-muted-foreground">{brief.description}</p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1fr_16rem]">
          <div className="space-y-8">
            {/* Overview Section */}
            {metadata.overview && (
              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <Target className="h-5 w-5 text-primary" />
                      <h2 className="text-xl font-semibold">Overview</h2>
                    </div>
                    <Separator className="my-4" />
                    <div className="space-y-6">
                      {typeof metadata.overview === 'string' ? (
                        <p className="text-muted-foreground">{metadata.overview}</p>
                      ) : (
                        <>
                          <div>
                            <h3 className="font-medium mb-2">What</h3>
                            <p className="text-muted-foreground">{metadata.overview.what}</p>
                          </div>
                          <div>
                            <h3 className="font-medium mb-2">Getting Started</h3>
                            <p className="text-muted-foreground">{metadata.overview.gettingStarted}</p>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Guidelines Section */}
            {metadata.guidelines && metadata.guidelines.length > 0 && (
              <BriefGuidelines guidelines={metadata.guidelines} />
            )}

            {/* Examples Section */}
            {metadata.examples && metadata.examples.length > 0 && (
              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <LinkIcon className="h-5 w-5 text-primary" />
                      <h2 className="text-xl font-semibold">Examples</h2>
                    </div>
                    <Separator className="my-4" />
                    <div className="grid gap-3">
                      {metadata.examples.map((example, index) => (
                        <a
                          key={index}
                          href={example.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
                        >
                          <div className="flex-none">
                            <LinkIcon className="h-4 w-4" />
                          </div>
                          <span>{example.title}</span>
                        </a>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Additional Tools Section */}
            {(metadata.productionTools || metadata.designProcess || metadata.writingTools || metadata.suggestions) && (
              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <FileText className="h-5 w-5 text-primary" />
                      <h2 className="text-xl font-semibold">
                        {metadata.productionTools?.title || 
                         metadata.designProcess?.title || 
                         metadata.writingTools?.title || 
                         metadata.suggestions?.title}
                      </h2>
                    </div>
                    <Separator className="my-4" />
                    {renderListItems(
                      metadata.productionTools?.items || 
                      metadata.designProcess?.items || 
                      metadata.writingTools?.items || 
                      metadata.suggestions?.items
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Timeline Sidebar */}
          <div>
            {metadata.collaborationTimeline && metadata.collaborationTimeline.length > 0 && (
              <BriefTimeline steps={metadata.collaborationTimeline} />
            )}
          </div>
        </div>

        {/* Submission Form */}
        <div className="mt-8">
          <BriefSubmissionForm briefId={brief.id} />
        </div>
      </div>
    </div>
  )
} 