export interface CollaborationStep {
  step: number
  title: string
  description: string
}

export interface BriefGuideline {
  category: string
  items: string[]
}

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

export interface GameDesignBrief extends Brief {
  type: "game_design"
  suggestions: {
    title: string
    items: string[]
  }
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