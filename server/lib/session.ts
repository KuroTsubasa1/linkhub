import type { H3Event } from 'h3'
import { auth } from './auth'

export async function getSession(event: H3Event) {
  return auth.api.getSession({ headers: event.headers })
}

export async function requireUser(event: H3Event) {
  const session = await getSession(event)
  if (!session?.user) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  }
  return session.user
}
