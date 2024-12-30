import { ReactElement } from 'react'
import { notFound } from 'next/navigation'
import { BriefRepository } from '@/lib/data-store/repositories/brief'
import type { BriefMetadata } from '@/lib/types/brief'
import { Badge } from '@/src/components/ui/badge'
import { Card, CardContent } from '@/src/components/ui/card'
import { Separator } from '@/src/components/ui/separator'
import { FileText, Clock, CheckCircle, Target, Link as LinkIcon } from 'lucide-react'
import Link from 'next/link'

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
                    <Separator />
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
              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-primary" />
                      <h2 className="text-xl font-semibold">Guidelines</h2>
                    </div>
                    <Separator />
                    <div className="space-y-8">
                      {metadata.guidelines.map((section, sectionIndex) => {
                        const items = Array.isArray(section) ? section : section.items
                        const category = typeof section === 'object' ? section.category : null

                        return (
                          <div key={sectionIndex}>
                            {category && (
                              <h3 className="font-medium mb-3 text-lg">{category}</h3>
                            )}
                            {renderListItems(items)}
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </CardContent>
              </Card>
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
                    <Separator />
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
                    <Separator />
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
              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <Clock className="h-5 w-5 text-primary" />
                      <h2 className="text-xl font-semibold">Timeline</h2>
                    </div>
                    <Separator />
                    <div className="relative space-y-6 before:absolute before:left-4 before:top-2 before:h-[calc(100%-2rem)] before:w-px before:bg-border">
                      {metadata.collaborationTimeline.map((item, index) => (
                        <div key={index} className="relative grid gap-2 pl-12">
                          <div className="absolute left-2.5 top-2 h-3 w-3 rounded-full border-2 border-primary bg-background" />
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium">Step {item.step}</span>
                          </div>
                          <h3 className="font-medium">{item.title}</h3>
                          <p className="text-sm text-muted-foreground">{item.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
} 