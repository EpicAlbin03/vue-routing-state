import { ref } from 'vue'
import { defineStore } from 'pinia'
import { API_URL } from '@/lib/constants'
import type { Student, StudentFormData } from '@/lib/types'
import { useAuthStore } from './auth'

export const useStudentStore = defineStore('students', () => {
  const students = ref<Student[]>([])
  const isLoading = ref(false)
  const authStore = useAuthStore()
  const errorMessage = ref('')

  async function load() {
    isLoading.value = true
    errorMessage.value = ''

    const res = await fetch(`${API_URL}/students/`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authStore.accessToken}`,
      },
    })

    if (!res.ok) {
      errorMessage.value = 'Failed to load students'
      isLoading.value = false
      return
    }

    students.value = await res.json()
    isLoading.value = false
  }

  async function create(formData: StudentFormData) {
    errorMessage.value = ''

    const res = await fetch(`${API_URL}/students/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authStore.accessToken}`,
      },
      body: JSON.stringify(formData),
    })

    if (!res.ok) {
      errorMessage.value = 'Failed to create student'
      return
    }

    await load()
  }

  // 'delete' is reserved
  async function remove(id: number) {
    errorMessage.value = ''

    const res = await fetch(`${API_URL}/students/${id}/`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authStore.accessToken}`,
      },
    })

    if (!res.ok) {
      errorMessage.value = 'Failed to delete student'
      return
    }

    students.value = students.value.filter((s) => s.id !== id)
  }

  function getStudentsInCourse(courseId: number) {
    return students.value.filter((student) => student.course === courseId)
  }

  return {
    students,
    isLoading,
    errorMessage,
    load,
    create,
    remove,
    getStudentsInCourse,
  }
})
