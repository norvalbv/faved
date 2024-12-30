interface BriefGuidelinesProps {
  guidelines: Array<{
    category: string
    items: string[]
  }>
}

export const BriefGuidelines = ({ guidelines }: BriefGuidelinesProps) => {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold tracking-tight">Guidelines</h2>
      <div className="space-y-8">
        {guidelines.map((guideline, index) => (
          <div key={index} className="space-y-4">
            <h3 className="text-lg font-medium">{guideline.category}</h3>
            <ul className="list-disc list-inside space-y-2">
              {guideline.items.map((item, itemIndex) => (
                <li key={itemIndex} className="text-sm text-gray-600">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  )
} 