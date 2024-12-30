'use client'

import { ReactElement } from 'react'
import { formatDistanceToNow } from 'date-fns'
import type { Feedback } from '@/lib/data-store/schema/feedback'

interface FeedbackListProps {
  items: Feedback[]
}

export const FeedbackList = ({ items }: FeedbackListProps): ReactElement => {
  const getFeedbackTypeColor = (type: Feedback['type']) => {
    switch (type) {
      case 'approval':
        return 'text-green-600'
      case 'suggestion':
        return 'text-blue-600'
      default:
        return 'text-red-600'
    }
  }

  const getFeedbackTypeLabel = (type: Feedback['type']) => {
    switch (type) {
      case 'approval':
        return 'Approved'
      case 'suggestion':
        return 'Suggestion'
      default:
        return 'Rejected'
    }
  }

  return (
    <div className="space-y-4">
      {items.map((item) => (
        <div key={item.id} className="rounded-lg border bg-card p-4">
          <div className="mb-2 flex items-center justify-between">
            <span className={`text-sm font-medium ${getFeedbackTypeColor(item.type)}`}>
              {getFeedbackTypeLabel(item.type)}
            </span>
            <span className="text-xs text-muted-foreground">
              {formatDistanceToNow(item.createdAt, { addSuffix: true })}
            </span>
          </div>
          <p className="text-sm">{item.content}</p>
        </div>
      ))}
    </div>
  )
} 