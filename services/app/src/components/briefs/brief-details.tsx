import type { Brief } from "@/types/brief"
import { BriefTimeline } from "./brief-timeline"
import { BriefGuidelines } from "./brief-guidelines"

interface BriefDetailsProps {
  brief: Brief
}

export const BriefDetails = ({ brief }: BriefDetailsProps): React.ReactElement => {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-4">
        <h1 className="text-3xl font-bold tracking-tight">{brief.title}</h1>
        <p className="text-lg text-muted-foreground">{brief.description}</p>
      </div>

      {/* Overview */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold tracking-tight">Overview</h2>
        <div className="space-y-4">
          <div>
            <h3 className="font-medium">What is {brief.title.split(" ")[0]}?</h3>
            <p className="mt-1.5 text-muted-foreground">{brief.overview.what}</p>
          </div>
          <div>
            <h3 className="font-medium">Getting Started</h3>
            <p className="mt-1.5 text-muted-foreground">{brief.overview.gettingStarted}</p>
          </div>
        </div>
      </div>

      {/* Timeline */}
      <BriefTimeline steps={brief.collaborationTimeline} />

      {/* Guidelines */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold tracking-tight">Guidelines</h2>
        <BriefGuidelines guidelines={brief.guidelines} />
      </div>

      {/* Examples */}
      {brief.examples && brief.examples.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold tracking-tight">Examples</h2>
          <div className="space-y-2">
            {brief.examples.map((example, index) => (
              <a
                key={index}
                href={example.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-primary hover:underline"
              >
                {example.title}
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  )
} 