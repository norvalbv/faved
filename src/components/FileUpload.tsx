'use client'

import { ReactElement, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { importSubmissions } from '@/lib/actions/import'
import { Button } from './ui/button'
import { cn } from '@/lib/utils'
import { Loader2 } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from './ui/alert'

interface FileUploadProps {
  briefId?: string
  onUploadComplete?: (url: string) => void
  mode?: 'import' | 'submission'
  accept?: Record<string, string[]>
}

export const FileUpload = ({ 
  briefId, 
  onUploadComplete,
  mode = 'submission',
  accept = {
    'video/*': ['.mp4', '.mov', '.avi'],
    'image/*': ['.jpg', '.jpeg', '.png'],
    'application/pdf': ['.pdf']
  }
}: FileUploadProps): ReactElement => {
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<any>(null)
  const [uploadedFileUrl, setUploadedFileUrl] = useState<string | null>(null)

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: mode === 'import' ? { 'text/csv': ['.csv'] } : accept,
    maxFiles: 1,
    disabled: isUploading,
    onDrop: async (files) => {
      if (files.length === 0) return

      setIsUploading(true)
      setError(null)
      setResult(null)

      try {
        const file = files[0]
        
        if (mode === 'import') {
          const fileContent = await file.text()
          const importResult = await importSubmissions(fileContent)
          
          if (importResult.success) {
            setResult(importResult)
          } else {
            setError(importResult.error || 'Failed to import file')
          }
        } else {
          // TODO: Implement actual file upload logic here
          // For now, simulating with a fake URL
          const fakeUrl = `https://storage.example.com/${file.name}`
          setUploadedFileUrl(fakeUrl)
          if (onUploadComplete) {
            onUploadComplete(fakeUrl)
          }
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
            {isDragActive 
              ? 'Drop the file here' 
              : mode === 'import' 
                ? 'Drag and drop your CSV file here'
                : 'Drag and drop your file here'}
          </p>
          <p className="text-xs text-muted-foreground">
            {mode === 'import' 
              ? 'Accepts CSV files'
              : 'Accepts video, image, and PDF files'}
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

      {mode === 'import' && result && (
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

      {mode === 'submission' && uploadedFileUrl && (
        <Alert>
          <AlertTitle>Upload Complete</AlertTitle>
          <AlertDescription>
            Your file has been uploaded successfully.
          </AlertDescription>
        </Alert>
      )}
    </div>
  )
} 