export type UserRole = 'influencer' | 'brand'

export interface User {
  id: string
  email: string
  role: UserRole
  name: string
  createdAt: Date
  updatedAt: Date
}

export interface InfluencerProfile extends User {
  role: 'influencer'
  submissions: string[] // Submission IDs
  platforms: {
    type: 'youtube' | 'tiktok' | 'instagram'
    handle: string
  }[]
}

export interface BrandProfile extends User {
  role: 'brand'
  briefs: string[] // Brief IDs
  company: string
  website?: string
} 