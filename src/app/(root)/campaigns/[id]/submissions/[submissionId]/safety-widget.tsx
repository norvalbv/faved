import { ReactElement } from 'react'
import { Progress } from '@/src/components/ui/progress'
import { AlertTriangle } from 'lucide-react'
import { cn } from '@/lib/utils'

interface SafetyWidgetProps {
  brandSafety: {
    score: number
    issues: string[]
    confidence: number
  }
}

export const SafetyWidget = ({ brandSafety }: SafetyWidgetProps): ReactElement => {
  const { score = 0, issues = [], confidence = 0 } = brandSafety || {}
  const hasIssues = issues.length > 0

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="flex flex-col gap-1.5 p-3 rounded-lg bg-white border border-gray-100 shadow-sm">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-700">Overall Score</span>
            <span className={cn("text-sm font-semibold",
              score >= 80 ? "text-green-600" :
              score >= 60 ? "text-amber-600" :
              "text-red-600"
            )}>{score}/100</span>
          </div>
          <Progress 
            value={score} 
            className={cn("h-1.5",
              score >= 80 ? "bg-green-500" :
              score >= 60 ? "bg-amber-500" :
              "bg-red-500"
            )} 
          />
        </div>

        <div className="flex flex-col gap-1.5 p-3 rounded-lg bg-white border border-gray-100 shadow-sm">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-700">Confidence</span>
            <span className="text-sm font-semibold text-blue-600">{confidence.toFixed(1)}%</span>
          </div>
          <Progress value={confidence} className="h-1.5 bg-blue-500" />
        </div>
      </div>

      <div className={cn(
        "rounded-lg overflow-hidden border shadow-sm",
        hasIssues ? "bg-red-50 border-red-100" : "bg-green-50 border-green-100"
      )}>
        <div className={cn(
          "px-4 py-2 flex items-center gap-2 font-medium text-sm",
          hasIssues ? "text-red-700 bg-red-100" : "text-green-700 bg-green-100"
        )}>
          <AlertTriangle className={cn("h-4 w-4 flex-shrink-0", hasIssues ? "text-red-500" : "text-green-500")} />
          <span>Safety Issues</span>
        </div>
        <div className="p-4 space-y-3">
          {hasIssues ? (
            issues.map((line, idx) => (
              <div key={idx} className="flex items-start gap-3 group">
                <div className="w-1 h-1 rounded-full mt-2 bg-current opacity-40 group-hover:opacity-100 transition-opacity" />
                <p className="text-sm text-red-700 leading-relaxed flex-1">{line}</p>
              </div>
            ))
          ) : (
            <p className="text-sm text-green-700">No safety issues detected</p>
          )}
        </div>
      </div>
    </div>
  )
} 