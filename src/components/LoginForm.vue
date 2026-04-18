<script setup lang="ts">
import { ref } from 'vue'
import type { LoginCredentials } from '@/lib/types'

const props = defineProps<{
  errorMessage?: string
  isLoading?: boolean
}>()

const emit = defineEmits<{
  submit: [credentials: LoginCredentials]
}>()

const username = ref('')
const password = ref('')

function handleSubmit() {
  if (!username.value.trim() || !password.value) {
    return
  }

  emit('submit', {
    username: username.value.trim(),
    password: password.value,
  })
}
</script>

<template>
  <section class="login-form">
    <div class="login-header">
      <h2>Login</h2>
      <p class="status-message">Use your student platform credentials to continue.</p>
    </div>

    <form class="surface-form" @submit.prevent="handleSubmit">
      <label for="username">Username</label>
      <input id="username" v-model="username" type="text" name="username" />

      <label for="password">Password</label>
      <input id="password" v-model="password" type="password" name="password" />

      <button type="submit" :disabled="props.isLoading">
        {{ props.isLoading ? 'Logging in...' : 'Login' }}
      </button>
    </form>

    <p v-if="props.errorMessage" class="error">{{ props.errorMessage }}</p>
  </section>
</template>

<style scoped>
.login-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.login-header {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
</style>
