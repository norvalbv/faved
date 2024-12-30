export interface ProjectMetadata {
  platform?: string
  client?: string
  type?: string
}

export interface Project {
  id: string
  title: string
  description: string
  status: 'active' | 'completed' | 'draft'
  metadata: ProjectMetadata
  createdAt: Date
  updatedAt: Date
} 