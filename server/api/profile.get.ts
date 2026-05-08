import { eq } from 'drizzle-orm'
import { requireUser } from '../lib/session'
import { db } from '../db'
import { user as userTable } from '../db/schema'

export default defineEventHandler(async (event) => {
  const me = await requireUser(event)
  const [row] = await db
    .select({
      id: userTable.id,
      username: userTable.username,
      name: userTable.name,
      email: userTable.email,
      bio: userTable.bio,
      avatarUrl: userTable.avatarUrl,
    })
    .from(userTable)
    .where(eq(userTable.id, me.id))
    .limit(1)
  if (!row) throw createError({ statusCode: 404, statusMessage: 'User not found' })
  return row
})
