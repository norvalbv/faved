import { ReactElement } from 'react'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'
import { SubmissionRepository } from '@/lib/data-store/repositories/submission'
import { SubmissionThread } from '@/src/components/submissions/SubmissionThread'
import { Button } from '@/src/components/ui/button'
import { notFound } from 'next/navigation'
import { revalidatePath } from 'next/cache'

interface Props {
  params: {
    id: string
    submissionId: string
  }
}

async function approveSubmission(id: string, feedback: string) {
  'use server'
  await SubmissionRepository.updateStatus(id, 'approved', feedback)
  revalidatePath(`/campaigns/[id]/submissions/[submissionId]`)
}

async function requestChanges(id: string, feedback: string) {
  'use server'
  await SubmissionRepository.updateStatus(id, 'pending', feedback)
  revalidatePath(`/campaigns/[id]/submissions/[submissionId]`)
}

async function rejectSubmission(id: string, feedback: string) {
  'use server'
  await SubmissionRepository.updateStatus(id, 'rejected', feedback)
  revalidatePath(`/campaigns/[id]/submissions/[submissionId]`)
}

async function addFeedback(id: string, feedback: string) {
  'use server'
  await SubmissionRepository.addFeedback(id, feedback)
  revalidatePath(`/campaigns/[id]/submissions/[submissionId]`)
}

export default async function SubmissionPage({ params }: Props): Promise<ReactElement> {
  const submission = await SubmissionRepository.getById(params.submissionId)

  if (!submission) {
    notFound()
  }

  return (
    <div className="container max-w-4xl py-8">
      <div className="mb-8">
        <Link href={`/campaigns/${params.id}`}>
          <Button variant="ghost" size="sm" className="mb-4 -ml-4 h-8 gap-1">
            <ChevronLeft className="h-4 w-4" />
            Back to submissions
          </Button>
        </Link>
        <h1 className="mb-1 text-2xl font-semibold tracking-tight">
          {submission.metadata?.type || 'Submission'} Review
        </h1>
        <p className="text-sm text-muted-foreground">
          Review and provide feedback on this submission
        </p>
      </div>

      <SubmissionThread 
        submissions={[submission]} 
        onApprove={approveSubmission}
        onRequestChanges={requestChanges}
        onReject={rejectSubmission}
        onAddFeedback={addFeedback}
      />
    </div>
  )
} 