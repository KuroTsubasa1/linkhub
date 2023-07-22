<script setup lang="ts">
import PocketBase from 'pocketbase'
import {default as session_helper} from '../utils/session_helper'

const pb = new PocketBase(import.meta.env.VITE_API_URL);
const router = useRouter();

onMounted(() => {
  pb.authStore.clear();
  session_helper.destroyCookie(import.meta.env.VITE_AUTH_COOKIE)

  // redirect to login
  router.push({path: '/login'});

})
</script>

<template>

</template>

<style scoped>

</style>