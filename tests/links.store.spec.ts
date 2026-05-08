import { setActivePinia, createPinia } from 'pinia'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useLinksStore } from '~/stores/links'
import type { MyLink } from '~/types/models'

const sample = (overrides: Partial<MyLink> = {}): MyLink => ({
  id: '11111111-1111-1111-1111-111111111111',
  userId: 'u1',
  title: 'GitHub',
  url: 'https://github.com',
  imageUrl: null,
  position: 0,
  createdAt: '2026-05-07T00:00:00.000Z',
  updatedAt: '2026-05-07T00:00:00.000Z',
  ...overrides,
})

// Stub Nuxt's auto-imported $fetch globally for the store under test.
const fetchMock = vi.fn()
vi.stubGlobal('$fetch', fetchMock)

describe('useLinksStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    fetchMock.mockReset()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('starts empty and not loading', () => {
    const store = useLinksStore()
    expect(store.items).toEqual([])
    expect(store.isLoading).toBe(false)
    expect(store.error).toBeNull()
  })

  it('fetch() populates items and clears the loading flag', async () => {
    fetchMock.mockResolvedValueOnce([sample()])
    const store = useLinksStore()
    const promise = store.fetch()
    expect(store.isLoading).toBe(true)
    await promise
    expect(store.items).toHaveLength(1)
    expect(store.items[0].title).toBe('GitHub')
    expect(store.isLoading).toBe(false)
    expect(store.error).toBeNull()
  })

  it('create() appends the returned row', async () => {
    const created = sample({ id: '22222222-2222-2222-2222-222222222222', title: 'Twitter' })
    fetchMock.mockResolvedValueOnce(created)
    const store = useLinksStore()
    await store.create({ title: 'Twitter', url: 'https://twitter.com' })
    expect(store.items).toEqual([created])
  })

  it('update() replaces the matching item in place', async () => {
    const original = sample()
    const updated = { ...original, title: 'GitHub (renamed)' }
    fetchMock.mockResolvedValueOnce(updated)
    const store = useLinksStore()
    store.items = [original]
    await store.update(original.id, { title: 'GitHub (renamed)' })
    expect(store.items[0].title).toBe('GitHub (renamed)')
  })

  it('remove() filters the deleted id out', async () => {
    fetchMock.mockResolvedValueOnce({ ok: true })
    const store = useLinksStore()
    const a = sample({ id: 'a' })
    const b = sample({ id: 'b' })
    store.items = [a, b]
    await store.remove('a')
    expect(store.items.map((l) => l.id)).toEqual(['b'])
  })

  it('fetch() captures errors and re-throws', async () => {
    const err = new Error('boom')
    fetchMock.mockRejectedValueOnce(err)
    const store = useLinksStore()
    await expect(store.fetch()).rejects.toThrow('boom')
    expect(store.error).toBe('boom')
    expect(store.isLoading).toBe(false)
  })
})
