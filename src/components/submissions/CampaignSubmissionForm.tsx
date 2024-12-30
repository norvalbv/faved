'use client'

import { ReactElement, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/src/components/ui/button'
import { Textarea } from '@/src/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/src/components/ui/select'
import { createSubmission } from '@/lib/actions/submissions'
import type { SubmissionMetadata } from '@/lib/types/submission'

interface Props {
  campaignId: string
}

const SUBMISSION_TYPES = [
  { value: 'draft_script', label: 'Draft Script' },
  { value: 'draft_video', label: 'Draft Video' },
  { value: 'final_video', label: 'Final Video' },
] as const

type SubmissionType = typeof SUBMISSION_TYPES[number]['value']

export const CampaignSubmissionForm = ({ campaignId }: Props): ReactElement => {
  const router = useRouter()
  const [type, setType] = useState<SubmissionType>('draft_script')
  const [content, setContent] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)
    
    try {
      const metadata: SubmissionMetadata = {
        type,
        message: content,
        campaignId,
        stageId: type === 'draft_script' ? '1' : type === 'draft_video' ? '2' : '3',
        input: content,
        sender: 'Anonymous',
        submitted: true,
        id: '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }

      const result = await createSubmission({
        briefId: campaignId,
        type: 'submission',
        content,
        metadata
      })

      if (result.success) {
        setContent('')
        router.refresh()
      } else {
        setError(result.error || 'Failed to submit content')
      }
    } catch (error) {
      console.error('Error submitting content:', error)
      setError('Failed to submit content')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Submit Content</h3>
        <p className="text-sm text-muted-foreground">
          Submit your content for review. Make sure it aligns with the campaign guidelines.
        </p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">
            Submission Type
          </label>
          <Select
            value={type}
            onValueChange={(value: SubmissionType) => setType(value)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {SUBMISSION_TYPES.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label htmlFor="content" className="text-sm font-medium">
            Content
          </label>
          <Textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="min-h-[8rem] resize-none"
            placeholder="Enter your content here..."
            required
          />
        </div>
      </div>

      {error && (
        <p className="text-sm text-red-500">{error}</p>
      )}

      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full"
      >
        {isSubmitting ? 'Submitting...' : 'Submit for Review'}
      </Button>
    </form>
  )
} 