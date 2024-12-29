import type { Config } from 'drizzle-kit'

export default {
  schema: './schema/**/*.ts',
  out: './drizzle',
  dialect: 'sqlite',
  verbose: true,
  strict: true
} satisfies Config 