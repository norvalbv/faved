'use client'

import { ReactElement } from 'react'
import { ImportanceWeights } from '@/lib/types/calibration'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/src/components/ui/select'
import { useCalibrationStore } from './store'
import { updateCalibrationWeights } from '@/lib/actions/calibration'
import { toast } from 'sonner'

const WEIGHT_OPTIONS = [
  { value: '0', label: 'Not Important' },
  { value: '0.25', label: 'Slightly Important' },
  { value: '0.5', label: 'Moderately Important' },
  { value: '0.75', label: 'Very Important' },
  { value: '1', label: 'Critical' },
] as const

const ASPECTS: Array<{ key: keyof ImportanceWeights; label: string }> = [
  { key: 'pronunciation', label: 'Pronunciation & Language' },
  { key: 'formatting', label: 'Formatting & Structure' },
  { key: 'content', label: 'Content Quality' },
  { key: 'brandAlignment', label: 'Brand Alignment' },
  { key: 'guidelines', label: 'Guidelines Adherence' },
]

export const ImportanceConfig = (): ReactElement => {
  const { weights, setWeights, selectedBriefId } = useCalibrationStore()

  const handleWeightChange = async (aspect: keyof ImportanceWeights, value: string) => {
    if (!selectedBriefId) {
      toast.error('Please select a brief type first')
      return
    }

    const newWeights = {
      ...weights,
      [aspect]: parseFloat(value)
    }

    // Update local state
    setWeights(newWeights)

    // Update database
    try {
      const result = await updateCalibrationWeights(selectedBriefId, newWeights)
      if (!result.success) {
        toast.error(result.message)
      }
    } catch (error) {
      console.error('Failed to update weights:', error)
      toast.error('Failed to save weights')
    }
  }

  return (
    <div className="grid gap-4">
      {ASPECTS.map(({ key, label }) => (
        <div key={key} className="grid grid-cols-2 gap-4 items-center">
          <label htmlFor={key} className="text-sm font-medium">
            {label}
          </label>
          <Select
            value={weights[key].toString()}
            onValueChange={(value: string) => handleWeightChange(key, value)}
          >
            <SelectTrigger id={key}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {WEIGHT_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      ))}
    </div>
  )
} 