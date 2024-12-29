import type { CollaborationStep } from "@/types/brief"

interface BriefTimelineProps {
  steps: CollaborationStep[]
}

export const BriefTimeline = ({ steps }: BriefTimelineProps): React.ReactElement => {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold tracking-tight">Collaboration Timeline</h2>
      <div className="space-y-6">
        {steps.map((step) => (
          <div key={step.step} className="flex gap-4">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted font-medium">
              {step.step}
            </div>
            <div className="space-y-1">
              <h3 className="font-medium leading-none">{step.title}</h3>
              <p className="text-sm text-muted-foreground">{step.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
} 