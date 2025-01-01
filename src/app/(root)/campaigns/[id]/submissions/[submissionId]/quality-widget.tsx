import { ReactElement } from 'react'
import { Progress } from '@/src/components/ui/progress'
import { Sparkles, AlertCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

interface QualityWidgetProps {
  contentQuality: {
    score: number
    tone?: string[]
    strengths: string[]
    improvements: string[]
  }
}

export const QualityWidget = ({ contentQuality }: QualityWidgetProps): ReactElement => {
  const { score = 0, strengths = [], improvements = [], tone = [] } = contentQuality || {}
  const hasStrengths = strengths.length > 0
  const hasImprovements = improvements.length > 0
  const hasTone = tone.length > 0

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex flex-col gap-1.5 p-3 rounded-lg bg-white border border-gray-100 shadow-sm">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-700">Content Quality</span>
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

        {hasTone && (
          <div className="flex flex-wrap gap-2 px-1">
            {tone.map((t) => (
              <span key={t} className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-700">
                {t}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className={cn("rounded-lg overflow-hidden border shadow-sm bg-green-50 border-green-100")}>
          <div className={cn("px-4 py-2 flex items-center gap-2 font-medium text-sm text-green-700 bg-green-100")}>
            <Sparkles className="h-4 w-4 text-green-500 flex-shrink-0" />
            <span>Strengths</span>
          </div>
          <div className="p-4 space-y-3">
            {hasStrengths ? (
              strengths.map((line, idx) => (
                <div key={idx} className="flex items-start gap-3 group">
                  <div className="w-1 h-1 rounded-full mt-2 bg-current opacity-40 group-hover:opacity-100 transition-opacity" />
                  <p className="text-sm text-gray-700 leading-relaxed flex-1">{line}</p>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500">No strengths identified</p>
            )}
          </div>
        </div>

        <div className={cn("rounded-lg overflow-hidden border shadow-sm bg-amber-50 border-amber-100")}>
          <div className={cn("px-4 py-2 flex items-center gap-2 font-medium text-sm text-amber-700 bg-amber-100")}>
            <AlertCircle className="h-4 w-4 text-amber-500 flex-shrink-0" />
            <span>Areas for Improvement</span>
          </div>
          <div className="p-4 space-y-3">
            {hasImprovements ? (
              improvements.map((line, idx) => (
                <div key={idx} className="flex items-start gap-3 group">
                  <div className="w-1 h-1 rounded-full mt-2 bg-current opacity-40 group-hover:opacity-100 transition-opacity" />
                  <p className="text-sm text-gray-700 leading-relaxed flex-1">{line}</p>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500">No improvements needed</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
} 