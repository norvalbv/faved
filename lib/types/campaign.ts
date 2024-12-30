export interface Campaign {
  id: string
  title: string
  description: string
  status: 'active' | 'completed' | 'draft'
  metadata?: Record<string, unknown>
  createdAt: Date
  updatedAt: Date
} 