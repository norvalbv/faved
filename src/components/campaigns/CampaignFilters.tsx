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

export const CampaignFilters = (): ReactElement => {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const currentSort = (searchParams.get('sort') || 'date_desc') as SortOption
  const currentStatus = (searchParams.get('status') || 'all') as StatusOption

  const updateParams = (key: string, value: SortOption | StatusOption) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set(key, value)
    router.push(`?${params.toString()}`)
  }

  const clearFilters = () => {
    router.push('?');
  }

  const hasFilters = currentSort !== 'date_desc' || currentStatus !== 'all'

  return (
    <div className="flex items-center gap-2">
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