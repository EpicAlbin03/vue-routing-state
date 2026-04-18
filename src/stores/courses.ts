import { ref } from 'vue'
import { acceptHMRUpdate, defineStore } from 'pinia'
import { API_URL } from '@/lib/constants'
import type { Course } from '@/lib/types'
import { useAuthStore } from './auth'

export const useCourseStore = defineStore('courses', () => {
  const courses = ref<Course[]>([])
  const isLoading = ref(false)
  const errorMessage = ref('')
  const authStore = useAuthStore()

  async function load() {
    if (isLoading.value) {
      return true
    }

    isLoading.value = true
    errorMessage.value = ''

    try {
      const res = await fetch(`${API_URL}/courses/`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authStore.accessToken}`,
        },
      })

      if (!res.ok) {
        errorMessage.value = 'Failed to load courses'
        return false
      }

      courses.value = (await res.json()) as Course[]
      return true
    } catch {
      errorMessage.value = 'Unable to load courses'
      return false
    } finally {
      isLoading.value = false
    }
  }

  async function loadCourse(id: number) {
    if (isLoading.value) {
      return null
    }

    isLoading.value = true
    errorMessage.value = ''

    try {
      const res = await fetch(`${API_URL}/courses/${id}/`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authStore.accessToken}`,
        },
      })

      if (!res.ok) {
        errorMessage.value = 'Failed to load course'
        return null
      }

      return (await res.json()) as Course
    } catch {
      errorMessage.value = 'Unable to load course'
      return null
    } finally {
      isLoading.value = false
    }
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
    loadCourse,
    getById,
    clear,
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useCourseStore, import.meta.hot))
}
