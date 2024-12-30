'use server'

import { auth } from '@clerk/nextjs/server'
import { db } from '~/services/data-store'
import type { User, UserRole } from '../types/user'
import { users } from '~/services/data-store/schema'
import { eq } from 'drizzle-orm'
import { nanoid } from 'nanoid'

export async function getCurrentUser(): Promise<User | null> {
  const { userId } = auth()
  if (!userId) return null

  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.clerkId, userId))

  return user || null
}

export async function createUserProfile(
  clerkId: string,
  email: string,
  name: string,
  role: UserRole,
  metadata: {
    company?: string
    website?: string
    platforms?: { type: string; handle: string }[]
  } = {}
) {
  const timestamp = new Date()
  const userId = nanoid()

  await db.insert(users).values({
    id: userId,
    clerkId,
    email,
    name,
    role,
    metadata: JSON.stringify(metadata),
    createdAt: timestamp,
    updatedAt: timestamp,
  })

  return {
    success: true,
    userId,
  }
}

export async function updateUserProfile(
  userId: string,
  data: Partial<{
    name: string
    email: string
    metadata: Record<string, unknown>
  }>
) {
  await db
    .update(users)
    .set({
      ...data,
      updatedAt: new Date(),
    })
    .where(eq(users.id, userId))

  return {
    success: true,
  }
}

export async function requireAuth(role?: UserRole) {
  const user = await getCurrentUser()
  if (!user) throw new Error('Unauthorized')
  if (role && user.role !== role) throw new Error('Forbidden')
  return user
} 