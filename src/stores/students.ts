import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { API_URL } from '@/lib/constants'
import type { Student, StudentFormData, StudentSortOption } from '@/lib/types'
import { useAuthStore } from './auth'

export const useStudentStore = defineStore('students', () => {
  const students = ref<Student[]>([])
  const isLoading = ref(false)
  const authStore = useAuthStore()
  const errorMessage = ref('')
  const searchTerm = ref('')
  const sortOption = ref<StudentSortOption>('name')

  function getGradeSortValue(grade: string) {
    const normalizedGrade = grade.trim().toUpperCase()
    const baseGradeValues: Record<string, number> = {
      A: 0,
      B: 3,
      C: 6,
      D: 9,
      F: 12,
    }

    const baseGrade = normalizedGrade[0]
    const modifier = normalizedGrade[1] ?? ''
    const baseValue = baseGradeValues[baseGrade as keyof typeof baseGradeValues]

    if (baseValue === undefined) {
      return Number.MAX_SAFE_INTEGER
    }

    if (baseGrade === 'F') {
      return baseValue
    }

    if (modifier === '+') {
      return baseValue
    }

    if (modifier === '-') {
      return baseValue + 2
    }

    return baseValue + 1
  }

  const filteredStudents = computed(() => {
    const normalizedSearchTerm = searchTerm.value.trim().toLowerCase()
    const matchingStudents = normalizedSearchTerm
      ? students.value.filter((student) => student.name.toLowerCase().includes(normalizedSearchTerm))
      : students.value

    const sortedStudents = [...matchingStudents]

    if (sortOption.value === 'name') {
      return sortedStudents.sort((a, b) => a.name.localeCompare(b.name))
    }

    return sortedStudents.sort((a, b) => {
      const gradeDifference = getGradeSortValue(a.grade) - getGradeSortValue(b.grade)

      if (gradeDifference === 0) {
        return a.name.localeCompare(b.name)
      }

      return gradeDifference
    })
  })

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

  function getById(id: number) {
    return students.value.find((student) => student.id === id) || null
  }

  function setSearchTerm(value: string) {
    searchTerm.value = value
  }

  function setSortOption(value: StudentSortOption) {
    sortOption.value = value
  }

  function resetFilters() {
    searchTerm.value = ''
    sortOption.value = 'name'
  }

  function clear() {
    students.value = []
    errorMessage.value = ''
    isLoading.value = false
    resetFilters()
  }

  return {
    students,
    isLoading,
    errorMessage,
    searchTerm,
    sortOption,
    filteredStudents,
    load,
    create,
    remove,
    getStudentsInCourse,
    getById,
    setSearchTerm,
    setSortOption,
    resetFilters,
    clear,
  }
})
