export interface Campaign {
  id: string
  title: string
  description: string
  status: 'active' | 'inactive'
  metadata: unknown
  createdAt: Date
  updatedAt: Date
} 