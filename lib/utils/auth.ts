// Mock auth for development
export function auth() {
  return {
    userId: 'mock-user-id',
    user: {
      id: 'mock-user-id',
      email: 'mock@example.com',
      name: 'Mock User',
      role: 'brand' as const
    }
  }
}

export function requireAuth(role?: 'brand' | 'influencer') {
  const mockAuth = auth()
  
  if (role && mockAuth.user.role !== role) {
    throw new Error(`Unauthorized: Requires ${role} role`)
  }

  return mockAuth.user
} 