import { eq } from 'drizzle-orm'
import { isValidUsername } from '~/types/validation'
import { requireUser } from '../lib/session'
import { db } from '../db'
import { user as userTable } from '../db/schema'

export default defineEventHandler(async (event) => {
  const me = await requireUser(event)
  const body = await readBody<{
    username?: string
    name?: string
    bio?: string | null
    avatarUrl?: string | null
  }>(event)

  const updates: Record<string, unknown> = {}
  if (typeof body.username === 'string') {
    if (!isValidUsername(body.username)) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Username must be 2-32 chars, letters/digits/_/- only',
      })
    }
    updates.username = body.username
  }
  if (typeof body.name === 'string') updates.name = body.name.trim()
  if (body.bio !== undefined) updates.bio = body.bio
  if (body.avatarUrl !== undefined) updates.avatarUrl = body.avatarUrl

  if (Object.keys(updates).length === 0) {
    throw createError({ statusCode: 400, statusMessage: 'No updates' })
  }

  try {
    const [updated] = await db
      .update(userTable)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(userTable.id, me.id))
      .returning({
        id: userTable.id,
        username: userTable.username,
        name: userTable.name,
        email: userTable.email,
        bio: userTable.bio,
        avatarUrl: userTable.avatarUrl,
      })
    return updated
  } catch (err: unknown) {
    if (
      typeof err === 'object'
      && err !== null
      && 'code' in err
      && (err as { code?: string }).code === '23505'
    ) {
      throw createError({ statusCode: 409, statusMessage: 'Username already taken' })
    }
    throw err
  }
})
