'use client'

import { ReactElement, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { importSubmissions } from '@/lib/actions/import'
import { Button } from '../../../components/ui/button'
import { cn } from '@/lib/utils'
import { Loader2 } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '../../../components/ui/alert'

export const FileUpload = (): ReactElement => {
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<any>(null)

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'text/csv': ['.csv'],
    },
    maxFiles: 1,
    disabled: isUploading,
    onDrop: async (files) => {
      if (files.length === 0) return

      setIsUploading(true)
      setError(null)
      setResult(null)

      try {
        const file = files[0]
        const fileContent = await file.text()
        const importResult = await importSubmissions(fileContent)
        
        if (importResult.success) {
          setResult(importResult)
        } else {
          setError(importResult.error || 'Failed to import file')
        }
      } catch (error) {
        console.error('Error uploading file:', error)
        setError('Failed to upload file')
      } finally {
        setIsUploading(false)
      }
    },
  })

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={cn(
          'border-2 border-dashed rounded-lg p-8 text-center transition-colors',
          isDragActive ? 'border-primary bg-primary/5' : 'border-muted-foreground/20 hover:border-primary',
          isUploading && 'opacity-50 cursor-not-allowed'
        )}
      >
        <input {...getInputProps()} />
        <div className="space-y-2">
          <p className="text-sm font-medium">
            {isDragActive ? 'Drop the file here' : 'Drag and drop your CSV file here'}
          </p>
          <Button type="button" variant="outline" disabled={isUploading}>
            {isUploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Uploading...
              </>
            ) : (
              'Or click to select file'
            )}
          </Button>
        </div>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {result && (
        <Alert variant={result.summary.failed > 0 ? 'warning' : 'success'}>
          <AlertTitle>Import Complete</AlertTitle>
          <AlertDescription>
            Successfully imported {result.summary.successful} submissions.
            {result.summary.failed > 0 && (
              <> Failed to import {result.summary.failed} submissions.</>
            )}
          </AlertDescription>
        </Alert>
      )}
    </div>
  )
} 