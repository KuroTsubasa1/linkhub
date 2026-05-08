import { asc, eq } from 'drizzle-orm'
import { db } from '../../db'
import { link, user as userTable } from '../../db/schema'

export default defineEventHandler(async (event) => {
  const username = getRouterParam(event, 'username')
  if (!username) throw createError({ statusCode: 400, statusMessage: 'Missing username' })

  const [profile] = await db
    .select({
      id: userTable.id,
      username: userTable.username,
      name: userTable.name,
      bio: userTable.bio,
      avatarUrl: userTable.avatarUrl,
    })
    .from(userTable)
    .where(eq(userTable.username, username))
    .limit(1)

  if (!profile) throw createError({ statusCode: 404, statusMessage: 'User not found' })

  const links = await db
    .select({
      id: link.id,
      title: link.title,
      url: link.url,
      imageUrl: link.imageUrl,
      position: link.position,
    })
    .from(link)
    .where(eq(link.userId, profile.id))
    .orderBy(asc(link.position), asc(link.createdAt))

  return { ...profile, links }
})
