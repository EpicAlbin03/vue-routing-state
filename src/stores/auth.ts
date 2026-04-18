import { API_URL, JWT_STORAGE_KEY, USER_STORAGE_KEY } from '@/lib/constants'
import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { getStorageItem, setStorageItem } from '@/lib/utils'
import type { LoginCredentials, User } from '@/lib/types'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(getStorageItem(USER_STORAGE_KEY) || null)
  const isLoading = ref(false)
  const errorMessage = ref('')
  const accessToken = ref<string>(getStorageItem(JWT_STORAGE_KEY) || '')
  const hasValidAccessToken = computed(() => {
    if (!accessToken.value) {
      return false
    }
    return !isTokenExpired(accessToken.value)
  })

  function decodeJwtPayload(token: string) {
    try {
      const base64Url = token.split('.')[1]
      if (!base64Url) {
        return null
      }

      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
      const paddedBase64 = base64.padEnd(Math.ceil(base64.length / 4) * 4, '=')

      return JSON.parse(atob(paddedBase64)) as { exp?: number }
    } catch {
      return null
    }
  }

  function isTokenExpired(token: string) {
    const payload = decodeJwtPayload(token)

    if (!payload?.exp) {
      return true
    }

    return payload.exp * 1000 <= Date.now()
  }

  function validateAccessToken() {
    if (hasValidAccessToken.value) {
      return true
    }

    logout()
    return false
  }

  async function login(credentials: LoginCredentials) {
    isLoading.value = true
    errorMessage.value = ''

    const res = await fetch(`${API_URL}/token/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: credentials.username,
        password: credentials.password,
      }),
    })

    if (!res.ok) {
      errorMessage.value = 'Invalid credentials'
      isLoading.value = false
      return
    }

    const data = await res.json()
    accessToken.value = data.access
    user.value = {
      username: data.username,
    }
    setStorageItem(JWT_STORAGE_KEY, accessToken.value)
    setStorageItem(USER_STORAGE_KEY, user.value)
    isLoading.value = false
  }

  function logout() {
    localStorage.removeItem(USER_STORAGE_KEY)
    localStorage.removeItem(JWT_STORAGE_KEY)
    user.value = null
    accessToken.value = ''
    errorMessage.value = ''
    isLoading.value = false
  }

  return {
    user,
    isLoading,
    errorMessage,
    accessToken,
    hasValidAccessToken,
    login,
    logout,
    validateAccessToken,
  }
})
