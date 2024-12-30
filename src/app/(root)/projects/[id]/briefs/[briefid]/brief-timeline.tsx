import { ReactElement } from 'react'
import { Card, CardContent } from '@/src/components/ui/card'
import { Separator } from '@/src/components/ui/separator'
import { Clock } from 'lucide-react'

interface BriefTimelineProps {
  steps: Array<{
    step: number
    title: string
    description: string
  }>
}

export const BriefTimeline = ({ steps }: BriefTimelineProps): ReactElement => {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-semibold">Timeline</h2>
          </div>
          <Separator className="my-4" />
          <div className="relative space-y-6 before:absolute before:left-4 before:top-2 before:h-[calc(100%-2rem)] before:w-px before:bg-border">
            {steps.map((item) => (
              <div key={item.step} className="relative grid gap-2 pl-12">
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
  )
} 