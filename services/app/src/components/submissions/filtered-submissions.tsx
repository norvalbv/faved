"use client"

import { useState, useMemo } from "react"
import { startOfToday, startOfWeek, startOfMonth, isAfter } from "date-fns"
import type { Submission } from "@/types/submission"
import { SubmissionFilters } from "./submission-filters"
import { SubmissionsList } from "./submissions-list"

interface FilteredSubmissionsProps {
  initialSubmissions: Submission[]
}

export const FilteredSubmissions = ({ initialSubmissions }: FilteredSubmissionsProps): React.ReactElement => {
  const [filteredSubmissions, setFilteredSubmissions] = useState(initialSubmissions)

  const handleFilter = useMemo(() => {
    return (filters: {
      type?: Submission["type"]
      status?: Submission["status"]
      dateRange?: "today" | "week" | "month" | "all"
    }) => {
      let filtered = initialSubmissions

      // Filter by type
      if (filters.type) {
        filtered = filtered.filter((submission) => submission.type === filters.type)
      }

      // Filter by status
      if (filters.status) {
        filtered = filtered.filter((submission) => submission.status === filters.status)
      }

      // Filter by date range
      if (filters.dateRange && filters.dateRange !== "all") {
        const now = new Date()
        let startDate: Date

        switch (filters.dateRange) {
          case "today":
            startDate = startOfToday()
            break
          case "week":
            startDate = startOfWeek(now)
            break
          case "month":
            startDate = startOfMonth(now)
            break
          default:
            startDate = now
        }

        filtered = filtered.filter((submission) => isAfter(submission.createdAt, startDate))
      }

      setFilteredSubmissions(filtered)
    }
  }, [initialSubmissions])

  return (
    <div className="space-y-6">
      <div className="rounded-lg border bg-card p-4">
        <SubmissionFilters onFilter={handleFilter} />
      </div>
      <SubmissionsList items={filteredSubmissions} />
    </div>
  )
} 