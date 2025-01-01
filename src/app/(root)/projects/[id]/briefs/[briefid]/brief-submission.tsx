'use client'

import { ReactElement, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/src/components/ui/button'
import { Textarea } from '@/src/components/ui/textarea'
import { FileUpload } from '@/src/components/FileUpload'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/src/components/ui/select'
import { createSubmission } from '@/lib/actions/submissions'
import { toast } from 'sonner'

interface Props {
  briefId: string
}

const SUBMISSION_TYPES = [
  { value: 'draft_script', label: 'Draft Script' },
  { value: 'draft_video', label: 'Draft Video' },
  { value: 'final_video', label: 'Final Video' },
] as const

type SubmissionType = typeof SUBMISSION_TYPES[number]['value']

export const BriefSubmissionForm = ({ briefId }: Props): ReactElement => {
  const router = useRouter()
  const [type, setType] = useState<SubmissionType>('draft_script')
  const [content, setContent] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (type !== 'draft_script' || !content.trim()) {
      return
    }
    
    setIsSubmitting(true)
    
    try {
      const result = await createSubmission({
        briefId,
        content,
        metadata: {
          type,
          message: content,
          stageId: '1',
          input: content,
          sender: 'Anonymous',
          submitted: true,
          feedbackHistory: []
        }
      })

      if (result.success) {
        setContent('')
        toast.success('Content submitted successfully')
        router.refresh()
        if (result.campaignId) {
          router.push(`/campaigns/${result.campaignId}`)
        }
      } else {
        toast.error(result.error || 'Failed to submit content')
      }
    } catch (error) {
      console.error('Error submitting content:', error)
      toast.error('Failed to submit content')
    } finally {
      setIsSubmitting(false)
    }
  }, [briefId, content, type, router])

  const handleUploadComplete = useCallback((campaignId: string) => {
    router.refresh()
    router.push(`/campaigns/${campaignId}`)
  }, [router])

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Submit Content</h3>
        <p className="text-sm text-muted-foreground">
          Submit your content for review. Make sure it aligns with the brief guidelines.
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

        {type === 'draft_script' ? (
          <div className="space-y-2">
            <label htmlFor="content" className="text-sm font-medium">
              Script Content
            </label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="min-h-[8rem] resize-none"
              placeholder="Enter your script here..."
              required
            />
          </div>
        ) : (
          <div className="space-y-2">
            <label className="text-sm font-medium">
              Upload {type === 'draft_video' ? 'Draft' : 'Final'} Video
            </label>
            <FileUpload 
              briefId={briefId} 
              onUploadComplete={handleUploadComplete}
              mode={type === 'draft_video' ? 'brief' : 'import'} 
            />
          </div>
        )}
      </div>

      {type === 'draft_script' && (
        <Button
          type="submit"
          disabled={isSubmitting || !content.trim()}
          className="w-full"
        >
          {isSubmitting ? 'Submitting...' : 'Submit for Review'}
        </Button>
      )}
    </form>
  )
} 