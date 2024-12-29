"use client"

import { ReactElement } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/src/components/ui/card"
import { Button } from "@/src/components/ui/button"
import { FileUpload } from "@/src/components/import/FileUpload"

interface BriefSubmissionSectionProps {
  briefId: string
}

export const BriefSubmissionSection = ({ briefId }: BriefSubmissionSectionProps): ReactElement => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Submit Your Content</CardTitle>
        <CardDescription>
          Upload your content for review. We accept various file formats including images, videos, and documents.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h3 className="font-medium mb-2">Upload Files</h3>
          <FileUpload />
        </div>
        <div className="flex justify-end">
          <Button type="submit">Submit for Review</Button>
        </div>
      </CardContent>
    </Card>
  )
} 