export interface Brief {
  id: string
  title: string
  type: "game_design" | "visual_creator" | "filmmaking" | "logo_design" | "booktuber"
  description: string
  collaborationTimeline: CollaborationStep[]
  overview: {
    what: string
    gettingStarted: string
  }
  guidelines: BriefGuideline[]
  examples?: {
    title: string
    url: string
  }[]
  createdAt: Date
  updatedAt: Date
}

export interface CollaborationStep {
  step: number
  title: string
  description: string
}

export interface BriefGuideline {
  category: string
  items: string[]
} 