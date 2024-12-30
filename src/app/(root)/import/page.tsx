import { ReactElement } from 'react'
import { FileUpload } from '@/src/components/import/FileUpload'

const REQUIRED_COLUMNS = [
  { key: 'id', description: 'Unique identifier for the submission' },
  { key: 'input', description: 'The content of the submission' }
] as const

const OPTIONAL_COLUMNS = [
  { key: 'userId', description: 'The ID of the influencer' },
  { key: 'campaignId', description: 'The ID of the campaign' },
  { key: 'projectId', description: 'The ID of the company project. NOTE: This will default to Milanote in this demo project as the csv doesn\'t currently include this information' },
  { key: 'offerId', description: 'The ID of the offer' },
  { key: 'sender', description: 'Who sent the submission' },
  { key: 'message', description: 'Additional message' },
  { key: 'type', description: 'Type of submission' },
  { key: 'stageId', description: 'Stage of the submission' },
  { key: 'dateInput', description: 'Date of the submission' },
  { key: 'attachments', description: 'Any attached files' },
  { key: 'submitted', description: 'Whether the submission is submitted (true/false)' },
  { key: 'approved', description: 'Whether the submission is approved (true/false)' },
  { key: 'feedback', description: 'Feedback on the submission' },
  { key: 'feedbackAttachments', description: 'Files attached to feedback' }
] as const

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
              {REQUIRED_COLUMNS.map(({ key, description }) => (
                <li key={key}>
                  <code className="text-primary">{key}</code>
                  <span className="ml-2">{description}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="mb-2 font-medium">Optional Columns</h3>
            <ul className="list-inside list-disc space-y-2 text-sm text-muted-foreground">
              {OPTIONAL_COLUMNS.map(({ key, description }) => (
                <li key={key}>
                  <code className="text-primary">{key}</code>
                  <span className="ml-2">{description}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <FileUpload />
    </div>
  )
}