'use client'

import { ReactElement } from 'react'
import { FileUpload } from '@/src/components/FileUpload'
import { Alert, AlertDescription } from '@/src/components/ui/alert'
import { useCalibrationStore } from './store'

export const UploadSection = (): ReactElement => {
  const { csvContent, setCsvContent } = useCalibrationStore()

  const handleFileRead = (content: string) => {
    setCsvContent(content)
  }

  return (
    <div className="space-y-4">
      <FileUpload 
        mode="historical"
        onUploadComplete={handleFileRead}
      />

      {csvContent && (
        <Alert>
          <AlertDescription>
            CSV file uploaded successfully. Configure weights below if needed, then click Process Data.
          </AlertDescription>
        </Alert>
      )}
    </div>
  )
} 