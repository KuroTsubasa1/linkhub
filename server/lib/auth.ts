import { betterAuth } from 'better-auth'
import { drizzleAdapter } from '@better-auth/drizzle-adapter'
import { db } from '../db'

const secret = process.env.BETTER_AUTH_SECRET
if (!secret) {
  throw new Error('BETTER_AUTH_SECRET is not set.')
}

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL ?? 'http://localhost:3000',
  secret,
  database: drizzleAdapter(db, {
    provider: 'pg',
  }),
  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
  },
  user: {
    additionalFields: {
      username: {
        type: 'string',
        required: true,
        input: true,
      },
      bio: {
        type: 'string',
        required: false,
        input: false,
      },
      avatarUrl: {
        type: 'string',
        required: false,
        input: false,
        fieldName: 'avatar_url',
      },
    },
  },
})

export type Auth = typeof auth
