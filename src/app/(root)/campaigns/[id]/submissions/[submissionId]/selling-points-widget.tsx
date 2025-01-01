import { ReactElement } from 'react'
import { Star, AlertOctagon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface SellingPointsWidgetProps {
  sellingPoints: {
    present: string[]
    missing: string[]
    effectiveness: number
  }
}

export const SellingPointsWidget = ({ sellingPoints }: SellingPointsWidgetProps): ReactElement => {
  const { present = [], missing = [], effectiveness = 0 } = sellingPoints || {}
  const hasPresent = present.length > 0
  const hasMissing = missing.length > 0

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div className={cn("rounded-lg overflow-hidden border shadow-sm bg-blue-50 border-blue-100")}>
        <div className={cn("px-4 py-2 flex items-center gap-2 font-medium text-sm text-blue-700 bg-blue-100")}>
          <Star className="h-4 w-4 text-blue-500 flex-shrink-0" />
          <span>Present</span>
        </div>
        <div className="p-4 space-y-3">
          {hasPresent ? (
            present.map((line, idx) => (
              <div key={idx} className="flex items-start gap-3 group">
                <div className="w-1 h-1 rounded-full mt-2 bg-current opacity-40 group-hover:opacity-100 transition-opacity" />
                <p className="text-sm text-gray-700 leading-relaxed flex-1">{line}</p>
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-500">No selling points identified</p>
          )}
        </div>
      </div>

      <div className={cn("rounded-lg overflow-hidden border shadow-sm bg-gray-50 border-gray-100")}>
        <div className={cn("px-4 py-2 flex items-center gap-2 font-medium text-sm text-gray-700 bg-gray-100")}>
          <AlertOctagon className="h-4 w-4 text-gray-500 flex-shrink-0" />
          <span>Missing</span>
        </div>
        <div className="p-4 space-y-3">
          {hasMissing ? (
            missing.map((line, idx) => (
              <div key={idx} className="flex items-start gap-3 group">
                <div className="w-1 h-1 rounded-full mt-2 bg-current opacity-40 group-hover:opacity-100 transition-opacity" />
                <p className="text-sm text-gray-700 leading-relaxed flex-1">{line}</p>
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-500">No missing selling points</p>
          )}
        </div>
      </div>
    </div>
  )
} 