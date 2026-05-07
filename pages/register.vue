<script setup lang="ts">
import { signUp } from '~/lib/auth-client'

definePageMeta({ middleware: 'guest' })
useHead({ title: 'Register • Linkhub' })

const name = ref('')
const username = ref('')
const email = ref('')
const password = ref('')
const errorMsg = ref('')
const isSubmitting = ref(false)

const USERNAME_RE = /^[a-z0-9_-]{2,32}$/i

async function onSubmit() {
  if (!name.value || !username.value || !email.value || !password.value) {
    errorMsg.value = 'All fields are required.'
    return
  }
  if (!USERNAME_RE.test(username.value)) {
    errorMsg.value = 'Username must be 2-32 chars, letters/digits/_/- only.'
    return
  }
  errorMsg.value = ''
  isSubmitting.value = true
  try {
    const result = await signUp.email({
      name: name.value,
      email: email.value,
      password: password.value,
      // additionalFields are accepted but not in the base TS signature
      username: username.value,
    } as Parameters<typeof signUp.email>[0])
    if (result.error) {
      errorMsg.value = result.error.message ?? 'Registration failed.'
      return
    }
    await navigateTo('/dashboard')
  } catch (err: unknown) {
    errorMsg.value = readError(err, 'Registration failed.')
  } finally {
    isSubmitting.value = false
  }
}

function readError(err: unknown, fallback: string) {
  if (typeof err === 'object' && err !== null) {
    const m = err as { message?: string; statusMessage?: string }
    return m.statusMessage ?? m.message ?? fallback
  }
  return fallback
}
</script>

<template>
  <section class="max-w-md mx-auto p-4 sm:p-6 mt-8 sm:mt-12">
    <Card>
      <template #title>Create account</template>
      <template #content>
        <form class="flex flex-col gap-4" @submit.prevent="onSubmit">
          <div class="flex flex-col gap-1">
            <label for="name" class="text-sm">Display name</label>
            <InputText id="name" v-model="name" required autocomplete="name" />
          </div>
          <div class="flex flex-col gap-1">
            <label for="username" class="text-sm">Username</label>
            <InputText id="username" v-model="username" required />
            <small class="opacity-70">
              Your public profile lives at /your-username. 2-32 chars, letters/digits/_/-.
            </small>
          </div>
          <div class="flex flex-col gap-1">
            <label for="email" class="text-sm">Email</label>
            <InputText id="email" v-model="email" type="email" required autocomplete="email" />
          </div>
          <div class="flex flex-col gap-1">
            <label for="password" class="text-sm">Password</label>
            <Password
              id="password"
              v-model="password"
              toggle-mask
              fluid
              required
              autocomplete="new-password"
            />
          </div>
          <Message v-if="errorMsg" severity="error" :closable="false">{{ errorMsg }}</Message>
          <Button label="Create account" type="submit" :loading="isSubmitting" />
        </form>
      </template>
      <template #footer>
        <p class="text-sm text-center">
          Already have an account?
          <NuxtLink to="/login" class="!text-[var(--linkhub-primary)]">Login</NuxtLink>
        </p>
      </template>
    </Card>
  </section>
</template>
