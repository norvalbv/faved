import postgres from 'postgres'
import fs from 'fs'
import path from 'path'

async function migrate() {
  console.log('🔄 Running migrations...')
  
  const client = postgres(process.env.DATABASE_URL!)
  
  try {
    // Read and execute migration file
    const migrationPath = path.join(process.cwd(), 'lib/data-store/drizzle/0001_fix_schema.sql')
    const migration = fs.readFileSync(migrationPath, 'utf8')
    
    await client.unsafe(migration)
    
    console.log('✅ Migrations completed!')
  } catch (error) {
    console.error('❌ Migration failed:', error)
    throw error
  } finally {
    await client.end()
  }
}

migrate().catch(console.error) 