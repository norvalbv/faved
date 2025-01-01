import { ReactElement } from 'react'
import { Target } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Progress } from '@/src/components/ui/progress'

interface AlignmentWidgetProps {
  brandAlignment: {
    score: number
    confidence: number
    alignment: string[]
    misalignment: string[]
  }
}

export const AlignmentWidget = ({ brandAlignment }: AlignmentWidgetProps): ReactElement => {
  const { score = 0, confidence = 0, alignment = [], misalignment = [] } = brandAlignment || {}
  const hasIssues = misalignment.length > 0
  const hasStrengths = alignment.length > 0

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="flex flex-col gap-1.5 p-3 rounded-lg bg-white border border-gray-100 shadow-sm">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-700">Brand Alignment</span>
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

      <div className={cn("rounded-lg overflow-hidden border shadow-sm bg-purple-50 border-purple-100")}>
        <div className={cn("px-4 py-2 flex items-center gap-2 font-medium text-sm text-purple-700 bg-purple-100")}>
          <Target className="h-4 w-4 text-purple-500 flex-shrink-0" />
          <span>Brand Alignment</span>
        </div>
        <div className="p-4 space-y-4">
          {hasStrengths && (
            <div className="space-y-2">
              <h5 className="text-sm font-medium text-purple-700">Strengths</h5>
              <div className="space-y-3">
                {alignment.map((line, idx) => (
                  <div key={idx} className="flex items-start gap-3 group">
                    <div className="w-1 h-1 rounded-full mt-2 bg-current opacity-40 group-hover:opacity-100 transition-opacity" />
                    <p className="text-sm text-gray-700 leading-relaxed flex-1">{line}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {hasIssues && (
            <div className="space-y-2">
              <h5 className="text-sm font-medium text-purple-700">Misalignment Issues</h5>
              <div className="space-y-3">
                {misalignment.map((line, idx) => (
                  <div key={idx} className="flex items-start gap-3 group">
                    <div className="w-1 h-1 rounded-full mt-2 bg-current opacity-40 group-hover:opacity-100 transition-opacity" />
                    <p className="text-sm text-gray-700 leading-relaxed flex-1">{line}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {!hasStrengths && !hasIssues && (
            <p className="text-sm text-gray-500 italic">No alignment data found</p>
          )}
        </div>
      </div>
    </div>
  )
} 