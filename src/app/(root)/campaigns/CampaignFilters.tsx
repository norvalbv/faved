'use client'

import { ReactElement } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/src/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/src/components/ui/select'
import { ArrowDownAZ, ArrowUpAZ, Clock } from 'lucide-react'

type SortOption = 'title_asc' | 'title_desc' | 'date_desc' | 'date_asc'
type StatusOption = 'all' | 'active' | 'inactive'
type ProjectOption = 'all' | string
type BriefTypeOption = 'all' | 'game_design' | 'visual_creator' | 'filmmaking' | 'logo_design' | 'booktuber'

const SORT_OPTIONS = [
  { value: 'title_asc' as const, label: 'Title A-Z', icon: ArrowDownAZ },
  { value: 'title_desc' as const, label: 'Title Z-A', icon: ArrowUpAZ },
  { value: 'date_desc' as const, label: 'Newest First', icon: Clock },
  { value: 'date_asc' as const, label: 'Oldest First', icon: Clock },
]

const STATUS_OPTIONS = [
  { value: 'all' as const, label: 'All Status' },
  { value: 'active' as const, label: 'Active' },
  { value: 'draft' as const, label: 'Draft' },
  { value: 'completed' as const, label: 'Completed' },
]

interface Props {
  projects: Array<{
    id: string
    title: string
  }>
  briefs: Array<{
    id: string
    title: string
    type: BriefTypeOption
  }>
}

export const CampaignFilters = ({ projects, briefs }: Props): ReactElement => {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const currentSort = (searchParams.get('sort') || 'date_desc') as SortOption
  const currentStatus = (searchParams.get('status') || 'all') as StatusOption
  const currentProjectId = (searchParams.get('projectId') || 'all') as ProjectOption
  const currentBriefType = (searchParams.get('briefType') || 'all') as BriefTypeOption
  const currentBriefId = (searchParams.get('briefId') || 'all') as string

  const updateParams = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set(key, value)
    router.push(`?${params.toString()}`)
  }

  const clearFilters = () => {
    router.push('?')
  }

  const hasFilters = currentSort !== 'date_desc' || 
                    currentStatus !== 'all' || 
                    currentProjectId !== 'all' || 
                    currentBriefType !== 'all' ||
                    currentBriefId !== 'all'

  const filteredBriefs = currentBriefType === 'all' 
    ? Array.from(new Map(briefs.map(brief => [brief.title, brief])).values())
    : Array.from(new Map(briefs.filter(brief => brief.type === currentBriefType).map(brief => [brief.title, brief])).values())

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Select
        value={currentSort}
        onValueChange={(value: SortOption) => updateParams('sort', value)}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {SORT_OPTIONS.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              <div className="flex items-center gap-2">
                <option.icon className="h-4 w-4" />
                <span>{option.label}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={currentStatus}
        onValueChange={(value: StatusOption) => updateParams('status', value)}
      >
        <SelectTrigger className="w-[140px]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {STATUS_OPTIONS.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={currentProjectId}
        onValueChange={(value: ProjectOption) => updateParams('projectId', value)}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="All Projects" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Projects</SelectItem>
          {projects.map((project) => (
            <SelectItem key={project.id} value={project.id}>
              {project.title}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={currentBriefId}
        onValueChange={(value) => updateParams('briefId', value)}
      >
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder="All Briefs" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Briefs</SelectItem>
          {filteredBriefs.map((brief) => (
            <SelectItem key={brief.id} value={brief.id}>
              {brief.title}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {hasFilters && (
        <Button
          variant="ghost"
          size="sm"
          onClick={clearFilters}
        >
          Clear
        </Button>
      )}
    </div>
  )
}