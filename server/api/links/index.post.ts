import { eq, sql } from 'drizzle-orm'
import { requireUser } from '../../lib/session'
import { db } from '../../db'
import { link } from '../../db/schema'

export default defineEventHandler(async (event) => {
  const me = await requireUser(event)
  const body = await readBody<{
    title: string
    url: string
    imageUrl?: string | null
  }>(event)

  const title = body.title?.trim()
  const url = body.url?.trim()
  if (!title) throw createError({ statusCode: 400, statusMessage: 'Title is required' })
  if (!url) throw createError({ statusCode: 400, statusMessage: 'URL is required' })

  // Place at the end of the user's link list.
  const [{ next }] = await db
    .select({ next: sql<number>`COALESCE(MAX(${link.position}) + 1, 0)` })
    .from(link)
    .where(eq(link.userId, me.id))

  const [created] = await db
    .insert(link)
    .values({
      userId: me.id,
      title,
      url,
      imageUrl: body.imageUrl ?? null,
      position: next,
    })
    .returning()

  return created
})
