import { ReactElement } from 'react'
import { Metadata } from 'next'
import { SubmissionRepository } from '@/lib/data-store/repositories/submission'
import { SubmissionList } from '@/src/components/submissions/submission-list'

interface Submission {
  id: string
  briefId: string
  type: 'video_topic' | 'draft_script' | 'draft_video' | 'live_video'
  content: string
  status: 'pending' | 'approved' | 'rejected'
  createdAt: Date
}

export const metadata: Metadata = {
  title: 'All Submissions | Content Review Platform',
  description: 'View and manage all content submissions',
}

export default async function SubmissionsPage(): Promise<ReactElement> {
  // In a real app, we would fetch all submissions
  const submissions = await SubmissionRepository.list()

  return (
    <main className="min-h-screen bg-[#FAFAFA]">
      <div className="py-8">
        <div className="faved-container">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold tracking-tight">All Submissions</h1>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <SubmissionList 
                submissions={submissions}
                links={submissions.map(s => ({
                  id: s.id,
                  href: `/briefs/${s.briefId}/submissions/${s.id}`
                }))}
              />
            </div>
          </div>
        </div>
      </div>
    </main>
  )
} 