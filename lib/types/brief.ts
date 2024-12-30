export interface BriefMetadata {
  overview?: string | {
    what: string
    gettingStarted: string
  }
  guidelines?: Array<{
    category: string
    items: string[]
  }>
  collaborationTimeline?: Array<{
    step: number
    title: string
    description: string
  }>
  examples?: Array<{
    title: string
    url: string
  }>
  productionTools?: {
    title: string
    items: string[]
  }
  designProcess?: {
    title: string
    items: string[]
  }
  writingTools?: {
    title: string
    items: string[]
  }
  suggestions?: {
    title: string
    items: string[]
  }
}

export interface Brief {
  id: string
  projectId?: string | null
  title: string
  description: string
  type: 'game_design' | 'visual_creator' | 'filmmaking' | 'logo_design' | 'booktuber'
  metadata?: BriefMetadata
  createdAt: Date
  updatedAt: Date
} 