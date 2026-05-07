<script setup lang="ts">
import { authClient } from '~/lib/auth-client'

useHead({ title: 'Linkhub' })

const { data: session } = await authClient.useSession(useFetch)

const ctaTo = computed(() => (session.value ? '/dashboard' : '/register'))
const ctaLabel = computed(() => (session.value ? 'Open dashboard' : 'Get started for free'))
</script>

<template>
  <section class="px-4 sm:px-8">
    <div class="max-w-3xl mx-auto py-16 text-center">
      <h1 class="text-4xl sm:text-5xl font-bold mb-6 leading-tight">
        Connect your audience to all of your content with a single click.
      </h1>
      <p class="text-lg opacity-80 mb-8 leading-relaxed">
        Linkhub lets you build a personalized, customizable page that guides your audience to your
        entire online world — articles, store, social platforms, and more — all in one place.
      </p>
      <NuxtLink :to="ctaTo">
        <Button :label="ctaLabel" size="large" />
      </NuxtLink>
    </div>

    <div class="max-w-5xl mx-auto py-12">
      <h2 class="text-2xl text-center mb-10">Why Linkhub?</h2>
      <div class="grid md:grid-cols-3 gap-6">
        <div class="text-center p-4">
          <div class="text-3xl mb-3 text-[var(--linkhub-primary)]">
            <i class="pi pi-bolt" />
          </div>
          <h3 class="text-lg mb-2">Simple yet powerful</h3>
          <p class="opacity-80">
            Build your link hub in minutes. No coding. An intuitive interface to design, customize,
            and update your page anytime.
          </p>
        </div>
        <div class="text-center p-4">
          <div class="text-3xl mb-3 text-[var(--linkhub-primary)]">
            <i class="pi pi-palette" />
          </div>
          <h3 class="text-lg mb-2">Make it yours</h3>
          <p class="opacity-80">
            A dark-by-default look with your own avatar, bio, and per-link images. Stand out without
            wrestling a CMS.
          </p>
        </div>
        <div class="text-center p-4">
          <div class="text-3xl mb-3 text-[var(--linkhub-primary)]">
            <i class="pi pi-share-alt" />
          </div>
          <h3 class="text-lg mb-2">One link to share</h3>
          <p class="opacity-80">
            Your public profile lives at a clean URL like /your-username. Share it once, update the
            destinations whenever.
          </p>
        </div>
      </div>
    </div>
  </section>
</template>
