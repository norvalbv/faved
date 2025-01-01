import { ReactElement } from 'react'
import { Progress } from '@/src/components/ui/progress'
import { cn } from '@/lib/utils'
import { CheckCircle2, XCircle } from 'lucide-react'

interface SellingPointsWidgetProps {
  sellingPoints: {
    score: number
    confidence: number
    effectiveness: number
    present: string[]
    missing: string[]
  }
}

export const SellingPointsWidget = ({ sellingPoints }: SellingPointsWidgetProps): ReactElement => {
  const hasPresent = sellingPoints.present.length > 0
  const hasMissing = sellingPoints.missing.length > 0

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="flex flex-col gap-1.5 p-3 rounded-lg bg-white border border-gray-100 shadow-sm">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-700">Overall Score</span>
            <span className={cn("text-sm font-semibold",
              sellingPoints.score >= 80 ? "text-green-600" :
              sellingPoints.score >= 60 ? "text-amber-600" :
              "text-red-600"
            )}>{sellingPoints.score}/100</span>
          </div>
          <Progress 
            value={sellingPoints.score} 
            className={cn("h-1.5",
              sellingPoints.score >= 80 ? "bg-green-500" :
              sellingPoints.score >= 60 ? "bg-amber-500" :
              "bg-red-500"
            )} 
          />
        </div>

        <div className="flex flex-col gap-1.5 p-3 rounded-lg bg-white border border-gray-100 shadow-sm">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-700">Effectiveness</span>
            <span className="text-sm font-semibold text-blue-600">{sellingPoints.effectiveness}%</span>
          </div>
          <Progress value={sellingPoints.effectiveness} className="h-1.5 bg-blue-500" />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {hasPresent && (
          <div className="rounded-lg border border-gray-100 shadow-sm bg-white overflow-hidden">
            <div className="px-4 py-2 bg-green-50 border-b border-green-100 flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-500" />
              <h4 className="text-sm font-medium text-green-700">Present Points</h4>
            </div>
            <div className="p-4">
              <ul className="space-y-2">
                {sellingPoints.present.map((point, i) => (
                  <li key={i} className="flex items-start gap-3 group">
                    <div className="w-1 h-1 rounded-full mt-2 bg-green-500 opacity-40 group-hover:opacity-100 transition-opacity" />
                    <p className="text-sm text-gray-600 leading-relaxed flex-1">{point}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {hasMissing && (
          <div className="rounded-lg border border-gray-100 shadow-sm bg-white overflow-hidden">
            <div className="px-4 py-2 bg-red-50 border-b border-red-100 flex items-center gap-2">
              <XCircle className="h-4 w-4 text-red-500" />
              <h4 className="text-sm font-medium text-red-700">Missing Points</h4>
            </div>
            <div className="p-4">
              <ul className="space-y-2">
                {sellingPoints.missing.map((point, i) => (
                  <li key={i} className="flex items-start gap-3 group">
                    <div className="w-1 h-1 rounded-full mt-2 bg-red-500 opacity-40 group-hover:opacity-100 transition-opacity" />
                    <p className="text-sm text-gray-600 leading-relaxed flex-1">{point}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  )
} 