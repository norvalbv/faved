import type { BriefGuideline } from "@/app/types/brief"

interface BriefGuidelinesProps {
  guidelines: BriefGuideline[]
}

export const BriefGuidelines = ({ guidelines }: BriefGuidelinesProps): React.ReactElement => {
  return (
    <div className="space-y-6">
      {guidelines.map((guideline, index) => (
        <div key={index} className="space-y-3">
          <h3 className="text-lg font-medium">{guideline.category}</h3>
          <ul className="list-disc space-y-2 pl-5">
            {guideline.items.map((item, itemIndex) => (
              <li key={itemIndex} className="text-muted-foreground">
                {item}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  )
} 