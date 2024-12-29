import type { Config } from 'drizzle-kit'

export default {
  schema: './schema.ts',
  out: './migrations',
  driver: 'd1-http',
  dbCredentials: {
    accountId: 'local.db',
    databaseId: '',
    token: ''
  },
} satisfies Config 