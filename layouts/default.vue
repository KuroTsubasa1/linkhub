<template>
    <div id="app">
     <lh-header :logged_id="pb.authStore.isValid" />
      <slot />
     <lh-footer />
    </div>
  </template>

<script setup>
import pocketbase from 'pocketbase'
const pb = new pocketbase(import.meta.env.VITE_API_URL);

</script>