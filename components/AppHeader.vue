<script setup lang="ts">
import { authClient, signOut } from '~/lib/auth-client'

const { data: session } = await authClient.useSession(useFetch)
const isMobileMenuOpen = ref(false)

async function onLogout() {
  await signOut()
  await navigateTo('/login')
}

function closeMenu() {
  isMobileMenuOpen.value = false
}
</script>

<template>
  <header
    class="bg-[var(--linkhub-surface)] text-[var(--linkhub-text)] px-4 py-3 sm:px-8 flex items-center justify-between relative"
  >
    <NuxtLink to="/" class="text-xl font-bold !text-[var(--linkhub-text)]" @click="closeMenu">
      Link H.U.B
    </NuxtLink>

    <!-- Desktop nav -->
    <nav class="hidden md:flex items-center gap-3">
      <NuxtLink
        to="/"
        class="px-3 py-1.5 text-sm !text-[var(--linkhub-text)] hover:opacity-80"
      >
        Home
      </NuxtLink>
      <template v-if="session">
        <NuxtLink
          to="/dashboard"
          class="px-3 py-1.5 text-sm !text-[var(--linkhub-text)] hover:opacity-80"
        >
          Dashboard
        </NuxtLink>
        <Button
          label="Logout"
          icon="pi pi-sign-out"
          size="small"
          severity="secondary"
          @click="onLogout"
        />
      </template>
      <template v-else>
        <NuxtLink
          to="/login"
          class="px-3 py-1.5 text-sm !text-[var(--linkhub-text)] hover:opacity-80"
        >
          Login
        </NuxtLink>
        <NuxtLink to="/register">
          <Button label="Register" size="small" />
        </NuxtLink>
      </template>
    </nav>

    <!-- Mobile toggle -->
    <Button
      class="md:hidden"
      :icon="isMobileMenuOpen ? 'pi pi-times' : 'pi pi-bars'"
      severity="secondary"
      text
      rounded
      :aria-label="isMobileMenuOpen ? 'Close menu' : 'Open menu'"
      @click="isMobileMenuOpen = !isMobileMenuOpen"
    />

    <!-- Mobile menu -->
    <nav
      v-if="isMobileMenuOpen"
      class="md:hidden absolute top-full right-4 left-4 mt-2 bg-[var(--linkhub-surface)] border border-white/10 rounded p-3 flex flex-col gap-2 z-10"
    >
      <NuxtLink
        to="/"
        class="px-3 py-2 text-sm !text-[var(--linkhub-text)] hover:opacity-80"
        @click="closeMenu"
      >
        Home
      </NuxtLink>
      <template v-if="session">
        <NuxtLink
          to="/dashboard"
          class="px-3 py-2 text-sm !text-[var(--linkhub-text)] hover:opacity-80"
          @click="closeMenu"
        >
          Dashboard
        </NuxtLink>
        <Button
          label="Logout"
          icon="pi pi-sign-out"
          severity="secondary"
          @click="closeMenu(); onLogout()"
        />
      </template>
      <template v-else>
        <NuxtLink
          to="/login"
          class="px-3 py-2 text-sm !text-[var(--linkhub-text)] hover:opacity-80"
          @click="closeMenu"
        >
          Login
        </NuxtLink>
        <NuxtLink to="/register" @click="closeMenu">
          <Button label="Register" class="w-full" />
        </NuxtLink>
      </template>
    </nav>
  </header>
</template>
