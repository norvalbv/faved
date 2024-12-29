import Link from "next/link"
import { Brief } from "@/src/types/brief"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"
import { Button } from "../ui/button"

interface BriefCardProps {
  brief: Brief
}

export function BriefCard({ brief }: BriefCardProps): React.ReactElement {
  return (
    <Card variant="hover">
      <CardHeader>
        <CardTitle>{brief.title}</CardTitle>
        <CardDescription>
          {brief.type.split("_").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ")}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-gray-600 mb-6">{brief.description}</p>
        <Link href={`/briefs/${brief.id}`}>
          <Button variant="outline" className="w-full">
            View Brief
          </Button>
        </Link>
      </CardContent>
    </Card>
  )
} 