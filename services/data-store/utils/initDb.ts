import { migrate } from 'drizzle-orm/better-sqlite3/migrator'
import { db } from '../index'

// Run migrations
migrate(db, { migrationsFolder: './drizzle' })

console.log('Database migrations completed successfully') 