interface BriefTimelineProps {
  steps: Array<{
    step: number
    title: string
    description: string
  }>
}

export const BriefTimeline = ({ steps }: BriefTimelineProps) => {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold tracking-tight">Collaboration Timeline</h2>
      <div className="space-y-8">
        {steps.map((step) => (
          <div key={step.step} className="flex gap-4">
            <div className="flex-none">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-medium text-primary-foreground">
                {step.step}
              </div>
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-medium">{step.title}</h3>
              <p className="text-sm text-gray-600">{step.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
} 