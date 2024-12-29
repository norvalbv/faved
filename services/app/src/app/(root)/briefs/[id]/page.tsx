import { Metadata } from "next"
import { notFound } from "next/navigation"
import { BriefDetails } from "@/src/components/briefs/brief-details"
import { GAME_DESIGN_BRIEF } from "@/src/constants/briefs"
import { BriefSubmissionSection } from "@/src/components/submissions/brief-submission-section"

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

export default async function BriefPage({ params }: BriefPageProps): Promise<React.ReactElement> {
  // For now, we only have the game design brief
  const briefId = await Promise.resolve(params.id)
  
  if (briefId !== GAME_DESIGN_BRIEF.id) {
    notFound()
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="mx-auto max-w-4xl">
        <div className="space-y-12">
          <BriefDetails brief={GAME_DESIGN_BRIEF} />
          <BriefSubmissionSection briefId={GAME_DESIGN_BRIEF.id} />
        </div>
      </div>
    </main>
  )
} 