import type { Brief } from "@/types/brief"
import Link from "next/link"

interface BriefCardProps {
  brief: Brief
}

export const BriefCard = ({ brief }: BriefCardProps): React.ReactElement => {
  return (
    <Link
      href={`/briefs/${brief.id}`}
      className="group relative rounded-lg border bg-card p-6 transition-all hover:shadow-md"
    >
      <div className="space-y-2">
        <div className="space-y-1">
          <h3 className="font-semibold tracking-tight">{brief.title}</h3>
          <p className="text-sm text-muted-foreground">{brief.description}</p>
        </div>
        <div className="flex items-center text-sm text-muted-foreground">
          <span className="inline-flex items-center rounded-full bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
            {brief.type.split("_").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ")}
          </span>
        </div>
      </div>
    </Link>
  )
} 