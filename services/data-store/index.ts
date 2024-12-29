import { drizzle } from 'drizzle-orm/better-sqlite3'
import { db } from './db'
import * as schema from './schema'

// Create drizzle database instance
export const drizzleDb = drizzle(db, { schema })

// Export both raw db and drizzle instance
export { db }

export type * from './schema'
export * from './repositories'
