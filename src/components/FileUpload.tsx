'use client'

import { ReactElement, useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { Cloud, File, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { importSubmissions } from '@/lib/actions/import'
import { Progress } from './ui/progress'
import { Button } from './ui/button'

interface FileUploadProps {
  mode?: 'import' | 'brief'
  onUploadComplete?: (url: string) => void
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
        // Handle brief file upload
        // TODO: Implement actual file upload logic
        const fakeUrl = `https://storage.example.com/${file.name}`
        setUploadProgress(50)
        
        if (onUploadComplete) {
          onUploadComplete(fakeUrl)
        }
        
        toast.success('File uploaded successfully')
        setUploadProgress(100)
      }
    } catch (error) {
      console.error('Error uploading file:', error)
      toast.error('Failed to upload file')
    } finally {
      setIsUploading(false)
      setUploadProgress(0)
    }
  }, [mode, onUploadComplete])

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
    <div className="grid gap-4">
      <div
        {...getRootProps()}
        className="relative grid cursor-pointer place-items-center gap-4 rounded-lg border-2 border-dashed border-gray-300 p-12 text-center transition-colors hover:bg-gray-50"
      >
        <input {...getInputProps()} />
        <div className="grid place-items-center gap-2">
          {isUploading ? (
            <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
          ) : (
            <Cloud className="h-8 w-8 text-gray-500" />
          )}
          <div className="grid gap-1">
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
          <Button type="button" size="sm" className="absolute bottom-4 opacity-60">
            Select File
          </Button>
        )}
      </div>

      {isUploading && (
        <div className="grid gap-2">
          <div className="flex items-center gap-2">
            <File className="h-4 w-4 text-blue-500" />
            <div className="flex-1 text-sm font-medium">
              {mode === 'import' ? 'Processing submissions...' : 'Uploading file...'}
            </div>
            <div className="text-xs text-gray-500">{Math.round(uploadProgress)}%</div>
          </div>
          <Progress value={uploadProgress} />
        </div>
      )}
    </div>
  )
} 