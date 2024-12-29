import { ReactElement } from "react"
import { Metadata } from "next"
import { notFound } from "next/navigation"
import { ALL_BRIEFS } from "@/src/constants/briefs"
import { BriefDetails } from "@/src/components/briefs/brief-details"
import { BriefSubmissionSection } from "@/src/components/submissions/brief-submission-section"
import { Brief } from "@/src/types/brief"

interface BriefPageProps {
  params: {
    id: string
  }
}

export async function generateMetadata({ params }: BriefPageProps): Promise<Metadata> {
  const brief = ALL_BRIEFS.find((b: Brief) => b.id === params.id)
  if (!brief) return { title: "Brief Not Found" }

  return {
    title: `${brief.title} | Content Review Platform`,
    description: brief.description,
  }
}

export default async function BriefPage({ params }: BriefPageProps): Promise<ReactElement> {
  const brief = ALL_BRIEFS.find((b: Brief) => b.id === params.id)
  
  if (!brief) {
    notFound()
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="mx-auto max-w-4xl">
        <div className="space-y-12">
          <BriefDetails brief={brief} />
          <BriefSubmissionSection briefId={brief.id} />
        </div>
      </div>
    </main>
  )
} 