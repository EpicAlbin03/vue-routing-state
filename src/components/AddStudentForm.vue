<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useCourseStore } from '@/stores/courses'
import { useStudentStore } from '@/stores/students'

const gradeOptions = ['A+', 'A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'C-', 'D+', 'D', 'D-', 'F']

const courseStore = useCourseStore()
const studentStore = useStudentStore()
const { courses, isLoading, errorMessage } = storeToRefs(courseStore)

const name = ref('')
const email = ref('')
const grade = ref('A')
const courseId = ref(-1)
const formError = ref('')

const hasCourses = computed(() => courses.value.length > 0)

function syncCourseSelection() {
  if (!courses.value.length) {
    courseId.value = -1
    return
  }

  const matchingCourse = courses.value.find((course) => course.id === courseId.value)
  if (!matchingCourse) {
    courseId.value = courses.value[0]?.id ?? -1
  }
}

function resetForm() {
  name.value = ''
  email.value = ''
  grade.value = 'A'
  formError.value = ''
  syncCourseSelection()
}

function handleSubmit() {
  syncCourseSelection()

  if (!name.value.trim() || !email.value.trim() || !grade.value || courseId.value < 0) {
    formError.value = 'All fields are required'
    return
  }

  studentStore.create({
    name: name.value.trim(),
    email: email.value.trim(),
    grade: grade.value,
    course: courseId.value,
  })

  resetForm()
}

watch(courses, syncCourseSelection, { immediate: true })
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
      <p v-if="isLoading" class="status-message">Loading courses...</p>
      <p v-else-if="errorMessage" class="error">{{ errorMessage }}</p>
      <p v-else-if="!hasCourses" class="status-message">No courses yet</p>
      <select v-else id="student-course" v-model="courseId" name="course">
        <option v-for="course in courses" :key="course.id" :value="course.id">
          {{ course.name }}
        </option>
      </select>

      <p v-if="formError" class="error">{{ formError }}</p>
      <button type="submit" :disabled="!hasCourses">New Student</button>
    </form>
  </section>
</template>
