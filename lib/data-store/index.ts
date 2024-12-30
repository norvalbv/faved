import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import * as schema from './schema'

// Initialize Postgres.js client
const client = postgres(process.env.DATABASE_URL!)

// Create drizzle database instance
export const drizzleDb = drizzle(client, { schema })

// Export schema types
export type * from './schema'
export * from './repositories' 