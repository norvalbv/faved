import { FileUpload } from '@/src/components/import/FileUpload'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/src/components/ui/card'

export default function ImportPage() {
  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      <section className="py-16">
        <div className="faved-container">
          <div className="max-w-3xl mx-auto space-y-8">
            {/* Header */}
            <div className="text-center space-y-4">
              <h1 className="text-4xl font-bold text-gray-900">Import Data</h1>
              <p className="text-xl text-gray-600">
                Upload your CSV file to import activities data into the system.
              </p>
            </div>

            {/* Instructions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">CSV Format Requirements</CardTitle>
                <CardDescription className="text-base">
                  Your CSV file should include the following columns:
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="grid gap-3 text-gray-600">
                  <li className="flex items-center gap-2">
                    <code className="px-2 py-1 rounded bg-gray-100 text-gray-800">input</code>
                    <span>The content of the submission</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <code className="px-2 py-1 rounded bg-gray-100 text-gray-800">feedback</code>
                    <span>Any feedback provided</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <code className="px-2 py-1 rounded bg-gray-100 text-gray-800">message</code>
                    <span>Action type (submitted/feedback/approved/rejected)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <code className="px-2 py-1 rounded bg-gray-100 text-gray-800">brief_id</code>
                    <span>The ID of the associated brief</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <code className="px-2 py-1 rounded bg-gray-100 text-gray-800">influencer_id</code>
                    <span>The ID of the influencer</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <code className="px-2 py-1 rounded bg-gray-100 text-gray-800">timestamp</code>
                    <span>When the action occurred</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Upload Section */}
            <FileUpload />
          </div>
        </div>
      </section>
    </div>
  )
} 