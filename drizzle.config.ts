import type { Config } from 'drizzle-kit'

const config: Config = {
  schema: './lib/data-store/schema/**/*.ts',
  out: './lib/data-store/drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    host: process.env.DB_HOST!,
    port: parseInt(process.env.DB_PORT || '5432'),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME!,
    ssl: process.env.NODE_ENV === 'production'  }
}

export default config