'use client'

import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { importActivities } from '@/lib/actions/import'
import { Button } from '@/src/components/ui/button'
import { Card } from '@/src/components/ui/card'
import { Progress } from '@/src/components/ui/progress'
import { Upload } from 'lucide-react'

export const FileUpload = () => {
  const [isUploading, setIsUploading] = useState(false)
  const [progress, setProgress] = useState(0)

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    if (!file) return

    setIsUploading(true)
    setProgress(0)

    try {
      // Read file content
      const content = await file.text()
      setProgress(50)

      // Import activities
      await importActivities(content)
      setProgress(100)
    } catch (error) {
      console.error('Import failed:', error)
    } finally {
      setIsUploading(false)
    }
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv'],
    },
    maxFiles: 1,
  })

  return (
    <Card className="w-full mx-auto">
      <div
        {...getRootProps()}
        className={`
          border-2 border-dashed rounded-xl p-10 text-center cursor-pointer
          transition-all duration-200 ease-in-out
          ${isDragActive ? 'border-[#FF9F4A] bg-orange-50' : 'border-gray-200 hover:border-gray-300'}
          ${isUploading ? 'pointer-events-none opacity-50' : ''}
        `}
      >
        <input {...getInputProps()} />
        <div className="space-y-6">
          <div className="mx-auto w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center">
            <Upload className="w-6 h-6 text-[#FF9F4A]" />
          </div>
          {isDragActive ? (
            <div className="space-y-2">
              <p className="text-lg font-medium text-gray-900">Drop your file here</p>
              <p className="text-gray-500">Release to upload your CSV file</p>
            </div>
          ) : (
            <div className="space-y-2">
              <p className="text-lg font-medium text-gray-900">
                Drag and drop your CSV file
              </p>
              <p className="text-gray-500">
                or click to browse from your computer
              </p>
              <Button variant="outline" disabled={isUploading} className="mt-4">
                Select File
              </Button>
            </div>
          )}
        </div>
      </div>

      {isUploading && (
        <div className="mt-6 space-y-3 px-8 pb-8">
          <div className="flex justify-between text-sm text-gray-600">
            <span>Uploading...</span>
            <span>{progress}%</span>
          </div>
          <Progress value={progress} className="h-2" indicatorClassName="bg-[#FF9F4A]" />
        </div>
      )}
    </Card>
  )
} 