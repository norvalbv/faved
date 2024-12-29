export interface Brief {
  id: string
  title: string
  description: string
  guidelines: string[]
  requirements: string[]
  brandSafetyGuidelines: string[]
  createdAt: Date
  updatedAt: Date
}

export interface BriefTemplate {
  id: string
  name: string
  description: string
  sections: {
    title: string
    content: string
  }[]
} 