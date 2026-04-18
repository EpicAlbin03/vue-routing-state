<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import LoginForm from '@/components/LoginForm.vue'
import type { LoginCredentials } from '@/lib/types'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
const route = useRoute()
const router = useRouter()

const redirectPath = computed(() => {
  const redirect = route.query.redirect
  return typeof redirect === 'string' ? redirect : '/students'
})

async function handleLogin(credentials: LoginCredentials) {
  await authStore.login(credentials)

  if (authStore.hasValidAccessToken) {
    router.push(redirectPath.value)
  }
}
</script>

<template>
  <section class="login-page">
    <LoginForm
      :error-message="authStore.errorMessage"
      :is-loading="authStore.isLoading"
      @submit="handleLogin"
    />
  </section>
</template>

<style scoped>
.login-page {
  max-width: 480px;
  margin: 40px auto 0;
}
</style>
