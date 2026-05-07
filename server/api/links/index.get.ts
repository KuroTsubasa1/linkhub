import { asc, eq } from 'drizzle-orm'
import { requireUser } from '../../lib/session'
import { db } from '../../db'
import { link } from '../../db/schema'

export default defineEventHandler(async (event) => {
  const me = await requireUser(event)
  return db
    .select()
    .from(link)
    .where(eq(link.userId, me.id))
    .orderBy(asc(link.position), asc(link.createdAt))
})
