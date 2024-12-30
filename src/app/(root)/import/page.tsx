import { ReactElement } from 'react'
import { FileUpload } from '@/src/components/import/FileUpload'

export default function ImportPage(): ReactElement {
  return (
    <div className="container max-w-4xl py-8">
      <div className="mb-8">
        <h1 className="mb-2 text-2xl font-semibold tracking-tight">Import Submissions</h1>
        <p className="text-muted-foreground">
          Upload a CSV file containing your submissions data.
        </p>
      </div>

      <div className="mb-8 rounded-lg border bg-card p-6">
        <h2 className="mb-4 text-lg font-medium">CSV Format Requirements</h2>
        <p className="mb-4 text-sm text-muted-foreground">
          Your CSV file should include the following columns:
        </p>
        <div className="space-y-4">
          <div>
            <h3 className="mb-2 font-medium">Required Columns</h3>
            <ul className="list-inside list-disc space-y-2 text-sm text-muted-foreground">
              <li>
                <code className="text-primary">id</code>
                <span className="ml-2">Unique identifier for the submission</span>
              </li>
              <li>
                <code className="text-primary">input</code>
                <span className="ml-2">The content of the submission</span>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="mb-2 font-medium">Optional Columns</h3>
            <ul className="list-inside list-disc space-y-2 text-sm text-muted-foreground">
              <li>
                <code className="text-primary">userId</code>
                <span className="ml-2">The ID of the influencer</span>
              </li>
              <li>
                <code className="text-primary">campaignId</code>
                <span className="ml-2">The ID of the campaign</span>
              </li>
              <li>
                <code className="text-primary">offerId</code>
                <span className="ml-2">The ID of the offer</span>
              </li>
              <li>
                <code className="text-primary">sender</code>
                <span className="ml-2">Who sent the submission</span>
              </li>
              <li>
                <code className="text-primary">message</code>
                <span className="ml-2">Additional message</span>
              </li>
              <li>
                <code className="text-primary">type</code>
                <span className="ml-2">Type of submission</span>
              </li>
              <li>
                <code className="text-primary">stageId</code>
                <span className="ml-2">Stage of the submission</span>
              </li>
              <li>
                <code className="text-primary">dateInput</code>
                <span className="ml-2">Date of the submission</span>
              </li>
              <li>
                <code className="text-primary">attachments</code>
                <span className="ml-2">Any attached files</span>
              </li>
              <li>
                <code className="text-primary">submitted</code>
                <span className="ml-2">Whether the submission is submitted (true/false)</span>
              </li>
              <li>
                <code className="text-primary">approved</code>
                <span className="ml-2">Whether the submission is approved (true/false)</span>
              </li>
              <li>
                <code className="text-primary">feedback</code>
                <span className="ml-2">Feedback on the submission</span>
              </li>
              <li>
                <code className="text-primary">feedbackAttachments</code>
                <span className="ml-2">Files attached to feedback</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <FileUpload />
    </div>
  )
} 