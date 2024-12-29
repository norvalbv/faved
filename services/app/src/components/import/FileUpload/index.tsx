import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { importActivities } from '@/lib/actions/import'
import { Card } from '@/src/components/ui/card'
import { Progress } from '@/src/components/ui/progress'
import { Button } from '@/src/components/ui/button'

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
    <Card className="w-full max-w-xl mx-auto p-6">
      <div
        {...getRootProps()}
        className={`
          border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
          transition-colors duration-200 ease-in-out
          ${isDragActive ? 'border-primary bg-primary/5' : 'border-muted'}
          ${isUploading ? 'pointer-events-none opacity-50' : ''}
        `}
      >
        <input {...getInputProps()} />
        {isDragActive ? (
          <p className="text-lg">Drop the CSV file here...</p>
        ) : (
          <div className="space-y-4">
            <p className="text-lg">
              Drag and drop a CSV file here, or click to select
            </p>
            <Button variant="outline" disabled={isUploading}>
              Select File
            </Button>
          </div>
        )}
      </div>

      {isUploading && (
        <div className="mt-4 space-y-2">
          <Progress value={progress} />
          <p className="text-sm text-center text-muted-foreground">
            Importing activities...
          </p>
        </div>
      )}
    </Card>
  )
} 