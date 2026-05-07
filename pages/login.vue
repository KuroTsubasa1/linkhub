<script setup lang="ts">
import { signIn } from '~/lib/auth-client'

definePageMeta({ middleware: 'guest' })
useHead({ title: 'Login • Linkhub' })

const route = useRoute()
const email = ref('')
const password = ref('')
const errorMsg = ref('')
const isSubmitting = ref(false)

async function onSubmit() {
  if (!email.value || !password.value) {
    errorMsg.value = 'Email and password are required.'
    return
  }
  errorMsg.value = ''
  isSubmitting.value = true
  try {
    const result = await signIn.email({
      email: email.value,
      password: password.value,
    })
    if (result.error) {
      errorMsg.value = result.error.message ?? 'Sign in failed.'
      return
    }
    const redirect = (route.query.redirect as string) || '/dashboard'
    await navigateTo(redirect)
  } catch (err: unknown) {
    errorMsg.value = readError(err, 'Sign in failed.')
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
      <template #title>Login</template>
      <template #content>
        <form class="flex flex-col gap-4" @submit.prevent="onSubmit">
          <div class="flex flex-col gap-1">
            <label for="email" class="text-sm">Email</label>
            <InputText id="email" v-model="email" type="email" required autocomplete="email" />
          </div>
          <div class="flex flex-col gap-1">
            <label for="password" class="text-sm">Password</label>
            <Password
              id="password"
              v-model="password"
              :feedback="false"
              toggle-mask
              fluid
              required
              autocomplete="current-password"
            />
          </div>
          <Message v-if="errorMsg" severity="error" :closable="false">{{ errorMsg }}</Message>
          <Button label="Login" type="submit" :loading="isSubmitting" />
        </form>
      </template>
      <template #footer>
        <p class="text-sm text-center">
          No account?
          <NuxtLink to="/register" class="!text-[var(--linkhub-primary)]">Register</NuxtLink>
        </p>
      </template>
    </Card>
  </section>
</template>
