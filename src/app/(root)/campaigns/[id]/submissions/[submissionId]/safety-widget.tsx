import { ReactElement } from 'react'
import { Progress } from '@/src/components/ui/progress'
import { AlertCircle, CheckCircle } from 'lucide-react'

interface SafetyWidgetProps {
  brandSafety: {
    score: number
    issues: string[]
    confidence: number
  }
}

export const SafetyWidget = ({ brandSafety }: SafetyWidgetProps): ReactElement => {
  const hasIssues = brandSafety.issues.length > 0

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Safety Score</span>
          <span className="font-medium">{brandSafety.score}/100</span>
        </div>
        <Progress value={brandSafety.score} className="bg-primary/20" />
      </div>

      <div className="rounded-lg border p-4 space-y-3">
        <div className="flex items-center gap-2">
          {hasIssues ? (
            <AlertCircle className="h-5 w-5 text-red-500" />
          ) : (
            <CheckCircle className="h-5 w-5 text-green-500" />
          )}
          <span className="font-medium">
            {hasIssues ? 'Safety Concerns' : 'No Safety Issues'}
          </span>
        </div>

        {hasIssues && (
          <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
            {brandSafety.issues.map((issue, i) => (
              <li key={i}>{issue}</li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
} 