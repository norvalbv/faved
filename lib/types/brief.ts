export interface BriefMetadata {
  requirements: string[]
  tone: string[]
  keywords: string[]
  guidelines: Record<string, unknown>
  [key: string]: unknown
}

export interface Brief {
  id: string
  projectId: string | null
  title: string
  description: string
  type: string
  metadata: BriefMetadata
  createdAt: Date
  updatedAt: Date
} 