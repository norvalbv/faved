import { ReactElement } from "react"
import type { Brief } from "@/lib/types/brief"
import { Badge } from "@/src/components/ui/badge"
import { Button } from "@/src/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card"
import { ArrowLeft, ArrowRight } from "lucide-react"
import Link from "next/link"

interface BriefDetailsProps {
  brief: Brief
}

export const BriefDetails = ({ brief }: BriefDetailsProps): ReactElement => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/briefs" className="text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-6 w-6" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold">{brief.title}</h1>
            <Badge variant="outline" className="mt-2 capitalize">
              {brief.type.replace("_", " ")}
            </Badge>
          </div>
        </div>
        <Link href={`/submissions/new?briefId=${brief.id}`}>
          <Button size="lg">
            Start Submission
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Overview</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="font-medium mb-2">What is Milanote?</h3>
            <p className="text-muted-foreground">{brief.overview.what}</p>
          </div>
          <div>
            <h3 className="font-medium mb-2">Getting Started</h3>
            <p className="text-muted-foreground">{brief.overview.gettingStarted}</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Submission Timeline</CardTitle>
        </CardHeader>
        <CardContent>
          <ol className="relative space-y-6 border-l border-muted">
            {brief.collaborationTimeline.map((step, index) => (
              <li key={index} className="ml-6">
                <div className="absolute -left-3 flex h-6 w-6 items-center justify-center rounded-full bg-background border border-muted">
                  <span className="text-sm font-medium">{step.step}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">{step.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {step.description}
                    </p>
                  </div>
                  <Link href={`/submissions/new?briefId=${brief.id}&stage=${step.step}`}>
                    <Button variant="outline" size="sm">
                      Submit for this stage
                    </Button>
                  </Link>
                </div>
              </li>
            ))}
          </ol>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Guidelines</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {brief.guidelines.map((guideline, index) => (
            <div key={index}>
              <h3 className="font-medium mb-2">{guideline.category}</h3>
              <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                {guideline.items.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </CardContent>
      </Card>

      {brief.examples && brief.examples.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Examples</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc list-inside space-y-2 text-sm">
              {brief.examples.map((example, index) => (
                <li key={index}>
                  <a
                    href={example.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    {example.title}
                  </a>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  )
} 