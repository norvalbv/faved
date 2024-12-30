import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { Badge } from "./ui/badge"
import { FileText } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

interface BriefCardProps {
  brief: {
    id: string
    title: string
    description: string
    type: string
    projectId: string | null
    createdAt: Date
  }
}

export function BriefCard({ brief }: BriefCardProps): React.ReactElement | null {
  // Format the type for display (e.g., "game_design" -> "Game Design")
  const formattedType = brief.type
    .split("_")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")

  if (!brief.projectId) return null

  return (
    <Link href={`/projects/${brief.projectId}/briefs/${brief.id}`}>
      <Card className="h-full transition-all hover:shadow-md hover:border-primary/20">
        <CardHeader className="space-y-2">
          <div className="flex items-center justify-between">
            <Badge variant="outline" className="text-xs font-medium">
              {formattedType}
            </Badge>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <FileText className="h-3.5 w-3.5" />
              <span>Brief</span>
            </div>
          </div>
          <CardTitle className="text-lg leading-tight">
            {brief.title}
          </CardTitle>
          <CardDescription className="line-clamp-2 text-sm">
            {brief.description}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-xs text-muted-foreground">
            Created {formatDistanceToNow(new Date(brief.createdAt), { addSuffix: true })}
          </div>
        </CardContent>
      </Card>
    </Link>
  )
} 