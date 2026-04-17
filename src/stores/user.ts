import { API_URL, USER_STORAGE_KEY } from '@/lib/constants'
import { ref } from 'vue'
import { defineStore } from 'pinia'
import { APIError } from '@/lib/utils'
import type { LoginCredentials, User } from '@/lib/types'

export const useUserStore = defineStore('user', () => {
  const user = ref<User>(getStoredUser() || null!)
  const isLoading = ref(false)

  function getStoredUser() {
    const user = localStorage.getItem(USER_STORAGE_KEY)
    if (user) {
      return JSON.parse(user) as User
    }
  }

  function setStoredUser(user: User) {
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user))
  }

  async function login(credentials: LoginCredentials) {
    isLoading.value = true

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
      isLoading.value = false
      return new APIError(res.status, 'Invalid credentials')
    }

    const data = await res.json()
    user.value = {
      access_token: data.access,
      username: data.username,
    }
    setStoredUser(user.value)
    isLoading.value = false
  }

  function logout() {
    localStorage.removeItem(USER_STORAGE_KEY)
    user.value = null!
    isLoading.value = false
  }

  return {
    user,
    isLoading,
    login,
    logout,
  }
})
