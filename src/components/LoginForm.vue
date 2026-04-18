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
    <div class="login-copy">
      <h2>Login</h2>
      <p class="status-message">Use your student platform credentials to continue.</p>
    </div>

    <form @submit.prevent="handleSubmit">
      <label for="username">Username</label>
      <input id="username" v-model="username" type="text" name="username" autocomplete="username" />

      <label for="password">Password</label>
      <input
        id="password"
        v-model="password"
        type="password"
        name="password"
        autocomplete="current-password"
      />

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

.login-copy {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

form {
  padding: 24px;
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 14px;
  box-shadow: 0 10px 25px rgba(15, 23, 42, 0.05);
}

button {
  align-self: flex-start;
}

button:disabled {
  cursor: wait;
  opacity: 0.75;
}

@media (max-width: 768px) {
  button {
    width: 100%;
  }
}
</style>
