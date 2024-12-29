import { FileUpload } from '@/src/components/import/FileUpload'

export default function ImportPage() {
  return (
    <div className="container py-10">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold">Import Activities</h1>
          <p className="text-muted-foreground">
            Upload a CSV file containing activities data to import into the system.
          </p>
        </div>

        <FileUpload />
      </div>
    </div>
  )
} 