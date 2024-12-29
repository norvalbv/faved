import type { Config } from 'drizzle-kit'

export default {
  schema: './schema/**/*.ts',
  out: './drizzle',
  verbose: true,
  strict: true,
  dialect: 'sqlite'
} satisfies Config 