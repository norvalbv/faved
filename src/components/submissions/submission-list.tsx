'use client'

import { ReactElement } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card'
import { Badge } from '@/src/components/ui/badge'
import { formatDistanceToNow } from 'date-fns'

interface SubmissionListProps {
  submissions: Array<{
    id: string
    type: 'video_topic' | 'draft_script' | 'draft_video' | 'live_video'
    content: string
    status: 'pending' | 'approved' | 'rejected'
    createdAt: Date
  }>
  links: Array<{
    id: string
    href: string
  }>
}

export const SubmissionList = ({ submissions, links }: SubmissionListProps): ReactElement => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-500'
      case 'rejected':
        return 'bg-red-500'
      default:
        return 'bg-yellow-500'
    }
  }

  const getTypeLabel = (type: string) => {
    return type.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
  }

  return (
    <div className="space-y-4">
      {submissions.map((submission) => {
        const link = links.find(l => l.id === submission.id)
        return (
          <Link key={submission.id} href={link?.href || '#'}>
            <Card className="cursor-pointer hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">
                    {getTypeLabel(submission.type)}
                  </CardTitle>
                  <Badge className={getStatusColor(submission.status)}>
                    {submission.status.charAt(0).toUpperCase() + submission.status.slice(1)}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 line-clamp-2">{submission.content}</p>
                <p className="text-xs text-gray-400 mt-2">
                  Submitted {formatDistanceToNow(submission.createdAt, { addSuffix: true })}
                </p>
              </CardContent>
            </Card>
          </Link>
        )
      })}
    </div>
  )
} 