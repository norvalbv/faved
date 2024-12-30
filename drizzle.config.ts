import { defineConfig } from 'drizzle-kit'

export default defineConfig({
  schema: './lib/data-store/schema/**/*.ts',
  out: './lib/data-store/drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
})