import type { Config } from 'drizzle-kit'
import 'dotenv/config'

export default {
  schema: './src/models/**/*.ts',
  out: './drizzle',
  dialect: 'mysql',
  dbCredentials: {
    url: process.env.DATABASE_URL as string
  }
} satisfies Config