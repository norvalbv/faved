import { Metadata } from "next"
import { notFound } from "next/navigation"
import { BriefDetails } from "@/app/components/briefs/brief-details"
import { GAME_DESIGN_BRIEF } from "@/app/constants/briefs"

interface BriefPageProps {
  params: {
    id: string
  }
}

// In a real app, this would be dynamic based on the brief
export const metadata: Metadata = {
  title: `${GAME_DESIGN_BRIEF.title} | Content Review Platform`,
  description: GAME_DESIGN_BRIEF.description,
}

export default function BriefPage({ params }: BriefPageProps): React.ReactElement {
  // For now, we only have the game design brief
  if (params.id !== GAME_DESIGN_BRIEF.id) {
    notFound()
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="mx-auto max-w-4xl">
        <BriefDetails brief={GAME_DESIGN_BRIEF} />
      </div>
    </main>
  )
} 