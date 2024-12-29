import { db } from '../index'

async function checkDatabase() {
  try {
    // Attempt to query the database
    const result = await db.query.briefs.findMany()
    console.log('Database connection successful')
    console.log(`Found ${result.length} briefs`)
  } catch (error) {
    console.error('Database check failed:', error)
    process.exit(1)
  }
}

checkDatabase() 