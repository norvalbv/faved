import { FileUpload } from '@/src/components/import/FileUpload'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/src/components/ui/card'

export default function ImportPage() {
  return (
    <div className="container py-10">
      <div className="max-w-3xl mx-auto space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tight">Import Data</h1>
          <p className="text-lg text-muted-foreground">
            Upload your CSV file to import activities data into the system.
          </p>
        </div>

        {/* Instructions */}
        <Card>
          <CardHeader>
            <CardTitle>CSV Format Requirements</CardTitle>
            <CardDescription>
              Your CSV file should include the following columns:
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-4 space-y-2 text-sm">
              <li><code>input</code> - The content of the submission</li>
              <li><code>feedback</code> - Any feedback provided</li>
              <li><code>message</code> - Action type (submitted/feedback/approved/rejected)</li>
              <li><code>brief_id</code> - The ID of the associated brief</li>
              <li><code>influencer_id</code> - The ID of the influencer</li>
              <li><code>timestamp</code> - When the action occurred</li>
            </ul>
          </CardContent>
        </Card>

        {/* Upload Section */}
        <FileUpload />
      </div>
    </div>
  )
} 