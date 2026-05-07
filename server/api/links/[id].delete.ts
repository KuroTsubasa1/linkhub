import { and, eq } from 'drizzle-orm'
import { requireUser } from '../../lib/session'
import { db } from '../../db'
import { link } from '../../db/schema'

export default defineEventHandler(async (event) => {
  const me = await requireUser(event)
  const id = getRouterParam(event, 'id')
  if (!id) throw createError({ statusCode: 400, statusMessage: 'Missing id' })

  const [deleted] = await db
    .delete(link)
    .where(and(eq(link.id, id), eq(link.userId, me.id)))
    .returning({ id: link.id })

  if (!deleted) throw createError({ statusCode: 404, statusMessage: 'Link not found' })
  return { ok: true }
})
