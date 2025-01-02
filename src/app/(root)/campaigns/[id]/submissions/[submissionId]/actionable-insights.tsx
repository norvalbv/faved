import { ReactElement } from 'react'
import { Card } from '@/src/components/ui/card'
import { Separator } from '@/src/components/ui/separator'
import { 
  Lightbulb,
  TrendingUp,
  Pencil,
  Settings,
  CheckCircle,
  AlertCircle,
  FileText,
  BarChart,
  History
} from 'lucide-react'
import { StructuredInsights, ActionableInsight } from '@/lib/data-store/schema/calibration'

interface ActionableInsightsProps {
  insights: StructuredInsights
}

const getIconForSection = (title: string): ReactElement => {
  const iconMap: Record<string, ReactElement> = {
    'Content Enhancement': <Lightbulb className="h-5 w-5 text-amber-500" />,
    'Brand Alignment': <TrendingUp className="h-5 w-5 text-blue-500" />,
    'Language and Style': <Pencil className="h-5 w-5 text-purple-500" />,
    'Impact and Effectiveness': <BarChart className="h-5 w-5 text-green-500" />,
    'Structure and Format': <FileText className="h-5 w-5 text-orange-500" />,
    'Key Strengths': <CheckCircle className="h-5 w-5 text-emerald-500" />,
    'Areas for Improvement': <AlertCircle className="h-5 w-5 text-rose-500" />
  }
  return iconMap[title] || <Settings className="h-5 w-5 text-gray-500" />
}

export const ActionableInsights = ({ insights }: ActionableInsightsProps): ReactElement => {
  if (!insights || !insights.sections?.length) {
    return (
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Actionable Insights</h3>
        <p className="text-sm text-muted-foreground">No actionable insights available.</p>
      </Card>
    )
  }

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Actionable Insights</h3>

      {/* Historical Context */}
      <div className="mb-6 p-4 bg-muted/50 rounded-lg">
        <div className="flex items-center gap-2 mb-2">
          <History className="h-5 w-5 text-blue-500" />
          <h4 className="font-medium">Historical Analysis</h4>
        </div>
        <p className="text-sm text-muted-foreground">{insights.historicalContext}</p>
      </div>

      {/* Insight Sections */}
      <div className="space-y-6">
        {insights.sections.map((section: ActionableInsight, index: number) => (
          <div key={section.title}>
            {index > 0 && <Separator className="my-4" />}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                {getIconForSection(section.title)}
                <h4 className="font-medium">{section.title}</h4>
              </div>

              {section.context && (
                <p className="text-sm text-muted-foreground pl-7">{section.context}</p>
              )}

              <ul className="space-y-3 pl-7">
                {section.points.map((point: string, i: number) => (
                  <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                    <span className="mt-1.5 text-primary">•</span>
                    <span className="flex-1">{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>

      {/* Metadata */}
      <div className="mt-6 pt-4 border-t text-xs text-muted-foreground">
        Analysis based on {insights.metadata.totalAnalyzed} submissions ({insights.metadata.approvedCount} approved)
      </div>
    </Card>
  )
}