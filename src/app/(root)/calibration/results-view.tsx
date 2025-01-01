'use client'

import { ReactElement } from 'react'
import { Badge } from '@/src/components/ui/badge'
import { useCalibrationStore } from './store'
import { ScrollArea } from '@/src/components/ui/scroll-area'
import { Card, CardContent } from '@/src/components/ui/card'

interface ProcessingDetail {
  id: string
  success: boolean
  error?: string
}

export const ResultsView = (): ReactElement => {
  const { results, csvContent } = useCalibrationStore()

  if (!results) {
    return (
      <div className="text-center text-muted-foreground py-8">
        No processing results available yet
      </div>
    )
  }

  const successCount = results.details.filter(d => d.success).length
  const failureCount = results.details.filter(d => !d.success).length

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-4">
        <Badge variant="default" className="text-lg">
          Total Processed: {results.details.length}
        </Badge>
        <Badge variant="success" className="text-lg">
          Success: {successCount}
        </Badge>
        <Badge variant="destructive" className="text-lg">
          Failed: {failureCount}
        </Badge>
      </div>

      <ScrollArea className="h-[400px] rounded-md border">
        <div className="p-4 space-y-4">
          {results.details.map((detail: ProcessingDetail) => {
            // Find the corresponding content in CSV
            const lines = csvContent?.split('\n') || []
            const contentLine = lines.find(line => line.includes(detail.id))
            const previewContent = contentLine?.split(',').slice(1).join(',').trim() || 'No content preview available'

            return (
              <Card
                key={detail.id}
                className={`${
                  detail.success ? 'bg-green-50/50' : 'bg-red-50/50'
                } transition-colors hover:bg-muted/50`}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">ID: {detail.id}</span>
                        <Badge variant={detail.success ? 'success' : 'destructive'}>
                          {detail.success ? 'Success' : 'Failed'}
                        </Badge>
                      </div>
                      <div className="text-sm text-muted-foreground line-clamp-2">
                        {previewContent}
                      </div>
                    </div>
                  </div>
                  {detail.error && (
                    <p className="mt-2 text-sm text-red-600">{detail.error}</p>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>
      </ScrollArea>
    </div>
  )
} 