'use server'

import { auth } from '../utils/auth'
import { BriefRepository } from '../data-store/repositories/brief'
import type { Brief } from '@/lib/types/brief'

export async function getBrief(id: string) {
  try {
    // 1. Verify user is logged in
    const { userId } = auth()
    if (!userId) {
      throw new Error('Unauthorized')
    }

    // 2. Get brief
    const brief = await BriefRepository.getById(id)
    if (!brief) {
      throw new Error('Brief not found')
    }

    return transformBrief(brief)
  } catch (error) {
    console.error('Error fetching brief:', error)
    throw error
  }
}

export async function listBriefs() {
  try {
    // 1. Verify user is logged in
    const { userId } = auth()
    if (!userId) {
      throw new Error('Unauthorized')
    }

    // 2. Get briefs
    const briefs = await BriefRepository.list()
    return briefs.map(transformBrief)
  } catch (error) {
    console.error('Error fetching briefs:', error)
    throw error
  }
}

function transformBrief(brief: any): Brief {
  const metadata = brief.metadata as any
  return {
    id: brief.id,
    type: brief.type,
    title: brief.title,
    description: brief.description,
    overview: metadata.overview,
    guidelines: metadata.guidelines,
    collaborationTimeline: metadata.collaborationTimeline,
    examples: metadata.examples,
    ...(brief.type === 'filmmaking' && { productionTools: metadata.productionTools }),
    ...(brief.type === 'logo_design' && { designProcess: metadata.designProcess }),
    ...(brief.type === 'booktuber' && { writingTools: metadata.writingTools }),
    ...(brief.type === 'game_design' && { suggestions: metadata.suggestions }),
    createdAt: brief.createdAt,
    updatedAt: brief.updatedAt
  } as Brief
} 