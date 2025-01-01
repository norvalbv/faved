import { ReactElement } from 'react'
import { Progress } from '@/src/components/ui/progress'
import { Badge } from '@/src/components/ui/badge'
import { cn } from '@/lib/utils'
import { CheckCircle2, XCircle } from 'lucide-react'

interface QualityWidgetProps {
  contentQuality: {
    score: number
    clarity: number
    engagement: number
    confidence: number
    technicalAccuracy: number
    tone: string[]
    strengths: string[]
    improvements: string[]
  }
}

export const QualityWidget = ({ contentQuality }: QualityWidgetProps): ReactElement => {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="flex flex-col gap-1.5 p-3 rounded-lg bg-white border border-gray-100 shadow-sm">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-700">Overall Score</span>
            <span className={cn("text-sm font-semibold",
              contentQuality.score >= 80 ? "text-green-600" :
              contentQuality.score >= 60 ? "text-amber-600" :
              "text-red-600"
            )}>{contentQuality.score}/100</span>
          </div>
          <Progress 
            value={contentQuality.score} 
            className={cn("h-1.5",
              contentQuality.score >= 80 ? "bg-green-500" :
              contentQuality.score >= 60 ? "bg-amber-500" :
              "bg-red-500"
            )} 
          />
        </div>

        <div className="flex flex-col gap-1.5 p-3 rounded-lg bg-white border border-gray-100 shadow-sm">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-700">Clarity</span>
            <span className={cn("text-sm font-semibold",
              contentQuality.clarity >= 80 ? "text-green-600" :
              contentQuality.clarity >= 60 ? "text-amber-600" :
              "text-red-600"
            )}>{contentQuality.clarity}/100</span>
          </div>
          <Progress 
            value={contentQuality.clarity} 
            className={cn("h-1.5",
              contentQuality.clarity >= 80 ? "bg-green-500" :
              contentQuality.clarity >= 60 ? "bg-amber-500" :
              "bg-red-500"
            )} 
          />
        </div>

        <div className="flex flex-col gap-1.5 p-3 rounded-lg bg-white border border-gray-100 shadow-sm">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-700">Engagement</span>
            <span className={cn("text-sm font-semibold",
              contentQuality.engagement >= 80 ? "text-green-600" :
              contentQuality.engagement >= 60 ? "text-amber-600" :
              "text-red-600"
            )}>{contentQuality.engagement}/100</span>
          </div>
          <Progress 
            value={contentQuality.engagement} 
            className={cn("h-1.5",
              contentQuality.engagement >= 80 ? "bg-green-500" :
              contentQuality.engagement >= 60 ? "bg-amber-500" :
              "bg-red-500"
            )} 
          />
        </div>

        <div className="flex flex-col gap-1.5 p-3 rounded-lg bg-white border border-gray-100 shadow-sm">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-700">Technical Accuracy</span>
            <span className={cn("text-sm font-semibold",
              contentQuality.technicalAccuracy >= 80 ? "text-green-600" :
              contentQuality.technicalAccuracy >= 60 ? "text-amber-600" :
              "text-red-600"
            )}>{contentQuality.technicalAccuracy}/100</span>
          </div>
          <Progress 
            value={contentQuality.technicalAccuracy} 
            className={cn("h-1.5",
              contentQuality.technicalAccuracy >= 80 ? "bg-green-500" :
              contentQuality.technicalAccuracy >= 60 ? "bg-amber-500" :
              "bg-red-500"
            )} 
          />
        </div>
      </div>

      {contentQuality.tone.length > 0 && (
        <div className="rounded-lg border border-gray-100 shadow-sm bg-white overflow-hidden">
          <div className="px-4 py-2 bg-blue-50 border-b border-blue-100">
            <h4 className="text-sm font-medium text-blue-700">Detected Tone</h4>
          </div>
          <div className="p-4">
            <div className="flex flex-wrap gap-2">
              {contentQuality.tone.map((tone, i) => (
                <Badge key={i} variant="secondary" className="bg-blue-50 text-blue-700 hover:bg-blue-100">
                  {tone}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        {contentQuality.strengths.length > 0 && (
          <div className="rounded-lg border border-gray-100 shadow-sm bg-white overflow-hidden">
            <div className="px-4 py-2 bg-green-50 border-b border-green-100 flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-500" />
              <h4 className="text-sm font-medium text-green-700">Key Strengths</h4>
            </div>
            <div className="p-4">
              <ul className="space-y-2">
                {contentQuality.strengths.map((strength, i) => (
                  <li key={i} className="flex items-start gap-3 group">
                    <div className="w-1 h-1 rounded-full mt-2 bg-green-500 opacity-40 group-hover:opacity-100 transition-opacity" />
                    <p className="text-sm text-gray-600 leading-relaxed flex-1">{strength}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {contentQuality.improvements.length > 0 && (
          <div className="rounded-lg border border-gray-100 shadow-sm bg-white overflow-hidden">
            <div className="px-4 py-2 bg-red-50 border-b border-red-100 flex items-center gap-2">
              <XCircle className="h-4 w-4 text-red-500" />
              <h4 className="text-sm font-medium text-red-700">Areas for Improvement</h4>
            </div>
            <div className="p-4">
              <ul className="space-y-2">
                {contentQuality.improvements.map((improvement, i) => (
                  <li key={i} className="flex items-start gap-3 group">
                    <div className="w-1 h-1 rounded-full mt-2 bg-red-500 opacity-40 group-hover:opacity-100 transition-opacity" />
                    <p className="text-sm text-gray-600 leading-relaxed flex-1">{improvement}</p>
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