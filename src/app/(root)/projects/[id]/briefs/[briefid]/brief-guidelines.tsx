import { ReactElement } from 'react'
import { Card, CardContent } from '@/src/components/ui/card'
import { Separator } from '@/src/components/ui/separator'
import { CheckCircle } from 'lucide-react'

interface BriefGuidelinesProps {
  guidelines: Array<{
    category: string
    items: string[]
  }>
}

export const BriefGuidelines = ({ guidelines }: BriefGuidelinesProps): ReactElement => {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-semibold">Guidelines</h2>
          </div>
          <Separator className="my-4" />
          <div className="space-y-8">
            {guidelines.map((guideline, index) => (
              <div key={index} className="space-y-3">
                <h3 className="font-medium text-lg">{guideline.category}</h3>
                <ul className="space-y-2 text-muted-foreground">
                  {guideline.items.map((item, itemIndex) => (
                    <li key={itemIndex} className="flex items-start gap-2">
                      <div className="mt-1.5">
                        <CheckCircle className="h-4 w-4 text-primary/60" />
                      </div>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 