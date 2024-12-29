"use client"

import { useState } from "react"
import type { SubmissionType, SubmissionStatus } from "@/app/types/submission"

interface SubmissionFilters {
  type?: SubmissionType
  status?: SubmissionStatus
  dateRange?: "today" | "week" | "month" | "all"
}

interface SubmissionFiltersProps {
  onFilter: (filters: SubmissionFilters) => void
}

const SUBMISSION_TYPES = [
  { value: "video_topic", label: "Video Topic" },
  { value: "draft_script", label: "Draft Script" },
  { value: "draft_video", label: "Draft Video" },
  { value: "live_video", label: "Live Video" },
] as const

const SUBMISSION_STATUSES = [
  { value: "pending", label: "Pending" },
  { value: "approved", label: "Approved" },
  { value: "rejected", label: "Rejected" },
] as const

const DATE_RANGES = [
  { value: "today", label: "Today" },
  { value: "week", label: "This Week" },
  { value: "month", label: "This Month" },
  { value: "all", label: "All Time" },
] as const

export const SubmissionFilters = ({ onFilter }: SubmissionFiltersProps): React.ReactElement => {
  const [filters, setFilters] = useState<SubmissionFilters>({
    dateRange: "all",
  })

  const handleFilterChange = (key: keyof SubmissionFilters, value: string | undefined) => {
    const newFilters = {
      ...filters,
      [key]: value === "all" ? undefined : value,
    }
    setFilters(newFilters)
    onFilter(newFilters)
  }

  return (
    <div className="flex flex-wrap gap-4">
      {/* Type Filter */}
      <div className="flex-1">
        <label htmlFor="type" className="block text-sm font-medium">
          Type
        </label>
        <select
          id="type"
          value={filters.type ?? "all"}
          onChange={(e) => handleFilterChange("type", e.target.value)}
          className="mt-1 w-full rounded-md border bg-background px-3 py-2 text-sm"
        >
          <option value="all">All Types</option>
          {SUBMISSION_TYPES.map((type) => (
            <option key={type.value} value={type.value}>
              {type.label}
            </option>
          ))}
        </select>
      </div>

      {/* Status Filter */}
      <div className="flex-1">
        <label htmlFor="status" className="block text-sm font-medium">
          Status
        </label>
        <select
          id="status"
          value={filters.status ?? "all"}
          onChange={(e) => handleFilterChange("status", e.target.value)}
          className="mt-1 w-full rounded-md border bg-background px-3 py-2 text-sm"
        >
          <option value="all">All Statuses</option>
          {SUBMISSION_STATUSES.map((status) => (
            <option key={status.value} value={status.value}>
              {status.label}
            </option>
          ))}
        </select>
      </div>

      {/* Date Range Filter */}
      <div className="flex-1">
        <label htmlFor="dateRange" className="block text-sm font-medium">
          Date Range
        </label>
        <select
          id="dateRange"
          value={filters.dateRange ?? "all"}
          onChange={(e) => handleFilterChange("dateRange", e.target.value)}
          className="mt-1 w-full rounded-md border bg-background px-3 py-2 text-sm"
        >
          {DATE_RANGES.map((range) => (
            <option key={range.value} value={range.value}>
              {range.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  )
} 