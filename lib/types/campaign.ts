export interface Campaign {
  id: string
  title: string
  description: string
  status: 'active' | 'draft' | 'completed'
  briefId: string | null
  projectId: string | null
  metadata: Record<string, unknown> | null
  createdAt: Date
  updatedAt: Date
} 