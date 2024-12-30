import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'

const connectionString = process.env.DATABASE_URL!

// Create a new connection pool with optimized settings
const client = postgres(connectionString, {
  max: 1, // Limit max connections
  idle_timeout: 10, // Close idle connections after 10 seconds
  max_lifetime: 60 * 10, // Connection lifetime of 10 minutes
  connect_timeout: 10, // Connection timeout of 10 seconds
  prepare: false, // Disable prepared statements
  ssl: { rejectUnauthorized: true }, // Enforce SSL
  onnotice: () => {}, // Ignore notice messages
  onparameter: () => {}, // Ignore parameter messages
  debug: false, // Disable debug logging
})

// Ensure connections are properly terminated when the app exits
process.on('beforeExit', () => {
  void client.end()
})

export const drizzleDb = drizzle(client) 