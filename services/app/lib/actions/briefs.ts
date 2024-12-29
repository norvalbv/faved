'use server'

import { auth } from '../utils/auth'
import { BriefRepository } from '../../../data-store/repositories/brief'

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

    return brief
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

    return briefs
  } catch (error) {
    console.error('Error fetching briefs:', error)
    throw error
  }
} 