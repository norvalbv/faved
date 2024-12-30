import { ReactElement } from 'react'
import { SubmissionList } from '@/src/components/submissions/submission-list'
import { SubmissionDetail } from '@/src/components/submissions/submission-detail'
import { BriefSubmissionSection } from '@/src/components/submissions/brief-submission-section'
import { SubmissionRepository } from '@/lib/data-store/repositories/submission'
import { FeedbackRepository } from '@/lib/data-store/repositories/feedback'
import type { Feedback } from '@/lib/data-store/schema/feedback'

interface PageProps {
  params: {
    briefId: string
  }
}

export default async function SubmissionsPage({ params }: PageProps): Promise<ReactElement> {
  const submissions = await SubmissionRepository.list(params.briefId)
  const firstSubmission = submissions[0]
  
  let feedback: Feedback[] = []
  if (firstSubmission) {
    feedback = await FeedbackRepository.list(firstSubmission.id)
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      <div className="py-8">
        <div className="faved-container">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Submissions List */}
            <div className="lg:col-span-4">
              <div className="space-y-6">
                <BriefSubmissionSection briefId={params.briefId} />
                <div className="bg-white rounded-lg shadow p-6">
                  <h2 className="text-xl font-semibold mb-4">Submissions</h2>
                  <SubmissionList 
                    submissions={submissions}
                    links={[]}
                  />
                </div>
              </div>
            </div>

            {/* Submission Detail */}
            <div className="lg:col-span-8">
              {firstSubmission ? (
                <SubmissionDetail 
                  submission={firstSubmission}
                  feedback={feedback}
                  onApprove={() => {}}
                  onReject={() => {}}
                />
              ) : (
                <div className="bg-white rounded-lg shadow p-6 text-center text-gray-500">
                  No submissions yet
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 