import { Metadata } from "next"
import Link from "next/link"
import { BriefCard } from "@/src/components/dashboard/brief-card"
import { Button } from "@/src/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/src/components/ui/card"
import { Badge } from "@/src/components/ui/badge"
import { FileText } from "lucide-react"
import { listBriefs } from "@/lib/actions/briefs"
import { CampaignRepository } from "@/lib/data-store/repositories/campaign"
import { SubmissionRepository } from "@/lib/data-store/repositories/submission"
import type { SubmissionMetadata } from "@/lib/types/submission"

export const metadata: Metadata = {
  title: "Dashboard | Content Review Platform",
  description: "Manage and review content submissions",
}

export default async function HomePage(): Promise<React.ReactElement> {
  // Get briefs and recent campaigns with submissions
  const [briefs, campaigns, submissions] = await Promise.all([
    listBriefs(),
    CampaignRepository.list(),
    SubmissionRepository.list()
  ])

  // Only show the first 3 briefs on dashboard
  const recentBriefs = briefs.slice(0, 3)

  // Group submissions by campaign
  const submissionsByCampaign = submissions.reduce((acc, submission) => {
    const metadata = submission.metadata as SubmissionMetadata
    const campaignId = metadata?.campaignId || submission.campaignId
    if (!campaignId) return acc
    
    if (!acc[campaignId]) {
      acc[campaignId] = []
    }
    acc[campaignId].push(submission)
    return acc
  }, {} as Record<string, typeof submissions>)

  // Get recent campaigns with submissions
  const recentCampaigns = campaigns
    .filter(campaign => submissionsByCampaign[campaign.id]?.length > 0)
    .slice(0, 3)

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      {/* Briefs Section */}
      <section className="py-16">
        <div className="faved-container">
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <h2 className="text-2xl font-bold text-gray-900">Featured Briefs</h2>
                <p className="text-muted-foreground">
                  Start with one of these brand collaboration opportunities
                </p>
              </div>
              <Link href="/briefs">
                <Button variant="outline">View All Briefs</Button>
              </Link>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {recentBriefs.map((brief) => (
                <BriefCard key={brief.id} brief={brief} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Recent Campaigns */}
      <section className="py-16 bg-white">
        <div className="faved-container">
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <h2 className="text-2xl font-bold text-gray-900">Recent Campaigns</h2>
                <p className="text-muted-foreground">
                  Your latest content campaigns and submissions
                </p>
              </div>
              <Link href="/campaigns">
                <Button variant="outline">View All Campaigns</Button>
              </Link>
            </div>

            <div className="grid gap-4">
              {recentCampaigns.map(campaign => {
                const campaignSubmissions = submissionsByCampaign[campaign.id] || []
                const pendingCount = campaignSubmissions.filter(s => 
                  !(s.metadata as SubmissionMetadata)?.approved
                ).length
                const approvedCount = campaignSubmissions.filter(s => 
                  (s.metadata as SubmissionMetadata)?.approved
                ).length

                return (
                  <Link key={campaign.id} href={`/campaigns/${campaign.id}`}>
                    <Card className="transition-colors hover:bg-muted/50">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle>{campaign.title}</CardTitle>
                          <Badge variant={campaign.status === 'active' ? 'success' : 'secondary'}>
                            {campaign.status}
                          </Badge>
                        </div>
                        <CardDescription>{campaign.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1.5">
                            <FileText className="h-4 w-4" />
                            <span>{campaignSubmissions.length} submissions</span>
                          </div>
                          {campaignSubmissions.length > 0 && (
                            <>
                              <span>•</span>
                              <span>{approvedCount} approved</span>
                              <span>•</span>
                              <span>{pendingCount} pending</span>
                            </>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                )
              })}

              {recentCampaigns.length === 0 && (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-8 text-center">
                    <h3 className="mb-2 text-lg font-medium">No active campaigns</h3>
                    <p className="mb-4 text-sm text-muted-foreground">
                      Get started by creating your first campaign
                    </p>
                    <Link href="/campaigns/new">
                      <Button>Create Campaign</Button>
                    </Link>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
} 