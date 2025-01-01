'use client';

import { ReactElement } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/src/components/ui/card'
import { Button } from '@/src/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/src/components/ui/select'
import { UploadSection } from './upload-section'
import { ImportanceConfig } from './importance-config'
import { ResultsView } from './results-view'
import { useCalibrationStore } from './store'
import { importCalibrationData } from '@/lib/actions/calibration'
import { toast } from 'sonner'
import { ALL_BRIEFS } from '@/lib/constants/briefs'

export default function CalibrationPage(): ReactElement {
  const { csvContent, isProcessing, setIsProcessing, weights, selectedBriefId, setSelectedBriefId, setResults } = useCalibrationStore()

  const handleProcess = async () => {
    if (!csvContent) {
      toast.error('Please upload a CSV file first')
      return
    }

    if (!selectedBriefId) {
      toast.error('Please select a brief type first')
      return
    }

    try {
      setIsProcessing(true)
      const result = await importCalibrationData(csvContent, selectedBriefId)
      setResults(result)
      
      if (result.success) {
        toast.success(result.message)

        // Show details of any failures
        const failures = result.details.filter(r => !r.success)
        if (failures.length > 0) {
          failures.forEach(failure => {
            toast.error(`Row ${failure.id}: ${failure.error}`)
          })
        }
      } else {
        toast.error(result.message)
      }
    } catch (error) {
      console.error('Error processing data:', error)
      toast.error('Failed to process data')
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold">AI Calibration</h1>
        <p className="text-muted-foreground">
          Upload historical data to improve AI analysis accuracy
        </p>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Step 1: Select Brief Type</CardTitle>
            <CardDescription>
              Choose the brief type to calibrate the AI for
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Select
              value={selectedBriefId || undefined}
              onValueChange={(value: string) => setSelectedBriefId(value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a brief type" />
              </SelectTrigger>
              <SelectContent>
                {ALL_BRIEFS.map((brief) => (
                  <SelectItem key={brief.id} value={brief.id}>
                    {brief.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        {selectedBriefId && (
          <Card>
            <CardHeader>
              <CardTitle>Step 2: Upload Historical Data</CardTitle>
              <CardDescription>
                Upload CSV files containing historical submission data
              </CardDescription>
            </CardHeader>
            <CardContent>
              <UploadSection />
            </CardContent>
          </Card>
        )}

        {csvContent && selectedBriefId && (
          <Card>
            <CardHeader>
              <CardTitle>Step 3: Configure Analysis Weights</CardTitle>
              <CardDescription>
                Adjust importance of different aspects in the analysis
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ImportanceConfig />
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Processing Results</CardTitle>
            <CardDescription>
              View the results of historical data processing
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResultsView />
          </CardContent>
        </Card>

        {csvContent && selectedBriefId && (
          <div className="flex justify-end">
            <Button
              size="lg"
              disabled={isProcessing || !csvContent || !selectedBriefId}
              onClick={handleProcess}
              className="bg-primary text-white hover:bg-primary/90"
            >
              {isProcessing ? (
                <>
                  <span className="animate-spin mr-2">⚪</span>
                  Processing...
                </>
              ) : (
                'Process Historical Data'
              )}
            </Button>
          </div>
        )}
      </div>
    </div>
  )
} 