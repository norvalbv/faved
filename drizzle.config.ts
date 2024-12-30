import type { Config } from 'drizzle-kit'

export default {
  schema: './lib/data-store/schema/**/*.ts',
  out: './lib/data-store/drizzle',
  driver: 'pg',
  dbCredentials: {
    connectionString: process.env.DATABASE_URL!
  }
} satisfies Config 