import { drizzle } from 'drizzle-orm/node-postgres'
import { Pool } from 'pg'
import * as schema from './schema'

const databaseUrl = process.env.DATABASE_URL
if (!databaseUrl) {
  throw new Error('DATABASE_URL is not set. Copy .env.example to .env and fill it in.')
}

const pool = new Pool({ connectionString: databaseUrl })

export const db = drizzle(pool, { schema })
export { schema }
