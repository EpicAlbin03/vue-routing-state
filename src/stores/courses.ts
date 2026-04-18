import { ref } from 'vue'
import { defineStore } from 'pinia'
import { API_URL } from '@/lib/constants'
import type { Course } from '@/lib/types'
import { useAuthStore } from './auth'

export const useCourseStore = defineStore('courses', () => {
  const courses = ref<Course[]>([])
  const isLoading = ref(false)
  const errorMessage = ref('')
  const authStore = useAuthStore()

  async function load() {
    isLoading.value = true
    errorMessage.value = ''

    const res = await fetch(`${API_URL}/courses/`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authStore.accessToken}`,
      },
    })

    if (!res.ok) {
      errorMessage.value = 'Failed to load courses'
      isLoading.value = false
      return
    }

    courses.value = await res.json()
    isLoading.value = false
  }

  function getById(id: number) {
    return courses.value.find((course) => course.id === id) || null
  }

  function clear() {
    courses.value = []
    errorMessage.value = ''
    isLoading.value = false
  }

  return {
    courses,
    isLoading,
    errorMessage,
    load,
    getById,
    clear,
  }
})
