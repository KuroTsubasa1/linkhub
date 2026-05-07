import { and, eq } from 'drizzle-orm'
import { requireUser } from '../../lib/session'
import { db } from '../../db'
import { link } from '../../db/schema'

export default defineEventHandler(async (event) => {
  const me = await requireUser(event)
  const id = getRouterParam(event, 'id')
  if (!id) throw createError({ statusCode: 400, statusMessage: 'Missing id' })

  const body = await readBody<{
    title?: string
    url?: string
    imageUrl?: string | null
    position?: number
  }>(event)

  const updates: Record<string, unknown> = {}
  if (typeof body.title === 'string') updates.title = body.title.trim()
  if (typeof body.url === 'string') updates.url = body.url.trim()
  if (body.imageUrl !== undefined) updates.imageUrl = body.imageUrl
  if (typeof body.position === 'number') updates.position = body.position

  if (Object.keys(updates).length === 0) {
    throw createError({ statusCode: 400, statusMessage: 'No updates' })
  }

  const [updated] = await db
    .update(link)
    .set({ ...updates, updatedAt: new Date() })
    .where(and(eq(link.id, id), eq(link.userId, me.id)))
    .returning()

  if (!updated) throw createError({ statusCode: 404, statusMessage: 'Link not found' })
  return updated
})
