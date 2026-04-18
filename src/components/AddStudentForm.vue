<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useCourseStore } from '@/stores/courses'
import { useStudentStore } from '@/stores/students'

const gradeOptions = ['A+', 'A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'C-', 'D+', 'D', 'D-', 'F']

const courseStore = useCourseStore()
const studentStore = useStudentStore()

const {
  courses,
  isLoading: courseIsLoading,
  errorMessage: courseErrorMessage,
} = storeToRefs(courseStore)
const { isLoading: studentIsLoading, errorMessage: studentErrorMessage } = storeToRefs(studentStore)

const name = ref('')
const email = ref('')
const grade = ref('A+')
const course = ref(-1)
const formError = ref('')

const hasCourses = computed(() => courses.value.length > 0)

// Set default course in select
watch(
  () => courses.value,
  (nextCourses) => {
    if (!nextCourses.length) {
      course.value = -1
      return
    }
    course.value = nextCourses[0]?.id ?? -1
  },
)

function resetForm() {
  name.value = ''
  email.value = ''
  grade.value = 'A+'
  formError.value = ''
}

async function handleSubmit() {
  formError.value = ''

  if (!name.value.trim() || !email.value.trim() || !grade.value || course.value < 0) {
    formError.value = 'All fields are required'
    return
  }

  const wasCreated = await studentStore.create({
    name: name.value.trim(),
    email: email.value.trim(),
    grade: grade.value,
    course: course.value,
  })

  if (!wasCreated) {
    formError.value = studentErrorMessage.value || 'Failed to create student'
    return
  }

  resetForm()
}
</script>

<template>
  <section class="card">
    <h3>Add New Student</h3>

    <form @submit.prevent="handleSubmit">
      <label for="student-name">Name</label>
      <input id="student-name" v-model="name" type="text" name="name" />

      <label for="student-email">Email</label>
      <input id="student-email" v-model="email" type="email" name="email" />

      <label for="student-grade">Grade</label>
      <select id="student-grade" v-model="grade" name="grade">
        <option v-for="gradeOption in gradeOptions" :key="gradeOption" :value="gradeOption">
          {{ gradeOption }}
        </option>
      </select>

      <label for="student-course">Course</label>
      <p v-if="courseIsLoading" class="status-message">Loading courses...</p>
      <p v-else-if="courseErrorMessage" class="error">{{ courseErrorMessage }}</p>
      <p v-else-if="!hasCourses" class="status-message">No courses yet</p>
      <select v-else id="student-course" v-model="course" name="course">
        <option v-for="course in courses" :key="course.id" :value="course.id">
          {{ course.name }}
        </option>
      </select>

      <p v-if="formError" class="error">{{ formError }}</p>
      <button type="submit" :disabled="!hasCourses || studentIsLoading">
        {{ studentIsLoading ? 'Saving...' : 'New Student' }}
      </button>
    </form>
  </section>
</template>
