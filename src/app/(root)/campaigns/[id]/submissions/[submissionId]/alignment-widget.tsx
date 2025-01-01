import { ReactElement } from 'react'
import { Target } from 'lucide-react'
import { cn } from '@/lib/utils'

interface AlignmentWidgetProps {
  toneMatch: number
  issues: string[]
}

const renderMetricCard = (label: string, value: number, max: number, color: string) => (
  <div className="flex flex-col gap-1.5 p-3 rounded-lg bg-white border border-gray-100 shadow-sm">
    <div className="flex justify-between items-center">
      <span className="text-sm font-medium text-gray-700">{label}</span>
      <span className={cn("text-sm font-semibold", color)}>{value}/{max}</span>
    </div>
  </div>
)

export const AlignmentWidget = ({ toneMatch, issues }: AlignmentWidgetProps): ReactElement => (
  <div className="space-y-4">
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {renderMetricCard("Tone Match", toneMatch, 100,
        toneMatch >= 80 ? "text-green-600" :
        toneMatch >= 60 ? "text-amber-600" :
        "text-red-600"
      )}
    </div>
    <div className={cn("rounded-lg overflow-hidden border shadow-sm bg-purple-50 border-purple-100")}>
      <div className={cn("px-4 py-2 flex items-center gap-2 font-medium text-sm text-purple-700 bg-purple-100")}>
        <Target className="h-4 w-4 text-purple-500 flex-shrink-0" />
        <span>Alignment Issues</span>
      </div>
      <div className="p-4 space-y-3">
        {issues.map((line, idx) => (
          <div key={idx} className="flex items-start gap-3 group">
            <div className="w-1 h-1 rounded-full mt-2 bg-current opacity-40 group-hover:opacity-100 transition-opacity" />
            <p className="text-sm text-gray-700 leading-relaxed flex-1">{line}</p>
          </div>
        ))}
      </div>
    </div>
  </div>
) 