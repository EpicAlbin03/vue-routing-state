import { ref } from 'vue'
import { defineStore } from 'pinia'
import { API_URL } from '@/lib/constants'
import { useUserStore } from './user'
import { APIError } from '@/lib/utils'
import type { Student, StudentFormData } from '@/lib/types'

export const useStudentStore = defineStore('students', () => {
  const students = ref<Student[]>([])
  const isLoading = ref(false)
  const userStore = useUserStore()

  async function load() {
    isLoading.value = true

    const res = await fetch(`${API_URL}/students/`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userStore.user.access_token}`,
      },
    })

    if (!res.ok) {
      return new APIError(res.status, 'Failed to load students')
    }

    students.value = await res.json()
    isLoading.value = false
  }

  async function create(formData: StudentFormData) {
    const res = await fetch(`${API_URL}/students/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userStore.user.access_token}`,
      },
      body: JSON.stringify(formData),
    })

    if (!res.ok) {
      throw new APIError(res.status, 'Failed to create student')
    }

    await load()
  }

  // 'delete' is reserved
  async function remove(id: number) {
    const res = await fetch(`${API_URL}/students/${id}/`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userStore.user.access_token}`,
      },
    })

    if (!res.ok) {
      throw new APIError(res.status, 'Failed to delete student')
    }

    students.value = students.value.filter((s) => s.id !== id)
  }

  return {
    students,
    isLoading,
    load,
    create,
    remove,
  }
})
