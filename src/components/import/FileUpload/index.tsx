'use client'

import { ReactElement, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { importSubmissions } from '@/lib/actions/import'
import { Button } from '@/src/components/ui/button'
import { cn } from '@/lib/utils'

export const FileUpload = (): ReactElement => {
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'text/csv': ['.csv'],
    },
    maxFiles: 1,
    onDrop: async (files) => {
      if (files.length === 0) return

      setIsUploading(true)
      setError(null)
      setSuccess(false)

      try {
        const result = await importSubmissions(files[0])
        if (result.success) {
          setSuccess(true)
        } else {
          setError(result.error || 'Failed to import file')
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
          'border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors',
          isDragActive ? 'border-primary bg-primary/5' : 'border-gray-200 hover:border-primary',
        )}
      >
        <input {...getInputProps()} />
        <div className="space-y-2">
          <p className="text-sm font-medium">
            {isDragActive ? 'Drop the file here' : 'Drag and drop your CSV file here'}
          </p>
          <Button type="button" variant="outline" disabled={isUploading}>
            {isUploading ? 'Uploading...' : 'Or click to select file'}
          </Button>
        </div>
      </div>

      {error && (
        <p className="text-sm text-red-500">{error}</p>
      )}

      {success && (
        <p className="text-sm text-green-500">File imported successfully!</p>
      )}
    </div>
  )
} 