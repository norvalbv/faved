'use client'

import { ReactElement, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { Button } from './ui/button'
import { cn } from '@/lib/utils'
import { Loader2 } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from './ui/alert'
import { createSubmission } from '@/lib/actions/submissions'
import type { SubmissionMetadata } from '@/lib/types/submission'

interface FileUploadProps {
  briefId: string
  onUploadComplete?: (campaignId: string) => void
  mode?: 'import' | 'submission'
  accept?: Record<string, string[]>
  submissionType?: 'draft_video' | 'final_video'
}

export const FileUpload = ({ 
  briefId, 
  onUploadComplete,
  mode = 'submission',
  accept = {
    'video/*': ['.mp4', '.mov', '.avi'],
    'image/*': ['.jpg', '.jpeg', '.png'],
    'application/pdf': ['.pdf']
  },
  submissionType = 'draft_video'
}: FileUploadProps): ReactElement => {
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [uploadedFileUrl, setUploadedFileUrl] = useState<string | null>(null)

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: mode === 'import' ? { 'text/csv': ['.csv'] } : accept,
    maxFiles: 1,
    disabled: isUploading,
    onDrop: async (files) => {
      if (files.length === 0) return

      setIsUploading(true)
      setError(null)

      try {
        const file = files[0]
        
        // TODO: Implement actual file upload logic here
        // For now, simulating with a fake URL
        const fakeUrl = `https://storage.example.com/${file.name}`
        setUploadedFileUrl(fakeUrl)

        // Create submission with the uploaded file URL
        const submissionResult = await createSubmission({
          briefId,
          content: fakeUrl,
          metadata: {
            type: submissionType,
            message: `Uploaded file: ${file.name}`,
            stageId: submissionType === 'draft_video' ? '2' : '3',
            input: fakeUrl,
            sender: 'Anonymous',
            submitted: true
          }
        })

        if (submissionResult.success && onUploadComplete) {
          onUploadComplete(submissionResult.campaignId || '')
        } else {
          setError(submissionResult.error || 'Failed to create submission')
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

      {uploadedFileUrl && !error && (
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