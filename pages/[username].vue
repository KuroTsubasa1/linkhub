<script setup lang="ts">
import type { PublicProfile } from '~/types/models'

const route = useRoute()
const username = computed(() => String(route.params.username))

const { data: profile, error } = await useFetch<PublicProfile>(
  () => `/api/users/${username.value}`,
  { key: `user-${username.value}` },
)

if (error.value?.statusCode === 404) {
  throw createError({ statusCode: 404, statusMessage: 'User not found', fatal: true })
}

useHead({
  title: () => (profile.value ? `@${profile.value.username} • Linkhub` : 'Linkhub'),
})
</script>

<template>
  <section class="max-w-2xl mx-auto p-6 text-center">
    <div v-if="error" class="opacity-70 py-12">
      <p class="text-xl mb-2">User not found</p>
      <p class="text-sm">No Linkhub profile exists for &quot;{{ username }}&quot;.</p>
    </div>
    <template v-else-if="profile">
      <Avatar
        :image="profile.avatarUrl ?? undefined"
        :label="profile.username[0]?.toUpperCase()"
        size="xlarge"
        shape="circle"
      />
      <h1 class="text-3xl mt-4 !text-[var(--linkhub-primary)]">@{{ profile.username }}</h1>
      <p class="opacity-90 mt-1">{{ profile.name }}</p>
      <p v-if="profile.bio" class="opacity-80 mt-3 mb-8 max-w-prose mx-auto">{{ profile.bio }}</p>
      <p v-else class="mb-8" />

      <ul v-if="profile.links.length > 0" class="flex flex-col gap-3">
        <li
          v-for="l in profile.links"
          :key="l.id"
          class="flex items-center gap-3 p-3 rounded border border-white/10 bg-[var(--linkhub-surface)] text-left"
        >
          <Avatar
            :image="l.imageUrl ?? undefined"
            :label="l.title[0]?.toUpperCase()"
            shape="circle"
          />
          <a
            :href="l.url"
            target="_blank"
            rel="noopener"
            class="flex-1 min-w-0 truncate !text-[var(--linkhub-text)] hover:opacity-80"
          >
            {{ l.title }}
          </a>
          <i class="pi pi-external-link opacity-60" />
        </li>
      </ul>
      <p v-else class="opacity-60 py-8">No links yet.</p>
    </template>
  </section>
</template>
