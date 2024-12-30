'use client'

import { ReactElement, useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { Cloud, File, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { importSubmissions } from '@/lib/actions/import'
import { createSubmission } from '@/lib/actions/submissions'
import { Progress } from './ui/progress'
import { Button } from './ui/button'

interface FileUploadProps {
  mode?: 'import' | 'brief'
  onUploadComplete?: (campaignId: string) => void
  briefId?: string
}

export const FileUpload = ({ 
  mode = 'import',
  onUploadComplete,
  briefId 
}: FileUploadProps): ReactElement => {
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    try {
      const file = acceptedFiles[0]
      if (!file) return

      setIsUploading(true)
      setUploadProgress(0)

      if (mode === 'import') {
        // Handle CSV import
        if (file.type !== 'text/csv' && !file.name.endsWith('.csv')) {
          toast.error('Please upload a CSV file')
          return
        }

        // Read file content
        const content = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader()
          reader.onload = (e) => resolve(e.target?.result as string)
          reader.onerror = (e) => reject(e)
          reader.onprogress = (e) => {
            if (e.lengthComputable) {
              setUploadProgress((e.loaded / e.total) * 100)
            }
          }
          reader.readAsText(file)
        })

        // Import submissions
        const result = await importSubmissions(content)
        
        if (result.success) {
          toast.success(result.message)
          
          // Show details of any failures
          const failures = result.details.filter(r => !r.success)
          if (failures.length > 0) {
            failures.forEach(failure => {
              toast.error(`Row ${failure.id}: ${failure.error}`)
            })
          }
        } else {
          toast.error(result.message)
        }
      } else {
        // Create submission with file URL
        const metadata = {
          type: file.type.startsWith('video/') ? 'draft_video' : 'draft_script',
          message: file.name,
          stageId: '1',
          input: file.name,
          sender: 'Anonymous',
          submitted: true,
          feedbackHistory: []
        }

        const submissionResult = await createSubmission({
          briefId: briefId || '',
          content: file.name,
          metadata
        })

        if (submissionResult.success && submissionResult.campaignId) {
          if (onUploadComplete) {
            onUploadComplete(submissionResult.campaignId)
          }
          toast.success('File uploaded successfully')
        } else {
          toast.error('Failed to create submission')
        }
      }
    } catch (error) {
      console.error('Error uploading file:', error)
      toast.error('Failed to upload file')
    } finally {
      setIsUploading(false)
      setUploadProgress(0)
    }
  }, [mode, onUploadComplete, briefId])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: mode === 'import' 
      ? { 'text/csv': ['.csv'] }
      : {
          'video/*': ['.mp4', '.mov', '.avi'],
          'audio/*': ['.mp3', '.wav'],
          'image/*': ['.jpg', '.jpeg', '.png', '.gif'],
          'application/pdf': ['.pdf']
        },
    maxFiles: 1,
    multiple: false
  })

  return (
    <div className="grid gap-2">
      <div
        {...getRootProps()}
        className="relative flex cursor-pointer flex-col items-center justify-center gap-4 p-6 rounded-xl border-2 border-dashed border-gray-200 bg-secondary py-6 text-center transition-all hover:border-primary/50 hover:bg-secondary/80"
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center gap-1">
          {isUploading ? (
            <Loader2 className="size-8 animate-spin text-primary" />
          ) : (
            <Cloud className="size-8 text-primary" />
          )}
          <div className="flex flex-col gap-0.5">
            <p className="text-sm font-medium text-gray-900">
              {isDragActive 
                ? 'Drop your file here' 
                : mode === 'import'
                  ? 'Drag & drop your CSV file here'
                  : 'Drag & drop your file here'}
            </p>
            <p className="text-xs text-gray-500">
              {mode === 'import' 
                ? 'CSV files only, up to 10MB'
                : 'Video, audio, image, or PDF files, up to 100MB'}
            </p>
          </div>
        </div>
        {!isUploading && (
          <Button 
            type="button" 
            size="sm" 
            className="bg-primary text-white hover:bg-primary/90"
          >
            Select File
          </Button>
        )}
      </div>

      {isUploading && (
        <div className="grid gap-1.5">
          <div className="flex items-center gap-2">
            <File className="h-4 w-4 text-primary" />
            <div className="flex-1 text-sm font-medium text-gray-900">
              {mode === 'import' ? 'Processing submissions...' : 'Uploading file...'}
            </div>
            <div className="text-xs text-gray-500">{Math.round(uploadProgress)}%</div>
          </div>
          <Progress value={uploadProgress} className="h-1.5 bg-secondary" />
        </div>
      )}
    </div>
  )
} 