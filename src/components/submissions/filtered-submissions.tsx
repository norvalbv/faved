"use client"

import { ReactElement } from 'react'
import { useState, useMemo } from 'react'
import { startOfToday, startOfWeek, startOfMonth, isAfter, formatDistanceToNow } from 'date-fns'
import type { Submission } from '@/src/types/submission'
import { SubmissionFilters } from './submission-filters'
import type { SubmissionType, SubmissionStatus } from '@/src/types/submission'

interface FilteredSubmissionsProps {
  submissions: Submission[]
}

type Filters = {
  type?: SubmissionType
  status?: SubmissionStatus
  dateRange?: 'today' | 'week' | 'month' | 'all'
}

export const FilteredSubmissions = ({ submissions }: FilteredSubmissionsProps): ReactElement => {
  const [filters, setFilters] = useState<Filters>({
    dateRange: 'all'
  })

  const filteredSubmissions = useMemo(() => {
    let filtered = submissions

    // Filter by date range
    if (filters.dateRange && filters.dateRange !== 'all') {
      const now = new Date()
      let startDate: Date

      switch (filters.dateRange) {
        case 'today':
          startDate = startOfToday()
          break
        case 'week':
          startDate = startOfWeek(now)
          break
        case 'month':
          startDate = startOfMonth(now)
          break
        default:
          return filtered
      }

      filtered = filtered.filter((submission) => isAfter(submission.createdAt, startDate))
    }

    // Filter by type
    if (filters.type) {
      filtered = filtered.filter((submission) => submission.type === filters.type)
    }

    // Filter by status
    if (filters.status) {
      filtered = filtered.filter((submission) => submission.status === filters.status)
    }

    return filtered
  }, [submissions, filters])

  return (
    <div className="space-y-6">
      <div className="rounded-lg border bg-card p-4">
        <SubmissionFilters onFilter={setFilters} />
      </div>
      <div className="space-y-4">
        {filteredSubmissions.map((submission) => (
          <div key={submission.id} className="rounded-lg border bg-card p-4">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm font-medium">{submission.type}</span>
              <span className="text-xs text-muted-foreground">
                {formatDistanceToNow(submission.createdAt, { addSuffix: true })}
              </span>
            </div>
            <p className="text-sm text-muted-foreground line-clamp-2">{submission.content}</p>
          </div>
        ))}
      </div>
    </div>
  )
} 