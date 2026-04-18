<script setup lang="ts">
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useRoute, useRouter } from 'vue-router'
import LoginForm from '@/components/LoginForm.vue'
import type { LoginCredentials } from '@/lib/types'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
const { errorMessage, isLoading } = storeToRefs(authStore)
const route = useRoute()
const router = useRouter()

const redirectPath = computed(() => {
  const redirect = route.query.redirect
  return typeof redirect === 'string' ? redirect : '/students'
})

async function handleLogin(credentials: LoginCredentials) {
  const isAuthenticated = await authStore.login(credentials)

  if (isAuthenticated) {
    await router.replace(redirectPath.value)
  }
}
</script>

<template>
  <section class="login-page">
    <LoginForm :error-message="errorMessage" :is-loading="isLoading" @submit="handleLogin" />
  </section>
</template>

<style scoped>
.login-page {
  max-width: 480px;
  margin: 40px auto 0;
}
</style>
