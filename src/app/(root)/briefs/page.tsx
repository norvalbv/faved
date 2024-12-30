import { ReactElement } from "react"
import { BriefCard } from "@/src/components/dashboard/brief-card"
import { listBriefs } from "@/lib/actions/briefs"

const BriefsPage = async (): Promise<ReactElement> => {
  const briefs = await listBriefs()

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Available Briefs</h1>
        <p className="text-muted-foreground mt-2">
          Select a brief to start your project
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {briefs.map((brief) => (
          <BriefCard key={brief.id} brief={brief} />
        ))}
      </div>
    </div>
  )
}

export default BriefsPage 