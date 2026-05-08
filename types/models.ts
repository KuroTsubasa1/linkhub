// Shared client-side types. The server's Drizzle schema also exports
// $inferSelect / $inferInsert types, but those carry timestamps as Date
// (post-deserialization in the API JSON they become strings), so client
// code uses these explicit, JSON-safe interfaces instead.

export interface MyProfile {
  id: string
  username: string
  name: string
  email: string
  bio: string | null
  avatarUrl: string | null
}

export interface MyLink {
  id: string
  userId: string
  title: string
  url: string
  imageUrl: string | null
  position: number
  createdAt: string
  updatedAt: string
}

export interface NewLinkInput {
  title: string
  url: string
  imageUrl?: string | null
}

export interface LinkPatch {
  title?: string
  url?: string
  imageUrl?: string | null
  position?: number
}

export interface ProfileUpdate {
  username?: string
  name?: string
  bio?: string | null
  avatarUrl?: string | null
}

export interface PublicProfile {
  id: string
  username: string
  name: string
  bio: string | null
  avatarUrl: string | null
  links: PublicLink[]
}

export interface PublicLink {
  id: string
  title: string
  url: string
  imageUrl: string | null
  position: number
}
