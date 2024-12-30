import { drizzle } from 'drizzle-orm/vercel-postgres'
import { sql } from '@vercel/postgres'

let db: ReturnType<typeof drizzle> | null = null

// Only initialize the database on the server side
const getDb = async () => {
  if (typeof window !== 'undefined') {
    throw new Error('Cannot use database on the client side')
  }

  // Return existing instance if already initialized
  if (db) return db

  // Initialize Drizzle with Vercel Postgres
  db = drizzle(sql)
  return db
}

export { getDb } 