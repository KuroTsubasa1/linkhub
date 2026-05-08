import { defineStore } from 'pinia'
import type { LinkPatch, MyLink, NewLinkInput } from '~/types/models'

interface LinksState {
  items: MyLink[]
  isLoading: boolean
  error: string | null
}

export const useLinksStore = defineStore('links', {
  state: (): LinksState => ({
    items: [],
    isLoading: false,
    error: null,
  }),
  actions: {
    async fetch() {
      this.isLoading = true
      this.error = null
      try {
        this.items = await $fetch<MyLink[]>('/api/links')
      } catch (err: unknown) {
        this.error = readError(err, 'Failed to load links')
        throw err
      } finally {
        this.isLoading = false
      }
    },

    async create(input: NewLinkInput) {
      const created = await $fetch<MyLink>('/api/links', {
        method: 'POST',
        body: input,
      })
      this.items.push(created)
      return created
    },

    async update(id: string, patch: LinkPatch) {
      const updated = await $fetch<MyLink>(`/api/links/${id}`, {
        method: 'PATCH',
        body: patch,
      })
      const i = this.items.findIndex((l) => l.id === id)
      if (i !== -1) this.items[i] = updated
      return updated
    },

    async remove(id: string) {
      await $fetch(`/api/links/${id}`, { method: 'DELETE' })
      this.items = this.items.filter((l) => l.id !== id)
    },

    reset() {
      this.items = []
      this.isLoading = false
      this.error = null
    },
  },
})

function readError(err: unknown, fallback: string): string {
  if (typeof err === 'object' && err !== null) {
    const maybe = err as { statusMessage?: string; message?: string }
    return maybe.statusMessage ?? maybe.message ?? fallback
  }
  return fallback
}
