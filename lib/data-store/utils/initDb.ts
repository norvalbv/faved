import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import { migrate } from 'drizzle-orm/postgres-js/migrator'
import { join } from 'path'

const connectionString = process.env.DATABASE_URL!
const client = postgres(connectionString)
export const db = drizzle(client)

export async function initDb() {
  try {
    console.log('Initializing database...')
    
    await migrate(db, {
      migrationsFolder: join(process.cwd(), 'drizzle'),
    })

    console.log('✅ Database initialized successfully')
    return db
  } catch (error) {
    console.error('❌ Failed to initialize database:', error)
    throw error
  }
} 