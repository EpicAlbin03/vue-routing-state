import { ref } from 'vue'
import { defineStore } from 'pinia'
import { API_URL } from '@/lib/constants'
import { useUserStore } from './user'
import { APIError } from '@/lib/utils'
import type { Course } from '@/lib/types'

export const useCourseStore = defineStore('courses', () => {
  const courses = ref<Course[]>([])
  const isLoading = ref(false)
  const userStore = useUserStore()

  async function load() {
    isLoading.value = true

    const res = await fetch(`${API_URL}/courses/`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userStore.user.access_token}`,
      },
    })

    if (!res.ok) {
      return new APIError(res.status, 'Failed to load courses')
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
