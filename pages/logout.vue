<script setup lang="ts">
import { signOut } from '~/lib/auth-client'

useHead({ title: 'Signing out…' })

onMounted(async () => {
  await signOut()
  await navigateTo('/')
})
</script>

<template>
  <section class="flex items-center justify-center min-h-[40vh]">
    <p class="opacity-70">Signing out…</p>
  </section>
</template>
