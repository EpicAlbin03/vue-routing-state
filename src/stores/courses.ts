import { ref } from 'vue'
import { defineStore } from 'pinia'
import { API_URL } from '@/lib/constants'
import { APIError } from '@/lib/utils'
import type { Course } from '@/lib/types'
import { useAuthStore } from './auth'

export const useCourseStore = defineStore('courses', () => {
  const courses = ref<Course[]>([])
  const isLoading = ref(false)
  const authStore = useAuthStore()

  async function load() {
    isLoading.value = true

    const res = await fetch(`${API_URL}/courses/`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authStore.accessToken}`,
      },
    })

    if (!res.ok) {
      throw new APIError(res.status, 'Failed to load courses')
    }

    courses.value = await res.json()
    isLoading.value = false
  }

  return {
    courses,
    isLoading,
    load,
  }
})
