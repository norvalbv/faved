export type UserRole = "admin" | "brand_manager" | "influencer"

export interface User {
  id: string
  email: string
  name: string
  role: UserRole
  createdAt: Date
  updatedAt: Date
}

export interface Profile {
  userId: string
  bio?: string
  avatar?: string
  socialLinks?: {
    platform: string
    url: string
  }[]
} 